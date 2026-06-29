"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { RadioStation } from "@/constants/radioStationsData";
import { RadioPlayerContextType } from "@/app/(pages)/radios/types";

const RadioContext = createContext<RadioPlayerContextType | null>(null);

const MAX_RETRIES = 6;
const STALL_TIMEOUT = 7000;

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(
    null,
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [favoriteStations, setFavoriteStations] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const retryCountRef = useRef<number>(0);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stallTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userStoppedRef = useRef<boolean>(false);
  const currentStationRef = useRef<RadioStation | null>(null);

  useEffect(() => {
    currentStationRef.current = currentStation;
  }, [currentStation]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favoriteRadioStations");
      if (saved) {
        try {
          setFavoriteStations(JSON.parse(saved));
        } catch {
          setFavoriteStations([]);
        }
      }
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && isHydrated) {
      localStorage.setItem(
        "favoriteRadioStations",
        JSON.stringify(favoriteStations),
      );
    }
  }, [favoriteStations, isHydrated]);

  const clearTimers = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (stallTimerRef.current) {
      clearTimeout(stallTimerRef.current);
      stallTimerRef.current = null;
    }
  }, []);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.8;
    }
    return audioRef.current;
  }, []);

  const internalStop = useCallback(() => {
    clearTimers();
    userStoppedRef.current = true;
    const audio = getAudio();
    audio.pause();
    audio.src = "";
    setIsPlaying(false);
    setIsConnecting(false);
    setError(null);
  }, [clearTimers, getAudio]);

  useEffect(() => {
    const handleQuranStarted = () => {
      internalStop();
      setCurrentStation(null);
    };
    window.addEventListener("quran:started", handleQuranStarted);
    return () => window.removeEventListener("quran:started", handleQuranStarted);
  }, [internalStop]);

  const beginStreamRef = useRef<(station: RadioStation) => void>(() => {});

  const onPlaySuccess = useCallback(() => {
    retryCountRef.current = 0;
    clearTimers();
    setIsConnecting(false);
    setIsPlaying(true);
    setError(null);
  }, [clearTimers]);

  const onPlayErrorFn = useCallback(() => {
    clearTimers();
    setIsConnecting(false);

    if (userStoppedRef.current) return;

    if (retryCountRef.current < MAX_RETRIES) {
      retryCountRef.current += 1;
      const delay = Math.min(1000 * retryCountRef.current, 8000);
      retryTimerRef.current = setTimeout(() => {
        const station = currentStationRef.current;
        if (station && !userStoppedRef.current) {
          beginStreamRef.current(station);
        }
      }, delay);
    } else {
      retryCountRef.current = 0;
      setIsPlaying(false);
      setError("error");
    }
  }, [clearTimers]);

  const onPlayErrorFnRef = useRef(onPlayErrorFn);
  useEffect(() => {
    onPlayErrorFnRef.current = onPlayErrorFn;
  }, [onPlayErrorFn]);

  const beginStream = useCallback(
    (station: RadioStation) => {
      clearTimers();
      setIsConnecting(true);
      setError(null);

      const audio = getAudio();
      audio.src =
        station.url +
        (station.url.includes("?") ? "&" : "?") +
        "_t=" +
        Date.now();
      audio.volume = 0.8;

      const playPromise = audio.play();
      if (playPromise) {
        playPromise.then(onPlaySuccess).catch(() => {
          onPlayErrorFnRef.current();
        });
      }

      stallTimerRef.current = setTimeout(() => {
        if (audio.paused || audio.readyState < 2) {
          onPlayErrorFnRef.current();
        }
      }, STALL_TIMEOUT);
    },
    [clearTimers, getAudio, onPlaySuccess],
  );

  useEffect(() => {
    beginStreamRef.current = beginStream;
  }, [beginStream]);

  const playStation = useCallback(
    (station: RadioStation) => {
      const isChanging = station.url !== currentStation?.url;
      setCurrentStation(station);
      retryCountRef.current = 0;
      userStoppedRef.current = false;

      window.dispatchEvent(new CustomEvent("radio:started"));

      if (isChanging) {
        const audio = getAudio();
        audio.pause();
        audio.src = "";
        beginStream(station);
      } else if (!isPlaying) {
        beginStream(station);
      }
    },
    [currentStation, isPlaying, getAudio, beginStream],
  );

  const togglePlayPause = useCallback(() => {
    if (!currentStation) return;

    const audio = getAudio();
    if (isPlaying) {
      userStoppedRef.current = true;
      clearTimers();
      audio.pause();
      audio.src = "";
      setIsPlaying(false);
      setIsConnecting(false);
    } else {
      window.dispatchEvent(new CustomEvent("radio:started"));
      retryCountRef.current = 0;
      userStoppedRef.current = false;
      beginStream(currentStation);
    }
  }, [currentStation, isPlaying, getAudio, clearTimers, beginStream]);

  const stop = useCallback(() => {
    internalStop();
    setCurrentStation(null);
  }, [internalStop]);

  const toggleMute = useCallback(() => {
    const audio = getAudio();
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted, getAudio]);

  const toggleFavorite = useCallback((station: RadioStation) => {
    setFavoriteStations((prev) => {
      const url = station.url;
      if (prev.includes(url)) {
        return prev.filter((u) => u !== url);
      }
      return [...prev, url];
    });
  }, []);

  const isFav = useCallback(
    (station: RadioStation) => favoriteStations.includes(station.url),
    [favoriteStations],
  );

  useEffect(() => {
    const audio = getAudio();

    const handleError = () => {
      if (!userStoppedRef.current && currentStationRef.current) {
        onPlayErrorFnRef.current();
      }
    };

    const handleStalled = () => {
      if (!userStoppedRef.current && currentStationRef.current && !audio.paused) {
        clearTimers();
        stallTimerRef.current = setTimeout(() => {
          if (!userStoppedRef.current) onPlayErrorFnRef.current();
        }, 4000);
      }
    };

    const handleWaiting = () => {
      if (!audio.paused) setIsConnecting(true);
    };

    const handlePlaying = () => {
      setIsConnecting(false);
      clearTimers();
    };

    const handleEnded = () => {
      if (!userStoppedRef.current && currentStationRef.current) {
        beginStreamRef.current(currentStationRef.current);
      }
    };

    audio.addEventListener("error", handleError);
    audio.addEventListener("stalled", handleStalled);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("stalled", handleStalled);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [getAudio, clearTimers]);

  useEffect(() => {
    return () => {
      clearTimers();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [clearTimers]);

  const setStation = useCallback(
    (station: RadioStation) => {
      playStation(station);
    },
    [playStation],
  );

  return (
    <RadioContext.Provider
      value={{
        isPlaying,
        currentStation,
        isConnecting,
        error,
        isMuted,
        playStation,
        togglePlayPause,
        stop,
        toggleMute,
        setStation,
        favoriteStations,
        toggleFavorite,
        isFavorite: isFav,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
};

export const useRadioPlayer = () => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error("useRadioPlayer must be used within a RadioProvider");
  }
  return context;
};
