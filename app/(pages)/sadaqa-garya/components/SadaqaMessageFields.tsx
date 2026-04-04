"use client";

import { MessageSquare } from "lucide-react";

interface SadaqaMessageFieldsProps {
  mounted: boolean;
  messageEn: string;
  messageAr: string;
  onMessageEnChange: (value: string) => void;
  onMessageArChange: (value: string) => void;
  messageEnLabel: string;
  messageArLabel: string;
}

export default function SadaqaMessageFields({
  mounted,
  messageEn,
  messageAr,
  onMessageEnChange,
  onMessageArChange,
  messageEnLabel,
  messageArLabel,
}: SadaqaMessageFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div
        className={`
          space-y-3 group
          transition-all duration-500 delay-300
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MessageSquare className="w-4 h-4 text-primary" />
          {messageEnLabel}
        </label>
        <textarea
          value={messageEn}
          onChange={(e) => onMessageEnChange(e.target.value)}
          className="min-h-[140px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background hover:border-primary/30 resize-none"
          dir="ltr"
          placeholder="Write a heartfelt message..."
        />
      </div>

      <div
        className={`
          space-y-3 group
          transition-all duration-500 delay-400
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MessageSquare className="w-4 h-4 text-primary" />
          {messageArLabel}
        </label>
        <textarea
          value={messageAr}
          onChange={(e) => onMessageArChange(e.target.value)}
          className="min-h-[140px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background hover:border-primary/30 resize-none"
          dir="rtl"
          placeholder="اكتب رسالة من القلب..."
        />
      </div>
    </div>
  );
}
