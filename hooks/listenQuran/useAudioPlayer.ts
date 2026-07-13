import { useEffect, useState, useRef } from "react";
import { Surah } from "../../app/(pages)/listen-quran/service/GetSurah";
import audioDurationsSummary from "../../data/listenQuran/audioDurationsSummary.json";
import { RepeatConfig } from "@/components/general/audio-player/types";

export interface UseAudioPlayerOptions {
  stopAfterAyahIndex?: number | null;
  repeatConfig?: RepeatConfig | null;
  isRepeatModeActive?: boolean;
  onStopRepeat?: () => void;
  playbackRate?: number;
}

export function useAudioPlayer(
  surah: Surah | null,
  reciterId: string,
  surahNumber: number,
  options: UseAudioPlayerOptions = {},
) {
  const {
    stopAfterAyahIndex = null,
    repeatConfig = null,
    isRepeatModeActive = false,
    onStopRepeat = () => {},
    playbackRate = 1,
  } = options;

  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [shouldAutoPlay, setShouldAutoPlay] = useState<boolean>(true);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [ayahDurations, setAyahDurations] = useState<number[]>([]);
  const [cumulativeDurations, setCumulativeDurations] = useState<number[]>([]);
  const [currentAyahElapsedTime, setCurrentAyahElapsedTime] =
    useState<number>(0);
  const [currentAyahTotalDuration, setCurrentAyahTotalDuration] =
    useState<number>(0);
  const [playRequestCounter, setPlayRequestCounter] = useState<number>(0);
  const [currentRepeatCount, setCurrentRepeatCount] = useState<number>(0);

  const audioPlayer = useRef<HTMLAudioElement>(null);
  const nextAudioPlayer = useRef<HTMLAudioElement>(null);
  const [isUsingPrimary, setIsUsingPrimary] = useState<boolean>(true);
  const transitionTriggeredRef = useRef<boolean>(false);
  const isTransitioningRef = useRef<boolean>(false);
  const seekingRef = useRef<boolean>(false);

  const currentRepeatCountRef = useRef<number>(0);
  const repeatConfigRef = useRef<RepeatConfig | null>(repeatConfig);
  const repeatActiveRef = useRef<boolean>(isRepeatModeActive);
  const stopRepeatRef = useRef<typeof onStopRepeat>(onStopRepeat);
  const playAyahRef = useRef<(i: number) => void>(() => {});
  const playbackRateRef = useRef<number>(playbackRate);
  repeatConfigRef.current = repeatConfig;
  repeatActiveRef.current = isRepeatModeActive;
  stopRepeatRef.current = onStopRepeat;
  playbackRateRef.current = playbackRate;


  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      console.log("User interaction detected, autoplay enabled");
    };

    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const lastConfigRef = useRef<RepeatConfig | null>(repeatConfig);
  useEffect(() => {
    if (!isRepeatModeActive) {
      currentRepeatCountRef.current = 0;
      setCurrentRepeatCount(0);
    }
  }, [isRepeatModeActive]);

  useEffect(() => {
    if (lastConfigRef.current !== repeatConfig) {
      lastConfigRef.current = repeatConfig;
      currentRepeatCountRef.current = 0;
      setCurrentRepeatCount(0);
    }
  }, [repeatConfig]);

  useEffect(() => {
    if (audioPlayer.current) audioPlayer.current.playbackRate = playbackRate;
    if (nextAudioPlayer.current)
      nextAudioPlayer.current.playbackRate = playbackRate;
  }, [playbackRate]);

  const prevSurahNumberRef = useRef<number | undefined>(undefined);
  const prevReciterIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (surah) {
      if (prevSurahNumberRef.current !== surahNumber) {
        console.log("Surah changed, resetting state");
        setCurrentAyahIndex(0);
        setShouldAutoPlay(true);
        setIsPlaying(false);
        setIsUsingPrimary(true);
        setCurrentTime(0);
        setDuration(0);
        setAyahDurations([]);
        setCumulativeDurations([]);
        transitionTriggeredRef.current = false;
        isTransitioningRef.current = false;
        seekingRef.current = false;

        if (audioPlayer.current) {
          audioPlayer.current.pause();
          audioPlayer.current.currentTime = 0;
          audioPlayer.current.src = "";
        }
        if (nextAudioPlayer.current) {
          nextAudioPlayer.current.pause();
          nextAudioPlayer.current.currentTime = 0;
          nextAudioPlayer.current.src = "";
        }
      } else if (prevReciterIdRef.current !== reciterId) {
        console.log("Reciter changed, keeping current ayah position");
        setCurrentTime(0);
        setCurrentAyahElapsedTime(0);
        setCurrentAyahTotalDuration(0);
        setDuration(0);
        setShouldAutoPlay(isPlayingRef.current);
        setIsPlaying(false);
        setIsUsingPrimary(true);
        transitionTriggeredRef.current = false;
        isTransitioningRef.current = false;
        seekingRef.current = false;

        if (audioPlayer.current) {
          audioPlayer.current.pause();
          audioPlayer.current.currentTime = 0;
          audioPlayer.current.src = "";
        }
        if (nextAudioPlayer.current) {
          nextAudioPlayer.current.pause();
          nextAudioPlayer.current.currentTime = 0;
          nextAudioPlayer.current.src = "";
        }
      }
      prevSurahNumberRef.current = surahNumber;
      prevReciterIdRef.current = reciterId;
    }
  }, [surah, surahNumber, reciterId]);

  useEffect(() => {
    if (!surah || !surah.ayahs || !reciterId || !surahNumber) return;

    console.log(
      "Loading ayah durations from JSON for:",
      reciterId,
      "surah:",
      surahNumber,
    );

    const reciterData = (audioDurationsSummary as any)[reciterId];
    if (!reciterData) {
      console.warn(`No duration data found for reciter: ${reciterId}`);
      return;
    }

    const surahData = reciterData[surahNumber.toString()];
    if (!surahData) {
      console.warn(
        `No duration data found for surah ${surahNumber} with reciter ${reciterId}`,
      );
      return;
    }

    const durations = surahData.ayahDurations || [];
    setAyahDurations(durations);

    const cumulative: number[] = [];
    let sum = 0;
    for (const dur of durations) {
      cumulative.push(sum);
      sum += dur;
    }
    setCumulativeDurations(cumulative);
    setDuration(sum);
    console.log("Ayah durations loaded from JSON, total:", sum);
  }, [surah, reciterId, surahNumber]);

  useEffect(() => {
    if (
      surah &&
      nextAudioPlayer.current &&
      currentAyahIndex < surah.ayahs.length - 1
    ) {
      const nextAyah = surah.ayahs[currentAyahIndex + 1];
      const inactivePlayer = isUsingPrimary
        ? nextAudioPlayer.current
        : audioPlayer.current;

      if (inactivePlayer && !seekingRef.current) {
        inactivePlayer.src = nextAyah.audio;
        inactivePlayer.load();
      }
      console.log(`Preloaded ayah ${currentAyahIndex + 2}`);
    }
  }, [surah, currentAyahIndex, isUsingPrimary]);

  useEffect(() => {
    if (
      surah &&
      audioPlayer.current &&
      nextAudioPlayer.current &&
      currentAyahIndex < surah.ayahs.length
    ) {
      const currentAyah = surah.ayahs[currentAyahIndex];
      const activePlayer = isUsingPrimary
        ? audioPlayer.current
        : nextAudioPlayer.current;

      transitionTriggeredRef.current = false;

      if (activePlayer.src !== currentAyah.audio && !seekingRef.current) {
        activePlayer.src = currentAyah.audio;
        activePlayer.load();
      }

      const handleCanPlay = () => {
        console.log(
          "Audio can play, shouldAutoPlay:",
          shouldAutoPlay,
          "userInteracted:",
          userInteracted,
        );
        activePlayer.playbackRate = playbackRateRef.current;
        if (shouldAutoPlay && !seekingRef.current) {
          activePlayer
            .play()
            .then(() => {
              console.log("Audio started playing successfully");
              setIsPlaying(true);
              setUserInteracted(true);
            })
            .catch((error) => {
              console.warn("Auto-play blocked by browser:", error.message);
              console.log(
                "User needs to interact with the page to start audio",
              );
              setIsPlaying(false);
            });
        }
      };

      const handlePlay = () => {
        console.log("Audio play event fired");
        if (!isTransitioningRef.current) {
          setIsPlaying(true);
        }
      };

      const handlePause = () => {
        console.log(
          "Audio pause event fired, isTransitioning:",
          isTransitioningRef.current,
        );
        if (!isTransitioningRef.current && !seekingRef.current) {
          setIsPlaying(false);
        }
      };

      const advanceToNextAyah = () => {
        isTransitioningRef.current = true;
        const inactivePlayer = isUsingPrimary
          ? nextAudioPlayer.current
          : audioPlayer.current;
        const active = isUsingPrimary
          ? audioPlayer.current
          : nextAudioPlayer.current;

        if (inactivePlayer && inactivePlayer.readyState >= 2) {
          inactivePlayer
            .play()
            .then(() => {
              console.log("Next ayah started seamlessly");
              setCurrentAyahIndex(currentAyahIndex + 1);
              setIsUsingPrimary(!isUsingPrimary);

              setTimeout(() => {
                if (active) {
                  active.pause();
                  active.currentTime = 0;
                }
                isTransitioningRef.current = false;
              }, 100);
            })
            .catch((error) => {
              console.error("Error starting next ayah:", error);
              isTransitioningRef.current = false;
            });
        } else {
          isTransitioningRef.current = false;
          if (currentAyahIndex < surah.ayahs.length - 1) {
            setCurrentAyahIndex(currentAyahIndex + 1);
            setIsUsingPrimary(!isUsingPrimary);
          }
        }
      };

      const replayCurrentAyah = () => {
        const active = isUsingPrimary
          ? audioPlayer.current
          : nextAudioPlayer.current;
        if (!active) {
          transitionTriggeredRef.current = false;
          return;
        }
        seekingRef.current = true;
        try {
          active.currentTime = 0;
        } catch {
        }
        active
          .play()
          .then(() => {
            seekingRef.current = false;
            transitionTriggeredRef.current = false;
          })
          .catch(() => {
            seekingRef.current = false;
            transitionTriggeredRef.current = false;
          });
      };

      const handleAyahComplete = () => {
        if (transitionTriggeredRef.current || seekingRef.current) return;
        transitionTriggeredRef.current = true;

        if (repeatActiveRef.current && repeatConfigRef.current) {
          const cfg = repeatConfigRef.current;
          const endIndex = cfg.endAyah - 1;
          const repeats =
            cfg.repeatsPerAyah === Infinity ? Infinity : cfg.repeatsPerAyah;

          if (currentRepeatCountRef.current < repeats - 1) {
            currentRepeatCountRef.current = currentRepeatCountRef.current + 1;
            setCurrentRepeatCount(currentRepeatCountRef.current);
            replayCurrentAyah();
            return;
          }

          currentRepeatCountRef.current = 0;
          setCurrentRepeatCount(0);

          if (currentAyahIndex < endIndex) {
            advanceToNextAyah();
            return;
          }

          if (cfg.onRangeComplete === "loop") {
            const startIndex = cfg.startAyah - 1;
            if (startIndex === currentAyahIndex) {
              replayCurrentAyah();
            } else {
              playAyahRef.current(startIndex);
            }
            return;
          }
          pause();
          setShouldAutoPlay(false);
          stopRepeatRef.current();
          transitionTriggeredRef.current = false;
          return;
        }

        const shouldStopAfter =
          stopAfterAyahIndex !== null && stopAfterAyahIndex === currentAyahIndex;
        if (shouldStopAfter) {
          setShouldAutoPlay(false);
          setIsPlaying(false);
          return;
        }

        if (currentAyahIndex < surah.ayahs.length - 1) {
          advanceToNextAyah();
        } else {
          setShouldAutoPlay(false);
          setIsPlaying(false);
        }
      };

      const handleTimeUpdate = () => {
        if (
          !isDragging &&
          cumulativeDurations.length > 0 &&
          !seekingRef.current
        ) {
          const absoluteTime =
            cumulativeDurations[currentAyahIndex] + activePlayer.currentTime;
          setCurrentTime(absoluteTime);
          setCurrentAyahElapsedTime(activePlayer.currentTime);
          setCurrentAyahTotalDuration(
            activePlayer.duration || ayahDurations[currentAyahIndex] || 1,
          );
        }

        const timeLeft = activePlayer.duration - activePlayer.currentTime;
        if (
          timeLeft <= 0.3 &&
          !transitionTriggeredRef.current &&
          !seekingRef.current
        ) {
          handleAyahComplete();
        }
      };

      const handleEnded = () => {
        console.log("Audio ended event fired");
        if (!transitionTriggeredRef.current && !seekingRef.current) {
          handleAyahComplete();
        }
      };

      activePlayer.removeEventListener("canplay", handleCanPlay);
      activePlayer.removeEventListener("play", handlePlay);
      activePlayer.removeEventListener("pause", handlePause);
      activePlayer.removeEventListener("timeupdate", handleTimeUpdate);
      activePlayer.removeEventListener("ended", handleEnded);

      activePlayer.addEventListener("canplay", handleCanPlay);
      activePlayer.addEventListener("play", handlePlay);
      activePlayer.addEventListener("pause", handlePause);
      activePlayer.addEventListener("timeupdate", handleTimeUpdate);
      activePlayer.addEventListener("ended", handleEnded);

      return () => {
        activePlayer.removeEventListener("canplay", handleCanPlay);
        activePlayer.removeEventListener("play", handlePlay);
        activePlayer.removeEventListener("pause", handlePause);
        activePlayer.removeEventListener("timeupdate", handleTimeUpdate);
        activePlayer.removeEventListener("ended", handleEnded);
      };
    }
  }, [
    surah,
    currentAyahIndex,
    shouldAutoPlay,
    isUsingPrimary,
    isDragging,
    cumulativeDurations,
    playRequestCounter,
    stopAfterAyahIndex,
  ]);

  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  useEffect(() => {
    const handleBufferingStart = () => {
      if (seekingRef.current || !isPlayingRef.current) {
        setIsBuffering(true);
      }
    };
    const handleBufferingEnd = () => setIsBuffering(false);

    if (audioPlayer.current) {
      audioPlayer.current.addEventListener("waiting", handleBufferingStart);
      audioPlayer.current.addEventListener("loadstart", handleBufferingStart);
      audioPlayer.current.addEventListener("canplay", handleBufferingEnd);
      audioPlayer.current.addEventListener("playing", handleBufferingEnd);
    }
    if (nextAudioPlayer.current) {
      nextAudioPlayer.current.addEventListener("waiting", handleBufferingStart);
      nextAudioPlayer.current.addEventListener(
        "loadstart",
        handleBufferingStart,
      );
      nextAudioPlayer.current.addEventListener("canplay", handleBufferingEnd);
      nextAudioPlayer.current.addEventListener("playing", handleBufferingEnd);
    }

    return () => {
      if (audioPlayer.current) {
        audioPlayer.current.removeEventListener(
          "waiting",
          handleBufferingStart,
        );
        audioPlayer.current.removeEventListener(
          "loadstart",
          handleBufferingStart,
        );
        audioPlayer.current.removeEventListener("canplay", handleBufferingEnd);
        audioPlayer.current.removeEventListener("playing", handleBufferingEnd);
      }
      if (nextAudioPlayer.current) {
        nextAudioPlayer.current.removeEventListener(
          "waiting",
          handleBufferingStart,
        );
        nextAudioPlayer.current.removeEventListener(
          "loadstart",
          handleBufferingStart,
        );
        nextAudioPlayer.current.removeEventListener(
          "canplay",
          handleBufferingEnd,
        );
        nextAudioPlayer.current.removeEventListener(
          "playing",
          handleBufferingEnd,
        );
      }
    };
  }, [audioPlayer.current, nextAudioPlayer.current]);

  const stopAllPlayers = () => {
    if (audioPlayer.current) {
      audioPlayer.current.pause();
      audioPlayer.current.currentTime = 0;
    }
    if (nextAudioPlayer.current) {
      nextAudioPlayer.current.pause();
      nextAudioPlayer.current.currentTime = 0;
    }
    setIsBuffering(false);
  };

  const restart = () => {
    stopAllPlayers();
    setCurrentAyahIndex(0);
    setCurrentTime(0);
    setShouldAutoPlay(true);
    setIsUsingPrimary(true);
    transitionTriggeredRef.current = false;
    isTransitioningRef.current = false;
    seekingRef.current = false;
    setIsBuffering(false);
  };

  const playAyah = (ayahIndex: number) => {
    if (surah && ayahIndex >= 0 && ayahIndex < surah.ayahs.length) {
      stopAllPlayers();

      if (audioPlayer.current) {
        audioPlayer.current.src = "";
      }
      if (nextAudioPlayer.current) {
        nextAudioPlayer.current.src = "";
      }

      setCurrentAyahIndex(ayahIndex);
      setCurrentTime(cumulativeDurations[ayahIndex] || 0);
      setCurrentAyahElapsedTime(0);
      setCurrentAyahTotalDuration(0);
      setShouldAutoPlay(true);
      transitionTriggeredRef.current = false;
      isTransitioningRef.current = false;
      seekingRef.current = false;
      setIsBuffering(false);
      setPlayRequestCounter((prev) => prev + 1);
    }
  };
  playAyahRef.current = playAyah;

  const pause = () => {
    const activePlayer = isUsingPrimary
      ? audioPlayer.current
      : nextAudioPlayer.current;
    if (activePlayer && !activePlayer.paused) {
      isTransitioningRef.current = false;
      activePlayer.pause();
      setIsPlaying(false);
    }
  };

  const play = () => {
    const activePlayer = isUsingPrimary
      ? audioPlayer.current
      : nextAudioPlayer.current;
    if (activePlayer) {
      setUserInteracted(true);
      console.log("Play function called, audio element state:", {
        paused: activePlayer.paused,
        readyState: activePlayer.readyState,
        src: activePlayer.src,
      });

      activePlayer
        .play()
        .then(() => {
          console.log("Audio play() promise resolved");
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
    }
  };

  const togglePlayPause = () => {
    console.log("Toggle clicked, current isPlaying:", isPlaying);
    if (isPlaying) {
      console.log("Pausing audio");
      pause();
    } else {
      console.log("Playing audio");
      play();
    }
  };

  const getRepeatBounds = (): { start: number; end: number } | null => {
    if (!repeatActiveRef.current || !repeatConfigRef.current) return null;
    return {
      start: repeatConfigRef.current.startAyah - 1,
      end: repeatConfigRef.current.endAyah - 1,
    };
  };

  const next = () => {
    const bounds = getRepeatBounds();
    if (bounds && currentAyahIndex >= bounds.end) return;
    if (surah && currentAyahIndex < surah.ayahs.length - 1) {
      stopAllPlayers();
      if (repeatActiveRef.current) {
        currentRepeatCountRef.current = 0;
        setCurrentRepeatCount(0);
      }
      setCurrentAyahIndex(currentAyahIndex + 1);
      setShouldAutoPlay(true);
      setIsUsingPrimary(!isUsingPrimary);
      transitionTriggeredRef.current = false;
      isTransitioningRef.current = false;
      seekingRef.current = false;
      setCurrentAyahElapsedTime(0);
      setCurrentAyahTotalDuration(0);
      setIsBuffering(false);
    }
  };

  const previous = () => {
    const bounds = getRepeatBounds();
    if (bounds && currentAyahIndex <= bounds.start) return;
    if (currentAyahIndex > 0) {
      stopAllPlayers();
      if (repeatActiveRef.current) {
        currentRepeatCountRef.current = 0;
        setCurrentRepeatCount(0);
      }
      setCurrentAyahIndex(currentAyahIndex - 1);
      setShouldAutoPlay(true);
      setIsUsingPrimary(!isUsingPrimary);
      transitionTriggeredRef.current = false;
      isTransitioningRef.current = false;
      seekingRef.current = false;
      setCurrentAyahElapsedTime(0);
      setCurrentAyahTotalDuration(0);
      setIsBuffering(false);
    }
  };

  const seekToAbsoluteTime = (targetTime: number) => {
    if (!surah || cumulativeDurations.length === 0) return;

    const lastAyahIndex = cumulativeDurations.length - 1;
    const totalDuration =
      cumulativeDurations[lastAyahIndex] +
      (ayahDurations[lastAyahIndex] || 0);
    let clamped = Math.max(0, Math.min(targetTime, totalDuration));

    let targetAyahIndex = 0;
    for (let i = cumulativeDurations.length - 1; i >= 0; i--) {
      if (clamped >= cumulativeDurations[i]) {
        targetAyahIndex = i;
        break;
      }
    }

    const bounds = getRepeatBounds();
    if (bounds) {
      const clampedIndex = Math.min(
        bounds.end,
        Math.max(bounds.start, targetAyahIndex),
      );
      if (clampedIndex !== targetAyahIndex) {
        targetAyahIndex = clampedIndex;
        clamped = cumulativeDurations[targetAyahIndex];
      }
    }

    const timeWithinAyah = clamped - cumulativeDurations[targetAyahIndex];
    const wasPlaying = isPlaying;

    setCurrentTime(clamped);
    setCurrentAyahElapsedTime(timeWithinAyah);

    if (targetAyahIndex === currentAyahIndex) {
      const activePlayer = isUsingPrimary
        ? audioPlayer.current
        : nextAudioPlayer.current;
      if (activePlayer) {
        activePlayer.currentTime = timeWithinAyah;
      }
      return;
    }

    const shouldUsePrimary = targetAyahIndex % 2 === 0;
    setCurrentAyahIndex(targetAyahIndex);
    setIsUsingPrimary(shouldUsePrimary);

    stopAllPlayers();
    setIsPlaying(false);
    if (wasPlaying) setIsBuffering(true);

    const targetPlayer = shouldUsePrimary
      ? audioPlayer.current
      : nextAudioPlayer.current;
    const targetAyah = surah.ayahs[targetAyahIndex];

    const applySeek = () => {
      if (!targetPlayer) {
        seekingRef.current = false;
        return;
      }
      targetPlayer.currentTime = timeWithinAyah;
      setCurrentAyahTotalDuration(
        targetPlayer.duration || ayahDurations[targetAyahIndex] || 1,
      );
      if (wasPlaying) {
        targetPlayer
          .play()
          .then(() => {
            setIsPlaying(true);
            seekingRef.current = false;
          })
          .catch(() => {
            seekingRef.current = false;
          });
      } else {
        seekingRef.current = false;
      }
    };

    if (targetPlayer && targetAyah) {
      if (targetPlayer.src !== targetAyah.audio) {
        targetPlayer.src = targetAyah.audio;
        targetPlayer.load();
        targetPlayer.addEventListener("loadeddata", applySeek, {
          once: true,
        });
      } else {
        applySeek();
      }
    } else {
      seekingRef.current = false;
    }
  };

  const skipForward15 = () => {
    seekToAbsoluteTime((currentTime || 0) + 15);
  };

  const skipBackward15 = () => {
    seekToAbsoluteTime((currentTime || 0) - 15);
  };

  const handleSliderChange = (value: number) => {
    setCurrentTime(value);
  };

  const handleSliderMouseDown = () => {
    setIsDragging(true);
    seekingRef.current = true;
  };

  const handleSliderMouseUp = () => {
    setIsDragging(false);

    if (!surah || cumulativeDurations.length === 0) {
      seekingRef.current = false;
      return;
    }

    seekToAbsoluteTime(currentTime);

    transitionTriggeredRef.current = false;
    isTransitioningRef.current = false;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    if (time > 3600) {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = Math.floor(time % 60);
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    audioPlayer,
    nextAudioPlayer,
    currentAyahIndex,
    currentAyah: surah?.ayahs[currentAyahIndex] || null,
    totalAyahs: surah?.ayahs.length || 0,
    isPlaying,
    restart,
    playAyah,
    pause,
    play,
    togglePlayPause,
    next,
    previous,
    skipForward15,
    skipBackward15,
    isLastAyah: surah ? currentAyahIndex >= surah.ayahs.length - 1 : false,
    isFirstAyah: currentAyahIndex === 0,
    currentTime,
    duration,
    isDragging,
    handleSliderChange,
    handleSliderMouseDown,
    handleSliderMouseUp,
    formatTime,
    isBuffering,
    currentAyahElapsedTime,
    currentAyahTotalDuration,
    currentRepeatCount,
  };
}
