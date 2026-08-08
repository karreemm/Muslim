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

const RETRY_DELAYS = [1000, 2000, 4000, 8000, 15000];
const STALL_TIMEOUT = 20000;
const STARTUP_TIMEOUT = 15000;

function getRadioStreamUrl(rawUrl: string): string {
  if (rawUrl.startsWith("https://")) return rawUrl;
  return `/api/radio-proxy?url=${encodeURIComponent(rawUrl)}`;
}

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
  const startupTimerRef = useRef<NodeJS.Timeout | null>(null);
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
    if (startupTimerRef.current) {
      clearTimeout(startupTimerRef.current);
      startupTimerRef.current = null;
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
    audio.removeAttribute("src");
    audio.load();
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
    return () =>
      window.removeEventListener("quran:started", handleQuranStarted);
  }, [internalStop]);

  const beginStreamRef = useRef<(station: RadioStation) => void>(() => {});
  const scheduleReconnectRef = useRef<() => void>(() => {});

  const onPlaySuccess = useCallback(() => {
    retryCountRef.current = 0;
    clearTimers();
    setIsConnecting(false);
    setIsPlaying(true);
    setError(null);
  }, [clearTimers]);

  const scheduleReconnect = useCallback(() => {
    if (userStoppedRef.current) return;
    if (retryTimerRef.current) return;

    clearTimers();
    if (retryCountRef.current < RETRY_DELAYS.length) {
      setIsConnecting(true);
      const delay = RETRY_DELAYS[retryCountRef.current];
      retryCountRef.current += 1;
      retryTimerRef.current = setTimeout(() => {
        const station = currentStationRef.current;
        if (station && !userStoppedRef.current) {
          beginStreamRef.current(station);
        }
      }, delay);
    } else {
      retryCountRef.current = 0;
      setIsConnecting(false);
      setIsPlaying(false);
      setError("error");
    }
  }, [clearTimers]);

  useEffect(() => {
    scheduleReconnectRef.current = scheduleReconnect;
  }, [scheduleReconnect]);

  const beginStream = useCallback(
    (station: RadioStation) => {
      clearTimers();
      setIsConnecting(true);
      setError(null);

      const audio = getAudio();
      audio.src =
        getRadioStreamUrl(station.url) +
        (station.url.includes("?") ? "&" : "?") +
        "_t=" +
        Date.now();
      audio.volume = 0.8;

      const playPromise = audio.play();
      if (playPromise) {
        playPromise.then(onPlaySuccess).catch(() => {
          // play() was rejected (e.g. a transient network failure). Retry gently.
          scheduleReconnectRef.current();
        });
      }

      startupTimerRef.current = setTimeout(() => {
        startupTimerRef.current = null;
        if (
          !userStoppedRef.current &&
          currentStationRef.current &&
          (audio.paused || audio.readyState < 2)
        ) {
          scheduleReconnectRef.current();
        }
      }, STARTUP_TIMEOUT);
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
        audio.removeAttribute("src");
        audio.load();
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
      audio.removeAttribute("src");
      audio.load();
      setIsPlaying(false);
      setIsConnecting(false);
      setError(null);
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
      if (userStoppedRef.current || !currentStationRef.current) return;
      if (!audio.error || audio.error.code === MediaError.MEDIA_ERR_ABORTED) {
        return;
      }
      scheduleReconnectRef.current();
    };

    const handleStalled = () => {
      if (userStoppedRef.current || !currentStationRef.current) return;
      if (audio.paused) return;
      if (stallTimerRef.current) return;
      stallTimerRef.current = setTimeout(() => {
        stallTimerRef.current = null;
        if (
          !userStoppedRef.current &&
          currentStationRef.current &&
          (audio.paused || audio.readyState < 3)
        ) {
          scheduleReconnectRef.current();
        }
      }, STALL_TIMEOUT);
    };

    const handlePlaying = () => {
      retryCountRef.current = 0;
      clearTimers();
      setIsConnecting(false);
      setIsPlaying(true);
      setError(null);
    };

    const handleEnded = () => {
      if (!userStoppedRef.current && currentStationRef.current) {
        scheduleReconnectRef.current();
      }
    };

    audio.addEventListener("error", handleError);
    audio.addEventListener("stalled", handleStalled);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("stalled", handleStalled);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [getAudio, clearTimers]);

  useEffect(() => {
    return () => {
      clearTimers();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
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
