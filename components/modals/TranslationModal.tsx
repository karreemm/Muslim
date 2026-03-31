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
            <div className="fixed inset-0 bg-background/60 backdrop-blur-md" />
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
                  className="w-full max-w-3xl transform rounded-2xl bg-card text-card-foreground shadow-2xl transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    dir={language === "ar" ? "rtl" : "ltr"}
                    className="relative bg-gradient-to-br from-primary to-primary/90 px-6 pt-6 pb-8 rounded-t-2xl"
                  >
                    <button
                      onClick={onClose}
                      type="button"
                      className={`absolute top-6 text-primary-foreground hover:text-primary-foreground hover:bg-card/10 rounded-full w-8 h-8 inline-flex justify-center items-center transition-all duration-200 ${
                        language === "ar" ? "left-4" : "right-4"
                      }`}
                      aria-label="Close"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-lg" />
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-card/20 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faLanguage}
                          className="text-primary-foreground text-xl"
                        />
                      </div>
                      <Dialog.Title className="text-2xl font-bold text-primary-foreground dynamic-font">
                        {t("readQuran.translation.title")}
                      </Dialog.Title>
                    </div>
                    <p className="text-primary-foreground/80 text-sm mt-1 dynamic-font">
                      {language === "ar"
                        ? `${surahNameAr} - الآية ${ayahNumber}`
                        : `${surahNameEn} - Ayah ${ayahNumber}`}
                    </p>
                  </div>

                  <div
                    dir={"ltr"}
                    className="px-6 py-4 border-b border-border"
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
                              ? "bg-primary text-primary-foreground shadow-md scale-105"
                              : "bg-secondary text-secondary-foreground hover:bg-muted"
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
                          className="text-4xl text-primary animate-spin"
                        />
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center overflow-y-auto h-40">
                        <p className="dynamic-font text-center text-muted-foreground">
                          {error}
                        </p>
                      </div>
                    ) : currentTranslation ? (
                      <div>
                        <div
                          dir="ltr"
                          className="rounded-xl p-5 h-fit max-h-[40vh] overflow-y-auto bg-background"
                        >
                          <p className="text-lg leading-relaxed dynamic-font text-foreground">
                            {currentTranslation.text}
                          </p>
                          {currentTranslation.edition && (
                            <p className="mt-4 text-sm font-medium dynamic-font text-muted-foreground">
                              — {currentTranslation.edition.name}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40">
                        <p className="dynamic-font text-center text-muted-foreground">
                          {t("readQuran.translation.noData")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div
                    dir={language === "ar" ? "rtl" : "ltr"}
                    className="px-6 py-4 border-t border-border"
                  >
                    <button
                      onClick={onClose}
                      type="button"
                      className="w-full py-3 rounded-xl transition-all duration-200 dynamic-font font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
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
