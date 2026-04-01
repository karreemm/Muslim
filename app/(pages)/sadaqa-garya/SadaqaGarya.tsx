"use client";

import { useSadaqaGaryaForm } from "../../../hooks/sadaqaGarya";
import { useTranslation } from "@/hooks/general/useTranslation";

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

  return (
    <div className="min-h-screen bg-background pb-16 pt-8 text-foreground lg:pt-12 flex items-center justify-center">
      <div className="mx-auto w-[92%] max-w-4xl">
        <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-secondary/30 p-6 shadow-xl lg:p-8">
          <div className="mb-6 space-y-3 text-center">
            <h1 className="text-3xl font-semibold lg:text-4xl">
              {t("sadaqa.form.title")}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  {t("sadaqa.form.nameEnLabel")}{" "}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="h-12 w-full rounded-xl border border-input bg-background px-4 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
                  required
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  {t("sadaqa.form.nameArLabel")}{" "}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  className="fontAmiri h-12 w-full rounded-xl border border-input bg-background px-4 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
                  required
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  {t("sadaqa.form.messageEnLabel")}
                </label>
                <textarea
                  value={messageEn}
                  onChange={(e) => setMessageEn(e.target.value)}
                  className="min-h-[130px] w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
                  dir="ltr"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  {t("sadaqa.form.messageArLabel")}
                </label>
                <textarea
                  value={messageAr}
                  onChange={(e) => setMessageAr(e.target.value)}
                  className="fontAmiri min-h-[130px] w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
                  dir="rtl"
                  rows={5}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={!validateForm() || isSubmitting}
                className={`w-full rounded-xl px-5 py-3.5 text-base font-semibold transition ${
                  !validateForm() || isSubmitting
                    ? "cursor-not-allowed bg-primary/50 text-primary-foreground"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/35 border-t-primary-foreground" />
                    {t("sadaqa.form.processing")}
                  </span>
                ) : (
                  t("sadaqa.form.generate")
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
