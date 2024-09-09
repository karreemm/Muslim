"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useFavoriteSurahs } from '@/app/Context/FavoriteSurahsContext';
import { useLanguage } from '@/app/Context/LanguageContext';
import TranslationPair from '@/app/Lib/Types';
import { reciters, surahNames } from '@/app/Lib/Constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as notLoved } from '@fortawesome/free-regular-svg-icons';
import { faHeart as loved } from '@fortawesome/free-solid-svg-icons';
import "../../../globals.css";
import SuccessAlert from '@/app/Components/SuccessAlert';
import FailAlert from '@/app/Components/FailAlert';
import { ClipLoader } from 'react-spinners';

type Ayah = {
  number: number;
  audio: string;
  text: string;
};

type Surah = {
  number: number;
  name: string;
  englishName: string;
  reciterId: string | number;
  ayahs: Ayah[];
};

interface SurahAudioPlayerProps {
  reciterId: string;
  surahNumber: number;
}

const SurahAudioPlayer: React.FC<SurahAudioPlayerProps> = ({ reciterId, surahNumber }) => {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const { language } = useLanguage();

  const [selectedSurahNameEn, setSelectedSurahNameEn] = useState<string | null>(null);
  const [selectedSurahNameAr, setSelectedSurahNameAr] = useState<string | null>(null);
  const [reciterNameEn, setReciterNameEn] = useState<string>("");
  const [reciterNameAr, setReciterNameAr] = useState<string>("");
  const [selectedSurah, setSelectedSurah] = useState<number>(surahNumber);

  const { favoriteSurahs, addFavoriteSurah, removeFavoriteSurah } = useFavoriteSurahs();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showFailAlert, setShowFailAlert] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (surahNumber) setSelectedSurah(surahNumber);
  }, [surahNumber]);

  useEffect(() => {
    if (selectedSurah) {
      setSelectedSurahNameEn(surahNames[selectedSurah - 1].en);
      setSelectedSurahNameAr(surahNames[selectedSurah - 1].ar);
    }
  }, [selectedSurah]);

  useEffect(() => {
    const reciter = reciters.find(r => r.id === reciterId);
    if (reciter) {
      setReciterNameEn(reciter.NameEn);
      setReciterNameAr(reciter.NameAr);
    }
  }, [reciterId]);

  useEffect(() => {
    if (typeof window != 'undefined') {
      const storedFavorites = JSON.parse(localStorage.getItem('favoriteSurahs') || '[]');
      const isFav = storedFavorites.some((surah: Surah) => surah.number === surahNumber && surah.reciterId === reciterId);
      setIsFavorite(isFav);
    }
  }, [surahNumber]);

  const handleLoveClick = () => {
    if (typeof window != 'undefined') {
      const storedFavorites = JSON.parse(localStorage.getItem('favoriteSurahs') || '[]');
    }
    if (isFavorite) {
      removeFavoriteSurah(surahNumber, reciterId);
      console.log('Removing favorite:', surahNumber);
    } else {
      const newFavorite = {
        number: surahNumber,
        nameEn: selectedSurahNameEn,
        nameAr: selectedSurahNameAr,
        reciterId: reciterId,
        reciterNameEn: reciterNameEn,
        reciterNameAr: reciterNameAr,
      };
      console.log('Adding favorite:', newFavorite);
      addFavoriteSurah(newFavorite);
    }
    setIsFavorite(!isFavorite);

    const button = document.getElementById(`love-button-${surahNumber}`);
    if (button) {
      button.classList.add('heart-beat');
      setTimeout(() => {
        button.classList.remove('heart-beat');
      }, 800);
    }
  };

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://api.alquran.cloud/v1/surah/${surahNumber}/${reciterId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (data.data) {
          const fetchedSurah = data.data as Surah;
          setSurah(fetchedSurah);
          setCurrentAyahIndex(0);
        } else {
          setSurah(null);
          console.error('No surah found for the given number and reciterId.');
        }
      } catch (error) {
        console.error('Error fetching Surah:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurah();
  }, [reciterId, surahNumber]);

  useEffect(() => {
    if (surah && audioPlayer.current) {
      const playNextAyah = () => {
        if (currentAyahIndex < surah.ayahs.length) {
          const currentAyah = surah.ayahs[currentAyahIndex];
          audioPlayer.current!.src = currentAyah.audio;
          audioPlayer.current!.play().catch(error => {
            console.error("Error playing audio:", error);
          });
        }
      };

      playNextAyah();

      const handleEnded = () => {
        setCurrentAyahIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          if (nextIndex < surah.ayahs.length) {
            return nextIndex;
          } else {
            return prevIndex;
          }
        });
      };

      audioPlayer.current.addEventListener('ended', handleEnded);

      return () => {
        if (audioPlayer.current) {
          audioPlayer.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [surah, currentAyahIndex]);

  const handleRestart = () => {
    setCurrentAyahIndex(0);
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = 0;
      audioPlayer.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const handleDownload = async () => {
    if (surah) {
      try {
        const audioBlobs = await Promise.all(
          surah.ayahs.map(async (ayah) => {
            const response = await fetch(`/api/proxy?surahNumber=${surahNumber}&ayahNumber=${ayah.number}&reciterId=${reciterId}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch ${ayah.audio}`);
            }
            return await response.blob();
          })
        );

        const combinedBlob = new Blob(audioBlobs, { type: 'audio/mpeg' });
        const downloadUrl = URL.createObjectURL(combinedBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${surah.name}.mp3`;
        a.click();
        URL.revokeObjectURL(downloadUrl);

        setShowSuccessAlert(true);
      } catch (error) {
        console.error('Error downloading Surah:', error);

        setShowFailAlert(true);
      }
    }
  };

  const Restart: TranslationPair = {
    ar: 'إعادة تشغيل',
    en: 'Restart'
  };

  const Download: TranslationPair = {
    ar: 'تحميل',
    en: 'Download'
  };

  const LoveIt: TranslationPair = {
    en: "Loved it? Save it to your favorites!",
    ar: "احفظها في قائمتك المفضلة!"
  };

  const Saved: TranslationPair = {
    en: "This Surah is saved to your favorites!",
    ar: "تم حفظ هذه السورة في قائمتك المفضلة!"
  }

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
        </div>
      ) : surah ? (
        <div className='flex flex-col items-center gap-3'>
          <div>
            <SuccessAlert
              message={{ en: "Download started successfully.", ar: "بدأ التنزيل بنجاح." }}
              show={showSuccessAlert}
              onClose={() => setShowSuccessAlert(false)}
            />
            <FailAlert
              message={{ en: "Error downloading Surah.", ar: "خطأ في تنزيل السورة." }}
              show={showFailAlert}
              onClose={() => setShowFailAlert(false)}
            />
          </div>
          <div className='flex items-center gap-2'>
            <audio ref={audioPlayer} controls />
          </div>
          <div className='flex items-center gap-3 mt-5'>
            <h1 className='text-xl md:text-3xl'>
              {isFavorite ? Saved[language] : LoveIt[language]}
            </h1>
            <button
              id={`love-button-${surahNumber}`}
              onClick={handleLoveClick}
              className='text-red-500 hover:text-red-600'
            >
              <FontAwesomeIcon icon={isFavorite ? loved : notLoved} className={!isFavorite ? 'vibrate text-lg md:text-2xl' : 'text-lg md:text-2xl'} />
            </button>
          </div>
          <div className='flex items-center gap-2 mt-10'>
            <button onClick={handleRestart} className='bg-teal-500 flex justify-center w-32 py-2 rounded-lg text-white font-bold hover:opacity-80 dark:hover:opacity-90'>{Restart[language]}</button>
            <button onClick={handleDownload} className='bg-teal-500 flex justify-center w-32 py-2 rounded-lg text-white font-bold hover:opacity-80 dark:hover:opacity-90'>{Download[language]}</button>
          </div>
        </div>
      ) : (
        <p>Error...</p>
      )}
    </div>
  );
};

export default SurahAudioPlayer;