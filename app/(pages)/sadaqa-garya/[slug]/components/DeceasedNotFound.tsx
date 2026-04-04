"use client";

import { AlertCircle, Home } from "lucide-react";

interface DeceasedNotFoundProps {
  mounted: boolean;
  language: string;
  onGoHome: () => void;
}

export default function DeceasedNotFound({
  mounted,
  language,
  onGoHome,
}: DeceasedNotFoundProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div
        className={`
          rounded-2xl border border-border bg-card p-8 text-center text-foreground shadow-2xl max-w-md w-full
          transition-all duration-500
          ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="mb-4 text-2xl font-bold">
          {language === "en" ? "Person not found" : "لم يتم العثور على الشخص"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {language === "en"
            ? "The tribute you are looking for does not exist or has been removed."
            : "التكريم الذي تبحث عنه غير موجود أو تمت إزالته."}
        </p>
        <button
          onClick={onGoHome}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
        >
          <Home className="w-4 h-4" />
          {language === "en" ? "Return Home" : "العودة للرئيسية"}
        </button>
      </div>
    </div>
  );
}
