"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { juzNames } from '../../../Lib/Constants';
import TranslationPair from '../../../Lib/Types';
import { useLanguage } from '../../../Context/LanguageContext';
import Navbar from '@/app/Components/Navbar';
import GetJuzAyahs from "./GetJuz";
import { toArabicNumber, showPopover, hidePopover } from "../../../Lib/Helpers";
import { RenderJuzText } from "./RenderQuranText";
import Footer from "@/app/Components/Footer";

export default function JuzPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const [number, setNumber] = useState<string | null>(null);
  const [JuzData, setJuzData] = useState<any>(null);
  const [fontSize, setFontSize] = useState<number>(18);
  const [lineHeight, setLineHeight] = useState<number>(2.5);
  const currentJuzNumber = number ? parseInt(number) : 0;
  const hasPrevJuz = currentJuzNumber > 1;
  const hasNextJuz = currentJuzNumber < juzNames.length;

  useEffect(() => {
    const parts = pathname.split('/');
    const juzNumber = parts.pop();
    console.log(currentJuzNumber);

    if (juzNumber && (parseInt(juzNumber) > 30 || parseInt(juzNumber) < 1)) {
      router.push('/ReadQuran/Juz/1');
      return;
    }

    setNumber(juzNumber ?? null);

    if (juzNumber) {
      const fetchJuzData = async () => {
        try {
          const data = await GetJuzAyahs(juzNumber);
          setJuzData(data);
        } catch (error) {
          console.error('Error fetching Juz:', error);
        }
      };
      fetchJuzData();
    }
  }, [pathname, router]);

  const Surahs: TranslationPair = {
    en: "Surahs",
    ar: "سور"
  };

  const Size: TranslationPair = {
    en: "Font Size",
    ar: "حجم الخط"
  };

  const handleFontSizeChange = (increase: boolean) => {
    setFontSize(prevSize => (increase ? prevSize + 2 : prevSize - 2));
    setLineHeight(prevLineHeight => (increase ? prevLineHeight + 0.2 : prevLineHeight - 0.2));
  };

  const handleNavigation = (direction: 'next' | 'prev') => {
    const currentNumber = number ? parseInt(number) : 1;
    const newNumber = direction === 'next' ? currentNumber + 1 : currentNumber - 1;
    router.push(`/ReadQuran/Juz/${newNumber}`);
  };

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen flex flex-col items-center p-5 bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <div className='relative mt-20 w-[95%] flex flex-col items-center'>
          <div>
            {hasNextJuz && (
              <>
                <button
                  onClick={() => handleNavigation('next')}
                  className="absolute top-0 right-0 text-2xl text-teal-600 dark:text-teal-500"
                  onMouseEnter={() => showPopover('popover-next')}
                  onMouseLeave={() => hidePopover('popover-next')}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>

                <div data-popover
                  id="popover-next"
                  role="tooltip"
                  className="absolute top-10 right-0 z-10 invisible inline-block w-32 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
                >
                  <div className="flex justify-center px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {juzNames[currentJuzNumber]?.name[language as keyof typeof juzNames[0]['name']]}
                    </h3>
                  </div>
                </div>
              </>
            )}
            {hasPrevJuz && (
              <>
                <button
                  onClick={() => handleNavigation('prev')}
                  className="absolute top-0 left-0 text-2xl text-teal-600 dark:text-teal-500"
                  onMouseEnter={() => showPopover('popover-prev')}
                  onMouseLeave={() => hidePopover('popover-prev')}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>

                <div data-popover
                  id="popover-prev"
                  role="tooltip"
                  className="absolute top-10 left-0 z-10 invisible inline-block w-32 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
                >
                  <div className="flex justify-center px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {juzNames[currentJuzNumber - 2]?.name[language as keyof typeof juzNames[0]['name']]}
                    </h3>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className='flex flex-col items-center gap-5'>
            <h1 className="md:text-5xl text-3xl font-bold text-teal-600 dark:text-teal-500">
              {juzNames.find(s => s.number.toString() === number)?.name[language as keyof typeof juzNames[0]['name']]}
            </h1>
            <p className="md:text-2xl text-xl flex items-center">
              {Surahs[language]}: {language === "ar" ? toArabicNumber(juzNames[currentJuzNumber-1]?.surahs) : juzNames[currentJuzNumber-1]?.surahs}
            </p>
          </div>

          <div dir='rtl' className='w-full md:w-[80%] py-4 px-2 overflow-auto'>
            {RenderJuzText(JuzData, fontSize, lineHeight)}
          </div>

          <div dir={language === "ar" ? "rtl" : "ltr"} className='mt-5 flex gap-5'>
            <button onClick={() => handleFontSizeChange(true)} className="hover:opacity-80 py-2 px-4 rounded-md flex items-center gap-2 bg-teal-600 text-white font-bold">
              <FontAwesomeIcon icon={faPlus} />
              {Size[language]}
            </button>
            <button onClick={() => handleFontSizeChange(false)} className="hover:opacity-80 py-2 px-4 rounded-md flex items-center gap-2 bg-teal-600 text-white font-bold">
              <FontAwesomeIcon icon={faMinus} />
              {Size[language]}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
