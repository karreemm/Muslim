"use client";

import React, { useState, useEffect, Fragment, memo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faBook,
  faSpinner,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import {
  getTafseerList,
  getAyahTafseer,
  TafseerBook,
  AyahTafseer,
} from "../../app/(pages)/read-quran/service/GetTafseer";

interface TafseerModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  ayahNumber: number;
  surahNameAr?: string;
  surahNameEn?: string;
}

const TafseerModalComponent: React.FC<TafseerModalProps> = memo(
  ({ isOpen, onClose, surahNumber, ayahNumber, surahNameAr, surahNameEn }) => {
    const { language } = useLanguage();
    const { t } = useTranslation();

    const [tafseerBooks, setTafseerBooks] = useState<TafseerBook[]>([]);
    const [selectedBookId, setSelectedBookId] = useState<number>(1);
    const [currentTafseer, setCurrentTafseer] = useState<AyahTafseer | null>(
      null,
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
      const fetchTafseerBooks = async () => {
        const books = await getTafseerList();
        if (books.length > 0) {
          setTafseerBooks(books);
          const defaultBook = books.find(
            (book) => book.language === (language === "ar" ? "ar" : "en"),
          );
          if (defaultBook) {
            setSelectedBookId(defaultBook.id);
          }
        } else {
          setError("Failed to load tafseer books");
        }
      };

      if (isOpen) {
        fetchTafseerBooks();
        setError("");
      }
    }, [isOpen, language]);

    useEffect(() => {
      const fetchTafseer = async () => {
        if (!isOpen || !selectedBookId) return;

        setIsLoading(true);
        setError("");
        const tafseer = await getAyahTafseer(
          selectedBookId,
          surahNumber,
          ayahNumber,
        );

        if (tafseer) {
          setCurrentTafseer(tafseer);
        } else {
          setError("Failed to load tafseer");
        }
        setIsLoading(false);
      };

      fetchTafseer();
    }, [selectedBookId, surahNumber, ayahNumber, isOpen]);

    const handleBookChange = (e: React.MouseEvent, bookId: number) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedBookId(bookId);
    };

    const filteredBooks = tafseerBooks.filter(
      (book) => book.language === language,
    );

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
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-card/95 backdrop-blur-2xl text-card-foreground shadow-2xl border border-border/50 transition-all">
                  <div
                    dir={language === "ar" ? "rtl" : "ltr"}
                    className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/80 px-6 pt-8 pb-10 overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl translate-x-16 -translate-y-16" />
                      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-x-20 translate-y-20" />
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
                        {t("readQuran.tafseer.title")}
                      </Dialog.Title>
                      <div className="flex items-center gap-2 text-primary-foreground/90 text-sm sm:text-base bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
                        <FontAwesomeIcon
                          icon={faBookmark}
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
                    dir={language === "ar" ? "rtl" : "ltr"}
                    className="px-6 py-5 border-b border-border bg-muted/30"
                  >
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                      {language === "ar" ? "اختيار الكتاب" : "Select Book"}
                    </p>
                    <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
                      {filteredBooks.map((book) => (
                        <button
                          key={book.id}
                          onClick={(e) => handleBookChange(e, book.id)}
                          onMouseDown={(e) => e.preventDefault()}
                          type="button"
                          className={`px-5 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium border whitespace-nowrap flex-shrink-0 ${
                            selectedBookId === book.id
                              ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                              : "bg-card border-border text-foreground hover:border-primary/50 hover:bg-muted"
                          } active:scale-95`}
                        >
                          {book.name}
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
                    ) : currentTafseer ? (
                      <div className="space-y-4">
                        <div className="bg-muted/50 rounded-2xl px-6 border border-border/50 relative max-h-52 overflow-y-auto">
                          <div className="absolute top-0 left-0 w-full h-1" />

                          <div className="sticky top-0 z-10 -mx-6 px-6 py-3 mb-4 bg-muted/95 backdrop-blur-sm border-b border-border/40 flex items-center gap-2 text-sm font-semibold text-primary rounded-t-2xl">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            {currentTafseer.tafseer_name}
                          </div>

                          <p
                            className="text-lg sm:text-xl leading-[1.8] text-foreground text-justify font-medium"
                            style={{
                              textAlign: language === "ar" ? "justify" : "left",
                              wordSpacing:
                                language === "ar" ? "0.05em" : "normal",
                            }}
                          >
                            {currentTafseer.text}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-48 text-muted-foreground">
                        {t("readQuran.tafseer.notAvailable")}
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

TafseerModalComponent.displayName = "TafseerModal";

export const TafseerModal = TafseerModalComponent;
