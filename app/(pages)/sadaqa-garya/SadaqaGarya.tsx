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
    <div className="min-h-screen bg-background dark:bg-background flex items-center">
      <div className="w-[90%] md:w-[60%] mx-auto mt-10">
        <h1 className="text-3xl mb-8 text-center text-foreground dark:text-foreground">
          {t("sadaqa.form.title")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-foreground mb-2">
              {t("sadaqa.form.nameEnLabel")}{" "}
              <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full p-2 border rounded-md bg-card text-foreground"
              required
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2">
              {t("sadaqa.form.nameArLabel")}{" "}
              <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              className="fontAmiri w-full p-2 border rounded-md bg-card text-foreground"
              required
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2">
              {t("sadaqa.form.messageEnLabel")}
            </label>
            <textarea
              value={messageEn}
              onChange={(e) => setMessageEn(e.target.value)}
              className="w-full p-2 border rounded-md bg-card text-foreground min-h-[100px]"
              dir="ltr"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-foreground mb-2">
              {t("sadaqa.form.messageArLabel")}
            </label>
            <textarea
              value={messageAr}
              onChange={(e) => setMessageAr(e.target.value)}
              className="fontAmiri w-full p-2 border rounded-md bg-card text-foreground min-h-[100px]"
              dir="rtl"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={!validateForm()}
            className={`w-full bg-primary text-primary-foreground p-3 rounded-md transition ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary/90"
            }`}
          >
            {isSubmitting ? "Processing..." : t("sadaqa.form.generate")}
          </button>
          <div className="h-10"></div>
        </form>
      </div>
    </div>
  );
}
