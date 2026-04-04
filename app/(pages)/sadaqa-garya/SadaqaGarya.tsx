"use client";

import { useSadaqaGaryaForm } from "../../../hooks/sadaqaGarya";
import { useTranslation } from "@/hooks/general/useTranslation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/general/LanguageContext";
import SadaqaNameFields from "./components/SadaqaNameFields";
import SadaqaMessageFields from "./components/SadaqaMessageFields";
import SadaqaSubmitSection from "./components/SadaqaSubmitSection";

export default function SadaqaGaryaPage() {
  const { t } = useTranslation();
  const {
    nameEn,
    nameAr,
    messageEn,
    messageAr,
    isSubmitting,
    setNameEn,
    setNameAr,
    setMessageEn,
    setMessageAr,
    handleSubmit,
    validateForm,
  } = useSadaqaGaryaForm();

  const [mounted, setMounted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isValid = validateForm();

  useEffect(() => {
    if ((nameEn || nameAr) && !isValid) {
      setShowValidation(true);
    } else {
      setShowValidation(false);
    }
  }, [nameEn, nameAr, isValid]);

  return (
    <div className="min-h-screen bg-background pb-16 pt-8 text-foreground lg:pt-12 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-secondary/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div
        className={`
          mx-auto w-[92%] max-w-4xl relative z-10
          transition-all duration-700 ease-out
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
        `}
      >
        <div className="rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm p-6 shadow-2xl lg:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

          <div className="mb-8 space-y-3 text-center">
            <h1 className="text-3xl font-bold lg:text-4xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t("sadaqa.form.title")}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 pt-8">
            <SadaqaNameFields
              mounted={mounted}
              nameEn={nameEn}
              nameAr={nameAr}
              onNameEnChange={setNameEn}
              onNameArChange={setNameAr}
              nameEnLabel={t("sadaqa.form.nameEnLabel")}
              nameArLabel={t("sadaqa.form.nameArLabel")}
            />

            <SadaqaMessageFields
              mounted={mounted}
              messageEn={messageEn}
              messageAr={messageAr}
              onMessageEnChange={setMessageEn}
              onMessageArChange={setMessageAr}
              messageEnLabel={t("sadaqa.form.messageEnLabel")}
              messageArLabel={t("sadaqa.form.messageArLabel")}
            />

            <SadaqaSubmitSection
              mounted={mounted}
              isValid={isValid}
              isSubmitting={isSubmitting}
              showValidation={showValidation}
              language={language}
              processingText={t("sadaqa.form.processing")}
              generateText={t("sadaqa.form.generate")}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
