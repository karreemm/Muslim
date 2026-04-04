"use client";

import { duas } from "@/constants/sadaqaData";

interface DuaSectionProps {
  mounted: boolean;
  title: string;
}

export default function DuaSection({ mounted, title }: DuaSectionProps) {
  return (
    <section className="space-y-6">
      <div
        className={`
          flex items-center gap-3 mb-6
          transition-all duration-500 delay-300
          ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}
        `}
      >
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
          {title}
        </h2>
      </div>

      <div dir="rtl" className="grid gap-4">
        {duas.map((dua, index) => (
          <article
            key={index}
            className={`
              rounded-2xl border border-border/70 bg-gradient-to-br from-card to-secondary/20 p-6 shadow-md hover:shadow-lg transition-all duration-300 group relative overflow-hidden hover:scale-[1.01]
              ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
            style={{ transitionDelay: `${index * 100 + 400}ms` }}
          >
            <div className="absolute right-0 top-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
            <p className="text-xl lg:text-2xl leading-loose text-foreground font-medium relative z-10">
              {dua}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
