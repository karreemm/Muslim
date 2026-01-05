"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareNodes,
  faCopy,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faWhatsapp,
  faTelegram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";

interface ShareButtonsProps {
  url: string;
  size?: string;
}

export default function ShareButtons({ url, size }: ShareButtonsProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [copied, setCopied] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const iconSize = size || "lg";

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsShareOpen(true)}
        className={`group text-${iconSize} transition-all duration-200`}
        aria-label="Share"
      >
        <FontAwesomeIcon
          icon={faShareNodes}
          className="text-teal-600 hover:text-teal-700 hover:scale-110 transition-all duration-200"
        />
      </button>

      <Transition appear show={isShareOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsShareOpen}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                  <div className="relative bg-gradient-to-br from-teal-500 to-teal-600 px-6 pt-6 pb-8">
                    <button
                      onClick={() => setIsShareOpen(false)}
                      type="button"
                      className={`absolute top-6 text-white hover:text-white hover:bg-white/10 rounded-full w-8 h-8 inline-flex justify-center items-center transition-all duration-200 ${
                        language === "ar" ? "left-4" : "right-4"
                      }`}
                      aria-label="Close"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faShareNodes}
                          className="text-white text-xl"
                        />
                      </div>
                      <Dialog.Title className="text-2xl font-bold text-white">
                        {t("common.share")}
                      </Dialog.Title>
                    </div>
                    <p className="text-teal-50 text-sm mt-1">
                      {t("common.shareDescription")}
                    </p>
                  </div>

                  <div className="p-6 space-y-6">
                    <button
                      dir={`${language === "ar" ? "rtl" : "ltr"}`}
                      onClick={handleCopy}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 ${
                        copied
                          ? "bg-green-50 border-green-500 text-green-700"
                          : "bg-gray-50 border-gray-200 hover:border-teal-500 hover:bg-teal-50 text-gray-700"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                          copied ? "bg-green-500" : "bg-teal-500"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={copied ? faCheck : faCopy}
                          className="text-white text-lg"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="font-semibold block w-fit">
                          {copied ? t("common.copied") : t("common.copyLink")}
                        </span>
                        {!copied && (
                          <span className="text-xs text-gray-500 mt-0.5 block w-fit">
                            {language === "en" ? "Click to copy" : "انقر للنسخ"}
                          </span>
                        )}
                      </div>
                    </button>

                    <div dir="ltr">
                      <p
                        dir={`${language === "ar" ? "rtl" : "ltr"}`}
                        className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-3"
                      >
                        {language === "en" ? "Or share via" : "أو شارك عبر"}
                      </p>
                      <div className="grid grid-cols-4 gap-3 dynamic-font">
                        <button
                          onClick={() =>
                            window.open(
                              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                url
                              )}`,
                              "_blank"
                            )
                          }
                          className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200 hover:scale-105"
                        >
                          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                            <FontAwesomeIcon
                              icon={faFacebook}
                              className="text-white text-xl"
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            Facebook
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            window.open(
                              `https://api.whatsapp.com/send?text=${encodeURIComponent(
                                url
                              )}`,
                              "_blank"
                            )
                          }
                          className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-200 hover:scale-105"
                        >
                          <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center group-hover:bg-green-700 transition-colors">
                            <FontAwesomeIcon
                              icon={faWhatsapp}
                              className="text-white text-xl"
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            WhatsApp
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            window.open(
                              `https://t.me/share/url?url=${encodeURIComponent(
                                url
                              )}`,
                              "_blank"
                            )
                          }
                          className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-sky-50 hover:bg-sky-100 transition-all duration-200 hover:scale-105"
                        >
                          <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center group-hover:bg-sky-600 transition-colors">
                            <FontAwesomeIcon
                              icon={faTelegram}
                              className="text-white text-xl"
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            Telegram
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            window.open(
                              `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                                url
                              )}`,
                              "_blank"
                            )
                          }
                          className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200 hover:scale-105"
                        >
                          <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center group-hover:bg-blue-800 transition-colors">
                            <FontAwesomeIcon
                              icon={faLinkedin}
                              className="text-white text-xl"
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            LinkedIn
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
