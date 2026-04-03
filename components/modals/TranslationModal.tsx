"use client";

import React, { memo, useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faLanguage,
  faSpinner,
  faGlobe,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/general/LanguageContext";
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
        <Dialog as="div" className="relative z-[60]" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-background/80 backdrop-blur-xl" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-8"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-8"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-card/95 backdrop-blur-2xl text-card-foreground shadow-2xl border border-border/50 transition-all">
                  <div
                    dir={language === "ar" ? "rtl" : "ltr"}
                    className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/80 px-6 pt-8 pb-10 overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl -translate-x-16 -translate-y-16" />
                      <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl translate-x-20 translate-y-20" />
                    </div>

                    <button
                      onClick={onClose}
                      type="button"
                      className={`absolute top-4 z-10 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/20 rounded-full w-9 h-9 inline-flex justify-center items-center transition-all duration-200 hover:scale-110 active:scale-95 ${
                        language === "ar" ? "left-4" : "right-4"
                      }`}
                      aria-label="Close"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-lg" />
                    </button>

                    <div className="relative flex flex-col items-center text-center">
                      <Dialog.Title className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-2">
                        {t("readQuran.translation.title")}
                      </Dialog.Title>
                      <div className="flex items-center gap-2 text-primary-foreground/90 text-sm sm:text-base bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
                        <FontAwesomeIcon
                          icon={faBookOpen}
                          className="text-xs"
                        />
                        <span>
                          {language === "ar"
                            ? `${surahNameAr} - الآية ${ayahNumber}`
                            : `${surahNameEn} - Ayah ${ayahNumber}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    dir={"ltr"}
                    className="px-6 py-5 border-b border-border bg-muted/30"
                  >
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                      {language === "ar"
                        ? "اختيار الترجمة"
                        : "Select Translation"}
                    </p>
                    <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
                      {popularTranslations.map((edition) => (
                        <button
                          key={edition.id}
                          onClick={(e) => handleEditionChange(e, edition.id)}
                          onMouseDown={(e) => e.preventDefault()}
                          type="button"
                          className={`px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium border whitespace-nowrap flex-shrink-0 ${
                            selectedEditionId === edition.id
                              ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                              : "bg-card border-border text-foreground hover:border-primary/50 hover:bg-muted"
                          } active:scale-95`}
                        >
                          {edition.englishName}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    dir={language === "ar" ? "rtl" : "ltr"}
                    className="px-6 py-6 min-h-[200px] max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                  >
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center h-48 gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full border-4 border-primary/20" />
                          <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                        </div>
                        <p className="text-sm text-muted-foreground animate-pulse">
                          {language === "ar" ? "جاري التحميل..." : "Loading..."}
                        </p>
                      </div>
                    ) : error ? (
                      <div className="flex flex-col items-center justify-center h-48 text-center">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="text-destructive text-2xl"
                          />
                        </div>
                        <p className="text-muted-foreground">{error}</p>
                      </div>
                    ) : currentTranslation ? (
                      <div className="space-y-4">
                        <div className="bg-muted/50 rounded-2xl px-6 border border-border/50 relative max-h-52 overflow-y-auto">
                          <div className="absolute top-0 left-0 w-full h-1" />
                          {currentTranslation.edition && (
                            <div className="sticky rounded-t-2xl top-0 z-10 -mx-6 px-6 py-3 mb-4 bg-muted/95 backdrop-blur-sm border-b border-border/40 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {currentTranslation.edition.name}
                            </div>
                          )}
                          <p className="text-lg sm:text-xl leading-relaxed text-foreground font-medium">
                            {currentTranslation.text}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-48 text-muted-foreground">
                        {t("readQuran.translation.noData")}
                      </div>
                    )}
                  </div>

                  <div
                    dir={language === "ar" ? "rtl" : "ltr"}
                    className="px-6 py-5 border-t border-border bg-muted/30"
                  >
                    <button
                      onClick={onClose}
                      type="button"
                      className="w-full py-3.5 rounded-xl transition-all duration-200 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98]"
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
