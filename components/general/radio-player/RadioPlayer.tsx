"use client";

import React from "react";
import { useRadioPlayer } from "@/hooks/radio";
import { useLanguage } from "@/context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeHigh,
  faVolumeMute,
  faSpinner,
  faRadio,
  faXmark,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import PlayerIconButton from "@/components/general/PlayerIconButton";

export default function RadioPlayer() {
  const {
    currentStation,
    isPlaying,
    isConnecting,
    error,
    togglePlayPause,
    toggleMute,
    stop,
    isMuted,
    toggleFavorite,
    isFavorite,
  } = useRadioPlayer();

  const { language } = useLanguage();
  const { t } = useTranslation();
  const isArabic = language === "ar";

  if (!currentStation) return null;

  const stationName = isArabic ? currentStation.nameAr : currentStation.nameEn;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] bg-background/90 backdrop-blur-2xl border-t border-border/50 shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
      <div className="px-4 pt-2 pb-1 max-w-7xl mx-auto w-full">
        <div dir="ltr" className="flex items-center gap-3">
          <div className="flex-1 h-5 flex items-center relative">
            <div className="absolute inset-y-0 my-auto w-full h-1.5 sm:h-2 rounded-full bg-primary" />
            <input
              type="range"
              min={0}
              max={100}
              value={100}
              readOnly
              className="relative w-full h-1.5 sm:h-2 rounded-full appearance-none pointer-events-none bg-transparent accent-primary AudioPlayer_audioSlider__AsaVr"
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="py-2.5 max-w-7xl mx-auto w-full">
        <div className="flex md:hidden items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className={`relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground shrink-0 shadow-md ${isPlaying ? "animate-pulse" : ""}`}
            >
              <FontAwesomeIcon icon={faRadio} className="text-sm" />
              {isPlaying && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background animate-pulse" />
              )}
            </div>
            <div className="min-w-0 flex flex-col justify-center flex-1">
              <h3 className="text-sm font-bold text-foreground truncate leading-tight">
                {stationName}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                {isConnecting && (
                  <span className="text-yellow-500 font-medium">
                    {t("radio.player.connecting")}
                  </span>
                )}
                {error && (
                  <span className="text-destructive font-medium">
                    {t("radio.player.error")}
                  </span>
                )}
                {!isConnecting && !error && (
                  <span className="truncate">
                    {isPlaying
                      ? t("radio.player.nowStreaming")
                      : t("radio.player.paused")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <PlayerIconButton
              onClick={togglePlayPause}
              disabled={isConnecting}
              tooltip={
                isPlaying ? t("radio.actions.pause") : t("radio.actions.play")
              }
              className={`w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25 transition-all active:scale-95 ${isConnecting ? "opacity-80" : "hover:scale-105"}`}
            >
              {isConnecting ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="animate-spin text-sm"
                />
              ) : (
                <FontAwesomeIcon
                  icon={isPlaying ? faPause : faPlay}
                  className={`text-sm ${!isPlaying ? "ml-0.5" : ""}`}
                />
              )}
            </PlayerIconButton>

            <div className="w-px h-5 bg-border mx-1" />

            <PlayerIconButton
              onClick={() => currentStation && toggleFavorite(currentStation)}
              tooltip={
                currentStation && isFavorite(currentStation)
                  ? t("radio.actions.removeFavorite")
                  : t("radio.actions.favorite")
              }
              className={`w-4 h-8 flex items-center justify-center transition-all ${currentStation && isFavorite(currentStation) ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"}`}
            >
              <FontAwesomeIcon icon={faStar} className="text-xs" />
            </PlayerIconButton>

            <div className="w-px h-5 bg-border mx-1" />

            <PlayerIconButton
              onClick={stop}
              tooltip={language === "ar" ? "إغلاق" : "Close"}
              className="w-4 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xs" />
            </PlayerIconButton>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={`relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground shrink-0 shadow-md ${isPlaying ? "animate-pulse" : ""}`}
            >
              <FontAwesomeIcon icon={faRadio} className="text-base" />
              {isPlaying && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background animate-pulse" />
              )}
            </div>

            <div className="min-w-0 flex flex-col justify-center">
              <h3 className="text-base font-bold text-foreground truncate leading-tight">
                {stationName}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                {isConnecting && (
                  <span className="text-yellow-500 font-medium">
                    {t("radio.player.connecting")}
                  </span>
                )}
                {error && (
                  <span className="text-destructive font-medium">
                    {t("radio.player.error")}
                  </span>
                )}
                {!isConnecting && !error && (
                  <span className="truncate">
                    {isPlaying
                      ? t("radio.player.nowStreaming")
                      : t("radio.player.paused")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 mx-auto absolute left-1/2 -translate-x-1/2">
            <PlayerIconButton
              onClick={togglePlayPause}
              disabled={isConnecting}
              tooltip={
                isPlaying ? t("radio.actions.pause") : t("radio.actions.play")
              }
              className={`w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-200 active:scale-95 ${isConnecting ? "opacity-80 cursor-wait" : "hover:scale-105 hover:shadow-primary/40"}`}
            >
              {isConnecting ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="animate-spin text-base"
                />
              ) : (
                <FontAwesomeIcon
                  icon={isPlaying ? faPause : faPlay}
                  className={`text-base ${!isPlaying ? "ml-0.5" : ""}`}
                />
              )}
            </PlayerIconButton>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <PlayerIconButton
              onClick={toggleMute}
              tooltip={
                isMuted ? t("radio.actions.unmute") : t("radio.actions.mute")
              }
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${isMuted ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-primary hover:bg-secondary hover:scale-110"}`}
            >
              <FontAwesomeIcon
                icon={isMuted ? faVolumeMute : faVolumeHigh}
                className="text-sm"
              />
            </PlayerIconButton>

            <div className="w-px h-5 bg-border mx-1" />

            <PlayerIconButton
              onClick={() => currentStation && toggleFavorite(currentStation)}
              tooltip={
                currentStation && isFavorite(currentStation)
                  ? t("radio.actions.removeFavorite")
                  : t("radio.actions.favorite")
              }
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${currentStation && isFavorite(currentStation) ? "text-yellow-500 bg-yellow-500/10" : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10 hover:scale-110"}`}
            >
              <FontAwesomeIcon icon={faStar} className="text-sm" />
            </PlayerIconButton>

            <div className="w-px h-5 bg-border mx-1" />

            <PlayerIconButton
              onClick={stop}
              tooltip={language === "ar" ? "إغلاق" : "Close"}
              className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:rotate-90"
            >
              <FontAwesomeIcon icon={faXmark} className="text-base" />
            </PlayerIconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
