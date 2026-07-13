"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { RepeatConfig, HifzRequest, PlaybackSpeed } from "@/components/general/audio-player/types";

interface QuranAudioContextType {
  surahNumber: number | null;
  reciterId: string;
  isPlaying: boolean;
  activeAyahIndex: number;
  isPlayerVisible: boolean;
  surahQueue: number[];
  currentAyahTime: number;
  currentAyahDuration: number;
  showProgressBar: boolean;
  showDetails: boolean;
  playSurah: (
    surahNumber: number,
    reciterId?: string,
    queue?: number[],
  ) => void;
  playSurahAyah: (
    surahNumber: number,
    ayahIndex: number,
    reciterId?: string,
    queue?: number[],
    stopAfterAyah?: boolean,
  ) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setActiveAyahIndex: (index: number) => void;
  setIsPlayerVisible: (visible: boolean) => void;
  setReciterId: (reciterId: string) => void;
  setCurrentAyahTime: (time: number) => void;
  setCurrentAyahDuration: (duration: number) => void;
  setShowProgressBar: (show: boolean) => void;
  setShowDetails: (show: boolean) => void;
  setSurahNumber: (num: number) => void;
  playTrigger: number;
  playAyahTrigger: number;
  requestedAyahIndex: number | null;
  stopAfterAyahIndex: number | null;
  scrollToAyahTrigger: number;
  triggerScrollToAyah: () => void;
  clearStopAfterAyah: () => void;
  repeatConfig: RepeatConfig | null;
  isRepeatModeActive: boolean;
  startRepeatMode: (config: RepeatConfig) => void;
  stopRepeatMode: () => void;
  hifzRequest: HifzRequest | null;
  requestHifzFromAyah: (surahNumber: number, ayahNumber: number) => void;
  clearHifzRequest: () => void;
  playbackRate: PlaybackSpeed;
  setPlaybackRate: (rate: number) => void;
}

const QuranAudioContext = createContext<QuranAudioContextType | null>(null);

export const QuranAudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [surahNumber, setSurahNumber] = useState<number | null>(null);
  const [reciterId, setReciterId] = useState<string>("ar.alafasy");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeAyahIndex, setActiveAyahIndex] = useState<number>(0);
  const [isPlayerVisible, setIsPlayerVisible] = useState<boolean>(false);
  const [surahQueue, setSurahQueue] = useState<number[]>([]);
  const [currentAyahTime, setCurrentAyahTime] = useState<number>(0);
  const [currentAyahDuration, setCurrentAyahDuration] = useState<number>(0);
  const [showProgressBar, setShowProgressBar] = useState<boolean>(true);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [playTrigger, setPlayTrigger] = useState<number>(0);
  const [playAyahTrigger, setPlayAyahTrigger] = useState<number>(0);
  const [requestedAyahIndex, setRequestedAyahIndex] = useState<number | null>(
    null,
  );
  const [stopAfterAyahIndex, setStopAfterAyahIndex] = useState<number | null>(
    null,
  );
  const [scrollToAyahTrigger, setScrollToAyahTrigger] = useState<number>(0);

  const [repeatConfig, setRepeatConfig] = useState<RepeatConfig | null>(null);
  const [isRepeatModeActive, setIsRepeatModeActive] = useState<boolean>(false);
  const [hifzRequest, setHifzRequest] = useState<HifzRequest | null>(null);

  const [playbackRate, setPlaybackRateState] = useState<PlaybackSpeed>(1);
  const setPlaybackRate = (rate: number) =>
    setPlaybackRateState(rate as PlaybackSpeed);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("audioPlaybackRate");
      if (saved) {
        const parsed = parseFloat(saved);
        if (parsed === 1 || parsed === 0.75 || parsed === 0.5) {
          setPlaybackRate(parsed as PlaybackSpeed);
        }
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("audioPlaybackRate", String(playbackRate));
  }, [playbackRate]);

  const triggerScrollToAyah = useCallback(() => {
    setScrollToAyahTrigger((t) => t + 1);
  }, []);

  const clearStopAfterAyah = useCallback(() => {
    setStopAfterAyahIndex(null);
  }, []);

  const startRepeatMode = useCallback((config: RepeatConfig) => {
    setRepeatConfig(config);
    setIsRepeatModeActive(true);
  }, []);

  const stopRepeatMode = useCallback(() => {
    setIsRepeatModeActive(false);
    setRepeatConfig(null);
  }, []);

  const clearHifzRequest = useCallback(() => {
    setHifzRequest(null);
  }, []);

  const requestHifzFromAyah = useCallback(
    (sNumber: number, ayahNumber: number) => {
      if (surahNumber !== sNumber || !isPlayerVisible) {
        setSurahNumber(sNumber);
        setSurahQueue([]);
        setActiveAyahIndex(ayahNumber - 1);
        setRequestedAyahIndex(ayahNumber - 1);
        setStopAfterAyahIndex(null);
        setIsPlayerVisible(true);
        setIsPlaying(true);
        setPlayAyahTrigger((t) => t + 1);
      }
      setHifzRequest({
        startAyah: ayahNumber,
        mode: "custom",
        openEndPicker: true,
      });
    },
    [
      surahNumber,
      isPlayerVisible,
      setSurahNumber,
      setSurahQueue,
      setActiveAyahIndex,
      setRequestedAyahIndex,
      setStopAfterAyahIndex,
      setIsPlayerVisible,
      setIsPlaying,
      setPlayAyahTrigger,
    ],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedReciter = localStorage.getItem("preferredReciter");
      if (savedReciter) {
        setReciterId(savedReciter);
      }
    }
  }, []);

  const playSurah = useCallback(
    (sNumber: number, rId?: string, queue: number[] = []) => {
      setSurahNumber(sNumber);
      setSurahQueue(queue);
      if (rId) {
        setReciterId(rId);
        localStorage.setItem("preferredReciter", rId);
      }
      setActiveAyahIndex(0);
      setRequestedAyahIndex(null);
      setStopAfterAyahIndex(null);
      setIsRepeatModeActive(false);
      setRepeatConfig(null);
      setHifzRequest(null);
      setIsPlayerVisible(true);
      setIsPlaying(true);
      setPlayTrigger((t) => t + 1);
      setScrollToAyahTrigger((t) => t + 1);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("quran:started"));
      }
    },
    [],
  );

  const playSurahAyah = useCallback(
    (
      sNumber: number,
      ayahIndex: number,
      rId?: string,
      queue: number[] = [],
      stopAfterAyah = false,
    ) => {
      setSurahNumber(sNumber);
      setSurahQueue(queue);
      if (rId) {
        setReciterId(rId);
        localStorage.setItem("preferredReciter", rId);
      }
      setActiveAyahIndex(ayahIndex);
      setRequestedAyahIndex(ayahIndex);
      setStopAfterAyahIndex(stopAfterAyah ? ayahIndex : null);
      setIsRepeatModeActive(false);
      setRepeatConfig(null);
      setHifzRequest(null);
      setIsPlayerVisible(true);
      setIsPlaying(true);
      setPlayAyahTrigger((t) => t + 1);
      setScrollToAyahTrigger((t) => t + 1);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("quran:started"));
      }
    },
    [],
  );

  return (
    <QuranAudioContext.Provider
      value={{
        surahNumber,
        reciterId,
        isPlaying,
        activeAyahIndex,
        isPlayerVisible,
        surahQueue,
        currentAyahTime,
        currentAyahDuration,
        showProgressBar,
        showDetails,
        playTrigger,
        playAyahTrigger,
        requestedAyahIndex,
        stopAfterAyahIndex,
        scrollToAyahTrigger,
        triggerScrollToAyah,
        clearStopAfterAyah,
        repeatConfig,
        isRepeatModeActive,
        startRepeatMode,
        stopRepeatMode,
        hifzRequest,
        requestHifzFromAyah,
        clearHifzRequest,
        playbackRate,
        setPlaybackRate,
        playSurah,
        playSurahAyah,
        setIsPlaying,
        setActiveAyahIndex,
        setIsPlayerVisible,
        setReciterId,
        setCurrentAyahTime,
        setCurrentAyahDuration,
        setShowProgressBar,
        setShowDetails,
        setSurahNumber,
      }}
    >
      {children}
    </QuranAudioContext.Provider>
  );
};

export const useQuranAudio = () => {
  const context = useContext(QuranAudioContext);
  if (!context) {
    throw new Error("useQuranAudio must be used within a QuranAudioProvider");
  }
  return context;
};
