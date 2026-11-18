"use client";

import { useLanguage } from "../../../../context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import BackgroundDecorations from "./components/BackgroundDecorations";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import ToolsSection from "./components/ToolsSection";
import InstallFlowSection from "./components/InstallFlowSection";
import CtaSection from "./components/CtaSection";
import { PageShell } from "@/components/ui/PageShell";

export default function Header() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const isEnglish = language === "en";
  const arrowIcon = isEnglish ? faArrowRight : faArrowLeft;

  return (
    <PageShell
      className="flex justify-center pb-14"
      containerClassName="mt-8 flex flex-col gap-10"
      decorations={<BackgroundDecorations />}
    >
      <HeroSection t={t} arrowIcon={arrowIcon} />
      <FeaturesSection t={t} arrowIcon={arrowIcon} isEnglish={isEnglish} />
      <ToolsSection t={t} />
      <InstallFlowSection t={t} />
      <CtaSection t={t} arrowIcon={arrowIcon} />
    </PageShell>
  );
}
