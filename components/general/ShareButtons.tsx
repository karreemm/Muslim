"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes, faCopy } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faWhatsapp,
  faTelegram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";

interface ShareButtonsProps {
  url: string;
}

export default function ShareButtons({ url }: ShareButtonsProps) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [copied, setCopied] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

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
    if (
      shareMenuRef.current &&
      !shareMenuRef.current.contains(event.target as Node)
    ) {
      setIsShareOpen(false);
    }
  };

  useEffect(() => {
    if (isShareOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShareOpen]);

  return (
    <div className="flex flex-col relative text-slate-900 text-xl md:text-2xl">
      <FontAwesomeIcon
        icon={faShareNodes}
        className="text-teal-600 hover:opacity-80 cursor-pointer"
        onClick={handleShare}
      />
      {isShareOpen && (
        <div
          ref={shareMenuRef}
          className="z-50 py-2 px-3 absolute text-xl md:text-2xl w-48 flex flex-col gap-3 md:gap-7 top-10 left-0 bg-white rounded-lg shadow-md"
        >
          <button
            className="flex items-center gap-3 text-teal-600 hover:opacity-80"
            onClick={handleCopy}
          >
            <FontAwesomeIcon icon={faCopy} />
            <span>{copied ? t("common.copied") : t("common.copyLink")}</span>
          </button>

          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    url
                  )}`,
                  "_blank"
                )
              }
            >
              <FontAwesomeIcon
                className="text-blue-600 hover:opacity-80"
                icon={faFacebook}
              />
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
            >
              <FontAwesomeIcon
                className="text-green-600 hover:opacity-80"
                icon={faWhatsapp}
              />
            </button>

            <button
              onClick={() =>
                window.open(
                  `https://t.me/share/url?url=${encodeURIComponent(url)}`,
                  "_blank"
                )
              }
            >
              <FontAwesomeIcon
                className="text-blue-600 hover:opacity-80"
                icon={faTelegram}
              />
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
            >
              <FontAwesomeIcon
                className="text-blue-600 hover:opacity-80"
                icon={faLinkedin}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
