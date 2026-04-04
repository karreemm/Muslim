"use client";

import ShareModal from "@/components/modals/ShareModal";

interface DeceasedHeroProps {
  mounted: boolean;
  language: string;
  title: string;
  shareLabel: string;
  nameEn: string;
  nameAr: string;
  messageEn?: string;
  messageAr?: string;
  shareableUrl: string;
}

export default function DeceasedHero({
  mounted,
  language,
  title,
  shareLabel,
  nameEn,
  nameAr,
  messageEn,
  messageAr,
  shareableUrl,
}: DeceasedHeroProps) {
  return (
    <section
      className={`
        rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-secondary/20 p-8 text-center shadow-2xl lg:p-12 relative overflow-hidden
        transition-all duration-700
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/30 rounded-full blur-2xl" />

      <h1
        className={`
          ${language === "ar" ? "leading-relaxed" : ""} text-2xl lg:text-4xl font-bold text-foreground mb-2
          transition-all duration-500 delay-300
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        {title}
      </h1>

      <p
        className={`
          text-4xl lg:text-6xl font-bold text-primary mb-6
          transition-all duration-500 delay-400
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        {language === "en" ? nameEn : nameAr}
      </p>

      <div
        className={`
          relative max-w-3xl mx-auto
          transition-all duration-500 delay-500
          ${mounted ? "opacity-100" : "opacity-0"}
        `}
      >
        <p className="text-lg lg:text-2xl text-foreground/80 italic leading-relaxed relative z-10">
          {language === "en"
            ? messageEn ||
              "May Allah forgive them, elevate their rank, and make this page a continuous charity."
            : messageAr ||
              "اللهم اغفر له وارفع درجته، واجعل هذه الصفحة صدقة جارية له."}
        </p>
      </div>

      <div
        className={`
          mt-8 flex flex-col items-center justify-center gap-4
          transition-all duration-500 delay-600
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        <div className="flex items-center gap-3 bg-primary/5 rounded-full px-6 py-3 border border-primary/10">
          <span className="text-sm text-muted-foreground font-medium">
            {shareLabel}
          </span>
          <div className="h-4 w-px bg-border" />
          <ShareModal url={shareableUrl} size="2xl" />
        </div>
      </div>
    </section>
  );
}
