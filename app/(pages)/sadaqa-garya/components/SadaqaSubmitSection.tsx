"use client";

import { Send, Sparkles } from "lucide-react";

interface SadaqaSubmitSectionProps {
  mounted: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  showValidation: boolean;
  language: string;
  processingText: string;
  generateText: string;
}

export default function SadaqaSubmitSection({
  mounted,
  isValid,
  isSubmitting,
  showValidation,
  language,
  processingText,
  generateText,
}: SadaqaSubmitSectionProps) {
  return (
    <div
      className={`
        pt-4
        transition-all duration-500 delay-500
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={`
          group relative w-full rounded-xl px-6 py-4 text-base font-semibold transition-all duration-300 overflow-hidden
          ${
            !isValid || isSubmitting
              ? "cursor-not-allowed bg-primary/30 text-primary-foreground/50"
              : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
          }
        `}
      >
        <div className="relative flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              <span>{processingText}</span>
            </>
          ) : (
            <>
              <span>{generateText}</span>
              <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </div>

        {!isSubmitting && isValid && (
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        )}
      </button>

      <div
        className={`
          text-center text-sm text-destructive mt-3
          transition-all duration-300
          ${
            showValidation
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }
        `}
      >
        {language === "en"
          ? "Please fill in both name fields to continue"
          : "يرجى ملء كلا حقلي الاسم لمواصلة"}
      </div>
    </div>
  );
}
