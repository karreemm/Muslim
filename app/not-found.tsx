"use client";

import { useEffect, useState } from "react";
import { 
  Home, 
  ArrowLeft, 
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "../context/general/LanguageContext";

export default function NotFound() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const content: Record<string, { en: string; ar: string }> = {
    title: {
      en: "Page Not Found",
      ar: "الصفحة غير موجودة",
    },
    subtitle: {
      en: "404",
      ar: "٤٠٤",
    },
    description: {
      en: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
      ar: "قد تمت إزالة الصفحة التي تبحث عنها أو تغيير اسمها أو أنها غير متاحة مؤقتًا.",
    },
    button: {
      en: "Back to Home",
      ar: "العودة للرئيسية",
    },
    suggestion: {
      en: "Check the URL or try searching",
      ar: "تحقق من الرابط أو حاول البحث",
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      <div 
        className={`
          relative z-10 max-w-2xl w-full
          transition-all duration-700 ease-out
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div 
            className={`
              relative mb-6
              transition-all duration-500 delay-200
              ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
            `}
          >
            <div className="text-[8rem] md:text-[10rem] font-black leading-none bg-gradient-to-b from-primary/20 to-primary/5 bg-clip-text text-transparent select-none">
              {language === "en" ? content.subtitle.en : content.subtitle.ar}
            </div>
          </div>

          <h1 
            className={`
              text-2xl md:text-4xl font-bold text-foreground mb-4
              transition-all duration-500 delay-300
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            {language === "en" ? content.title.en : content.title.ar}
          </h1>

          <p 
            className={`
              text-muted-foreground text-base md:text-lg max-w-md mx-auto mb-8 leading-relaxed
              transition-all duration-500 delay-400
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            {language === "en" ? content.description.en : content.description.ar}
          </p>

          <div 
            className={`
              flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8
              transition-all duration-500 delay-500
              ${mounted ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <AlertCircle className="w-4 h-4" />
            <span>{language === "en" ? content.suggestion.en : content.suggestion.ar}</span>
          </div>

          <div 
            className={`
              flex flex-col sm:flex-row items-center justify-center gap-4
              transition-all duration-500 delay-600
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <a
              href="/"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <Home className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
              <span>{language === "en" ? content.button.en : content.button.ar}</span>
            </a>

            <button
              onClick={() => window.history.back()}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary/50 text-foreground border border-border rounded-xl font-semibold hover:bg-secondary transition-all duration-300 hover:border-primary/30"
            >

              {language === "en" ? (
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              )}
              <span>{language === "en" ? "Go Back" : "العودة للخلف"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}