import { useEffect, useState, useRef } from "react";
import { Surah } from "../../(Pages)/ListenQuran/Service/GetSurah";

export function useAudioPlayer(surah: Surah | null) {
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [shouldAutoPlay, setShouldAutoPlay] = useState<boolean>(true);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  const audioPlayer = useRef<HTMLAudioElement>(null);

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

  useEffect(() => {
    if (surah) {
      setCurrentAyahIndex(0);
      setShouldAutoPlay(true);
      setIsPlaying(false);
    }
  }, [surah]);

  useEffect(() => {
    if (surah && audioPlayer.current && currentAyahIndex < surah.ayahs.length) {
      const currentAyah = surah.ayahs[currentAyahIndex];
      const audioElement = audioPlayer.current;

      audioElement.src = currentAyah.audio;

      const handleCanPlay = () => {
        console.log(
          "Audio can play, shouldAutoPlay:",
          shouldAutoPlay,
          "userInteracted:",
          userInteracted
        );
        if (shouldAutoPlay) {
          audioElement
            .play()
            .then(() => {
              console.log("Audio started playing successfully");
              setIsPlaying(true);
              setUserInteracted(true);
            })
            .catch((error) => {
              console.warn("Auto-play blocked by browser:", error.message);
              console.log(
                "User needs to interact with the page to start audio"
              );
              setIsPlaying(false);
            });
        }
      };

      const handlePlay = () => {
        console.log("Audio play event fired");
        setIsPlaying(true);
      };

      const handlePause = () => {
        console.log("Audio pause event fired");
        setIsPlaying(false);
      };

      const handleEnded = () => {
        console.log("Audio ended event fired");
        setIsPlaying(false);
        setCurrentAyahIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex < surah.ayahs.length) {
            return nextIndex;
          } else {
            setShouldAutoPlay(false); 
            return prevIndex;
          }
        });
      };

      audioElement.removeEventListener("canplay", handleCanPlay);
      audioElement.removeEventListener("play", handlePlay);
      audioElement.removeEventListener("pause", handlePause);
      audioElement.removeEventListener("ended", handleEnded);

      audioElement.addEventListener("canplay", handleCanPlay);
      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("pause", handlePause);
      audioElement.addEventListener("ended", handleEnded);

      return () => {
        audioElement.removeEventListener("canplay", handleCanPlay);
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("pause", handlePause);
        audioElement.removeEventListener("ended", handleEnded);
      };
    }
  }, [surah, currentAyahIndex, shouldAutoPlay]);

  const restart = () => {
    setCurrentAyahIndex(0);
    setShouldAutoPlay(true);
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = 0;
    }
  };

  const playAyah = (ayahIndex: number) => {
    if (surah && ayahIndex >= 0 && ayahIndex < surah.ayahs.length) {
      setCurrentAyahIndex(ayahIndex);
      setShouldAutoPlay(true);
    }
  };

  const pause = () => {
    if (audioPlayer.current && !audioPlayer.current.paused) {
      audioPlayer.current.pause();
    }
  };

  const play = () => {
    if (audioPlayer.current) {
      setUserInteracted(true);
      console.log("Play function called, audio element state:", {
        paused: audioPlayer.current.paused,
        readyState: audioPlayer.current.readyState,
        src: audioPlayer.current.src,
      });

      if (audioPlayer.current.paused) {
        audioPlayer.current
          .play()
          .then(() => {
            console.log("Audio play() promise resolved");
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
          });
      }
    }
  };

  const togglePlayPause = () => {
    console.log("Toggle clicked, current isPlaying:", isPlaying);
    if (audioPlayer.current) {
      if (isPlaying) {
        console.log("Pausing audio");
        pause();
      } else {
        console.log("Playing audio");
        play();
      }
    }
  };

  const next = () => {
    if (surah && currentAyahIndex < surah.ayahs.length - 1) {
      setCurrentAyahIndex(currentAyahIndex + 1);
      setShouldAutoPlay(true);
    }
  };

  const previous = () => {
    if (currentAyahIndex > 0) {
      setCurrentAyahIndex(currentAyahIndex - 1);
      setShouldAutoPlay(true);
    }
  };

  return {
    audioPlayer,
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
    isLastAyah: surah ? currentAyahIndex >= surah.ayahs.length - 1 : false,
    isFirstAyah: currentAyahIndex === 0,
  };
}
