"use client";

import { User } from "lucide-react";

interface SadaqaNameFieldsProps {
  mounted: boolean;
  nameEn: string;
  nameAr: string;
  onNameEnChange: (value: string) => void;
  onNameArChange: (value: string) => void;
  nameEnLabel: string;
  nameArLabel: string;
}

export default function SadaqaNameFields({
  mounted,
  nameEn,
  nameAr,
  onNameEnChange,
  onNameArChange,
  nameEnLabel,
  nameArLabel,
}: SadaqaNameFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div
        className={`
          space-y-3 group
          transition-all duration-500 delay-100
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <User className="w-4 h-4 text-primary" />
          {nameEnLabel}
          <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={nameEn}
            onChange={(e) => onNameEnChange(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 pl-10 text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background hover:border-primary/30"
            required
            dir="ltr"
            placeholder="Mohamed Ahmed"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
            EN
          </span>
        </div>
      </div>

      <div
        className={`
          space-y-3 group
          transition-all duration-500 delay-200
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <User className="w-4 h-4 text-primary" />
          {nameArLabel}
          <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={nameAr}
            onChange={(e) => onNameArChange(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 pr-10 text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background hover:border-primary/30"
            required
            dir="rtl"
            placeholder="محمد أحمد"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
            ع
          </span>
        </div>
      </div>
    </div>
  );
}
