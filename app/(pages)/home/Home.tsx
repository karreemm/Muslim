"use client";

import { useLanguage } from "../../../context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import BackgroundDecorations from "./components/BackgroundDecorations";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import ToolsSection from "./components/ToolsSection";
import InstallFlowSection from "./components/InstallFlowSection";
import CtaSection from "./components/CtaSection";

export default function Header() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const isEnglish = language === "en";
  const arrowIcon = isEnglish ? faArrowRight : faArrowLeft;

  return (
    <div className="w-full flex justify-center pb-14 relative overflow-hidden">
      <BackgroundDecorations />

      <div className="mt-8 w-[92%] max-w-7xl flex flex-col gap-10 relative z-10">
        <HeroSection t={t} arrowIcon={arrowIcon} />
        <FeaturesSection t={t} arrowIcon={arrowIcon} isEnglish={isEnglish} />
        <ToolsSection t={t} />
        <InstallFlowSection t={t} />
        <CtaSection t={t} arrowIcon={arrowIcon} />
      </div>
    </div>
  );
}
