"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareNodes,
  faCopy,
  faCheck,
  faLink,
  faEnvelope,
  faX
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faWhatsapp,
  faTelegram,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLanguage } from "../../context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";

interface ShareModalProps {
  url: string;
  size?: string;
  title?: string;
}

export default function ShareModal({ url, size, title }: ShareModalProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [copied, setCopied] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const iconSize = size || "lg";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: faWhatsapp,
      color: "bg-green-500 hover:bg-green-600",
      action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title ? `${title}\n${url}` : url)}`, "_blank"),
    },
    {
      name: "Telegram",
      icon: faTelegram,
      color: "bg-sky-500 hover:bg-sky-600",
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title || "")}`, "_blank"),
    },
    {
      name: "Facebook",
      icon: faFacebook,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank"),
    },
    {
      name: "LinkedIn",
      icon: faLinkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      action: () => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title || "")}`, "_blank"),
    },
    {
      name: "X (Twitter)",
      icon: faXTwitter,
      color: "bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600",
      action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title || "")}`, "_blank"),
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsShareOpen(true)}
        className={`flex items-center justify-center group text-${iconSize} transition-all duration-200 hover:scale-110 active:scale-95`}
        aria-label="Share"
      >
        <FontAwesomeIcon
          icon={faShareNodes}
          className="text-primary hover:text-primary/80 transition-all duration-200"
        />
      </button>

      <Transition appear show={isShareOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsShareOpen(false)}>
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-8"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-8"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-card/95 backdrop-blur-2xl text-card-foreground shadow-2xl border border-border/50 transition-all">
                  
                  <div className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/80 px-6 pt-8 pb-10 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-1/2 w-32 h-32 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-16" />
                    </div>
                    
                    <button
                      onClick={() => setIsShareOpen(false)}
                      type="button"
                      className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/20 rounded-full w-9 h-9 inline-flex justify-center items-center transition-all duration-200 hover:scale-110 active:scale-95"
                      aria-label="Close"
                    >
                      <FontAwesomeIcon icon={faX} className="text-lg" />
                    </button>

                    <div className="relative flex flex-col items-center text-center">
                      <Dialog.Title className="text-2xl font-bold text-primary-foreground mb-2">
                        {t("common.share")}
                      </Dialog.Title>
                      <p className="text-primary-foreground/80 text-sm max-w-[250px]">
                        {t("common.shareDescription")}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <button
                      dir={language === "ar" ? "rtl" : "ltr"}
                      onClick={handleCopy}
                      className={`w-full group relative overflow-hidden flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${
                        copied
                          ? "bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400"
                          : "bg-muted/50 border-border hover:border-primary/50 hover:bg-muted text-foreground"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          copied ? "bg-green-500 scale-110" : "bg-primary group-hover:scale-105"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={copied ? faCheck : faLink}
                          className="text-primary-foreground text-xl"
                        />
                      </div>
                      <div className={`flex-1 min-w-0 ${language === "ar" ? "pr-2" : "pl-2"}`}>
                        <span className={`font-bold block text-base ${language === "ar" ? "text-right" : "text-left"}`}>
                          {copied ? (language === "ar" ? "تم النسخ!" : "Copied!") : (language === "ar" ? "نسخ الرابط" : "Copy Link")}
                        </span>
                        <span className={`text-xs text-muted-foreground mt-1 block truncate [direction:ltr] [unicode-bidi:embed] ${language === "ar" ? "text-right" : "text-left"}`}>                          {copied 
                            ? (language === "ar" ? "تم نسخ الرابط إلى الحافظة" : "Link copied to clipboard")
                            : url.replace(/^https?:\/\//, '').replace(/\/$/, '')
                          }
                        </span>
                      </div>
                      {copied && (
                        <div className="absolute inset-0 bg-green-500/5 animate-pulse rounded-2xl" />
                      )}
                    </button>

                    <div className="relative flex items-center gap-4">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {language === "ar" ? "أو المشاركة عبر" : "Or share via"}
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {shareOptions.map((option) => (
                        <button
                          key={option.name}
                          onClick={option.action}
                          className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                          <div className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110`}>
                            <FontAwesomeIcon
                              icon={option.icon}
                              className="text-white text-xl"
                            />
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                            {option.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 text-center">
                    <p className="text-xs text-muted-foreground">
                      {language === "ar" ? "اختر التطبيق المفضل لمشاركة هذا المحتوى" : "Choose your preferred app to share this content"}
                    </p>
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