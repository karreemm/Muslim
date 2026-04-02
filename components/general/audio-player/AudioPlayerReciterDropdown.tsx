"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { reciters } from "@/constants/recitersData";
import PlayerIconButton from "@/components/general/PlayerIconButton";

interface AudioPlayerReciterDropdownProps {
  language: string;
  reciterId: string;
  isListenPage: boolean;
  showReciterDropdown: boolean;
  setShowReciterDropdown: (value: boolean) => void;
  setReciterId: (value: string) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  micBtnRef: React.RefObject<HTMLButtonElement>;
}

export default function AudioPlayerReciterDropdown({
  language,
  reciterId,
  isListenPage,
  showReciterDropdown,
  setShowReciterDropdown,
  setReciterId,
  dropdownRef,
  micBtnRef,
}: AudioPlayerReciterDropdownProps) {
  return (
    <div className="relative">
      <PlayerIconButton
        disabled={isListenPage}
        buttonRef={micBtnRef}
        onClick={() => setShowReciterDropdown(!showReciterDropdown)}
        tooltip={language === "ar" ? "تغيير القارئ" : "Change Reciter"}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${showReciterDropdown && !isListenPage ? "text-primary bg-secondary ring-2 ring-primary/20" : isListenPage ? "cursor-not-allowed text-muted-foreground/40" : "text-muted-foreground hover:text-primary hover:bg-secondary"}`}
      >
        <FontAwesomeIcon icon={faMicrophone} className="text-sm" />
      </PlayerIconButton>

      {showReciterDropdown && (
        <div
          ref={dropdownRef}
          className={`absolute bottom-[calc(100%+12px)] ${language === "ar" ? "left-0" : "right-0"} w-72 bg-popover/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border overflow-hidden z-[500] animate-in slide-in-from-bottom-2 fade-in duration-200`}
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
                  setReciterId(r.id);
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
