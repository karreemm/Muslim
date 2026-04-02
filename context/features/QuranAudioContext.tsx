"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

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

  const triggerScrollToAyah = useCallback(() => {
    setScrollToAyahTrigger((t) => t + 1);
  }, []);

  const clearStopAfterAyah = useCallback(() => {
    setStopAfterAyahIndex(null);
  }, []);

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
      setIsPlayerVisible(true);
      setIsPlaying(true);
      setPlayTrigger((t) => t + 1);
      setScrollToAyahTrigger((t) => t + 1);
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
      setIsPlayerVisible(true);
      setIsPlaying(true);
      setPlayAyahTrigger((t) => t + 1);
      setScrollToAyahTrigger((t) => t + 1);
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
