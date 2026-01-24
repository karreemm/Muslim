"use client";
import React, { memo, useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faLanguage,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import {
  getAyahTranslation,
  popularTranslations,
  type AyahTranslation,
} from "../../app/(pages)/read-quran/service/GetTranslation";

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  ayahNumber: number;
  surahNameAr?: string;
  surahNameEn?: string;
}

export const TranslationModal: React.FC<TranslationModalProps> = memo(
  ({ isOpen, onClose, surahNumber, ayahNumber, surahNameAr, surahNameEn }) => {
    const { language } = useLanguage();
    const { t } = useTranslation();
    const { theme } = useTheme();

    const [selectedEditionId, setSelectedEditionId] =
      useState<string>("en.sahih");
    const [currentTranslation, setCurrentTranslation] =
      useState<AyahTranslation | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
      const fetchTranslation = async () => {
        if (!isOpen || !selectedEditionId) return;

        setIsLoading(true);
        setError("");
        const translation = await getAyahTranslation(
          surahNumber,
          ayahNumber,
          selectedEditionId,
        );

        if (translation) {
          setCurrentTranslation(translation);
        } else {
          setError("Failed to load translation");
        }
        setIsLoading(false);
      };

      if (isOpen) {
        setError("");
        fetchTranslation();
      }
    }, [selectedEditionId, surahNumber, ayahNumber, isOpen]);

    const handleEditionChange = (e: React.MouseEvent, editionId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedEditionId(editionId);
    };

    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[60]" onClose={() => {}} static>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-90 translate-y-4"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-90 translate-y-4"
              >
                <Dialog.Panel
                  className={`w-full max-w-3xl transform rounded-2xl shadow-2xl transition-all ${
                    theme ? "bg-slate-800" : "bg-white"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    dir={language === "ar" ? "rtl" : "ltr"}
                    className="relative bg-gradient-to-br from-teal-500 to-teal-600 px-6 pt-6 pb-8 rounded-t-2xl"
                  >
                    <button
                      onClick={onClose}
                      type="button"
                      className={`absolute top-6 text-white hover:text-white hover:bg-white/10 rounded-full w-8 h-8 inline-flex justify-center items-center transition-all duration-200 ${
                        language === "ar" ? "left-4" : "right-4"
                      }`}
                      aria-label="Close"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-lg" />
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faLanguage}
                          className="text-white text-xl"
                        />
                      </div>
                      <Dialog.Title className="text-2xl font-bold text-white dynamic-font">
                        {t("readQuran.translation.title")}
                      </Dialog.Title>
                    </div>
                    <p className="text-teal-50 text-sm mt-1 dynamic-font">
                      {language === "ar"
                        ? `${surahNameAr} - الآية ${ayahNumber}`
                        : `${surahNameEn} - Ayah ${ayahNumber}`}
                    </p>
                  </div>

                  <div
                    dir={"ltr"}
                    className={`px-6 py-4 border-b ${
                      theme ? "border-slate-700" : "border-gray-200"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-wrap gap-2">
                      {popularTranslations.map((edition) => (
                        <button
                          key={edition.id}
                          onClick={(e) => handleEditionChange(e, edition.id)}
                          onMouseDown={(e) => e.preventDefault()}
                          type="button"
                          className={`px-4 py-2 rounded-lg transition-all duration-200 dynamic-font text-sm font-medium ${
                            selectedEditionId === edition.id
                              ? "bg-teal-600 text-white shadow-md scale-105"
                              : theme
                                ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {edition.englishName}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    dir={language === "ar" ? "rtl" : "ltr"}
                    className="px-6 py-6 max-h-[50vh]"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center h-40">
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className="text-4xl text-teal-600 animate-spin"
                        />
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center overflow-y-auto h-40">
                        <p
                          className={`dynamic-font text-center ${
                            theme ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {error}
                        </p>
                      </div>
                    ) : currentTranslation ? (
                      <div>
                        <div
                          dir="ltr"
                          className={`rounded-xl p-5 h-fit max-h-[40vh] overflow-y-auto ${
                            theme ? "bg-[#0f172b]" : "bg-[#fff5e4]"
                          }`}
                        >
                          <p
                            className={`text-lg leading-relaxed dynamic-font ${
                              theme ? "text-gray-100" : "text-gray-800"
                            }`}
                          >
                            {currentTranslation.text}
                          </p>
                          {currentTranslation.edition && (
                            <p
                              className={`mt-4 text-sm font-medium dynamic-font ${
                                theme ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              — {currentTranslation.edition.name}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40">
                        <p
                          className={`dynamic-font text-center ${
                            theme ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {t("readQuran.translation.noData")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div
                    dir={language === "ar" ? "rtl" : "ltr"}
                    className={`px-6 py-4 border-t ${
                      theme ? "border-slate-700" : "border-gray-200"
                    }`}
                  >
                    <button
                      onClick={onClose}
                      type="button"
                      className="w-full py-3 rounded-xl transition-all duration-200 dynamic-font font-medium bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      {t("common.close")}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  },
);

TranslationModal.displayName = "TranslationModal";
