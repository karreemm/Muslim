"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { reciters } from "@/constants/recitersData";
import PlayerIconButton from "@/components/general/PlayerIconButton";

interface AudioPlayerReciterDropdownProps {
  language: string;
  reciterId: string;
  isListenPage?: boolean;
  showReciterDropdown: boolean;
  setShowReciterDropdown: (value: boolean) => void;
  onReciterChange: (value: string) => void;
  dropdownRef?: React.RefObject<HTMLDivElement>;
  micBtnRef?: React.RefObject<HTMLButtonElement>;
  triggerVariant?: "icon" | "label";
  reciterName?: string;
  align?: "start" | "end";
}

export default function AudioPlayerReciterDropdown({
  language,
  reciterId,
  isListenPage = false,
  showReciterDropdown,
  setShowReciterDropdown,
  onReciterChange,
  dropdownRef,
  micBtnRef,
  triggerVariant = "icon",
  reciterName,
  align,
}: AudioPlayerReciterDropdownProps) {
  const isArabic = language === "ar";
  const menuAlignClass =
    align === "start"
      ? "left-0"
      : align === "end"
        ? "right-0"
        : isArabic
          ? "left-0"
          : "right-0";

  return (
    <div className="relative">
      {triggerVariant === "label" ? (
        <button
          ref={micBtnRef}
          disabled={isListenPage}
          onClick={() => setShowReciterDropdown(!showReciterDropdown)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-card text-foreground border border-border/50 hover:border-primary/30 hover:bg-secondary/50 transition-all duration-300 disabled:opacity-50"
        >
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span>{reciterName}</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`text-xs transition-transform duration-200 ${showReciterDropdown ? "rotate-180" : ""}`}
          />
        </button>
      ) : (
        <PlayerIconButton
          disabled={isListenPage}
          buttonRef={micBtnRef}
          onClick={() => setShowReciterDropdown(!showReciterDropdown)}
          tooltip={language === "ar" ? "تغيير القارئ" : "Change Reciter"}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${showReciterDropdown && !isListenPage ? "text-primary bg-secondary ring-2 ring-primary/20" : isListenPage ? "cursor-not-allowed text-muted-foreground/40" : "text-muted-foreground hover:text-primary hover:bg-secondary"}`}
        >
          <FontAwesomeIcon icon={faMicrophone} className="text-sm" />
        </PlayerIconButton>
      )}

      {showReciterDropdown && (
        <div
          ref={dropdownRef}
          className={`absolute bottom-[calc(100%+12px)] ${menuAlignClass} w-72 bg-popover/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border overflow-hidden z-[500] animate-in slide-in-from-bottom-2 fade-in duration-200`}
        >
          <div className="px-4 py-3 bg-muted/50 border-b border-border">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {language === "ar" ? "اختيار القارئ" : "Select Reciter"}
            </span>
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {reciters.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  onReciterChange(r.id);
                  localStorage.setItem("preferredReciter", r.id);
                  setShowReciterDropdown(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-3 ${r.id === reciterId ? "bg-primary/10 text-primary font-semibold border-r-2 border-primary" : "text-foreground hover:bg-muted"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${r.id === reciterId ? "border-primary" : "border-muted-foreground/30"}`}
                >
                  {r.id === reciterId && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                {language === "ar" ? r.NameAr : r.NameEn}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
