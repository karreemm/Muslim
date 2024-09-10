"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes, faCopy } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faWhatsapp, faTelegram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../Context/LanguageContext';
import TranslationPair from '../Lib/Types';

interface ShareButtonsProps {
  url: string;
}

export default function ShareButtons({ url }: ShareButtonsProps) {
  const { language } = useLanguage();
  const [copied, setCopied] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleShare = () => {
    setIsShareOpen(!isShareOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsShareOpen(false);
    }
  };

  useEffect(() => {
    if (isShareOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShareOpen]);

  const CopyText: TranslationPair = {
    en: "Copy Link",
    ar: "نسخ الرابط",
  }

  const Copied: TranslationPair = {
    en: "Copied!",
    ar: "تم النسخ!",
  }

  const CloseModal: TranslationPair = {
    en: "Close",
    ar: "إغلاق",
  }

  const Share: TranslationPair = {
    en: "Share",
    ar: "مشاركة",
  }

  return (
    <>
      <button onClick={handleShare} className="block text-lg">
        <FontAwesomeIcon icon={faShareNodes} className='text-teal-600 hover:opacity-80 cursor-pointer' />
      </button>

      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
          <div ref={modalRef} className="relative p-4 w-full max-w-md  max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900 ">
                  {Share[language]}
                </h3>
                <button onClick={handleShare} type="button" className="text-slate-700 hover:text-slate-800 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center ">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">{CloseModal[language]}</span>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-8">
                <button className='flex text-2xl items-center gap-3 text-teal-600 hover:opacity-80' onClick={handleCopy}>
                  <FontAwesomeIcon icon={faCopy} />
                  <span>{copied ? Copied[language] : CopyText[language]}</span>
                </button>
                <div className='flex items-center justify-between text-3xl'>
                  <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')}>
                    <FontAwesomeIcon className='text-blue-600 hover:opacity-80' icon={faFacebook} />
                  </button>
                  <button onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`, '_blank')}>
                    <FontAwesomeIcon className='text-green-600 hover:opacity-80' icon={faWhatsapp} />
                  </button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}`, '_blank')}>
                    <FontAwesomeIcon className='text-blue-600 hover:opacity-80' icon={faTelegram} />
                  </button>
                  <button onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`, '_blank')}>
                    <FontAwesomeIcon className='text-blue-600 hover:opacity-80' icon={faLinkedin} />
                  </button>
                </div>
              </div>
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
                <button onClick={handleShare} type="button" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">{CloseModal[language]}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}