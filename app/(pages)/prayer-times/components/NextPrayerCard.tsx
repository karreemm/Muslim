"use client";

interface NextPrayerCardProps {
  language: "en" | "ar";
  nextPrayerLabel?: string;
  nextPrayerTime: string;
  timeRemaining: string;
  nextPrayerText: string;
  remainingText: string;
}

export default function NextPrayerCard({
  language,
  nextPrayerLabel,
  nextPrayerTime,
  timeRemaining,
  nextPrayerText,
  remainingText,
}: NextPrayerCardProps) {
  return (
    <div className="relative z-10 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-background p-6 lg:p-8 shadow-2xl shadow-primary/10 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22hsl(var(--primary))%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
              {nextPrayerText}
            </p>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            {nextPrayerLabel || "--"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {language === "ar" ? "حان وقت الصلاة" : "Time to pray"}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 bg-background/40 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3">
            <p
              dir="ltr"
              className="text-4xl lg:text-5xl font-bold text-primary tabular-nums tracking-tight"
            >
              {nextPrayerTime}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium bg-primary/10 text-primary px-4 py-2 rounded-full">
            <span>{remainingText}:</span>
            <span dir="ltr" className="tabular-nums font-bold">
              {timeRemaining}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
