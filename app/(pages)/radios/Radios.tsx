"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { useRadioPlayer } from "@/hooks/radio";
import {
  radioStations,
  radioCategories,
  RadioStation,
  RadioCategory,
} from "@/constants/radioStationsData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRadio,
  faStar,
  faMagnifyingGlass,
  faXmark,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

export default function Radios() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const isArabic = language === "ar";
  const {
    currentStation,
    isPlaying,
    isConnecting,
    playStation,
    toggleFavorite,
    favoriteStations,
  } = useRadioPlayer();

  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});

  const toggleCategoryCollapse = (cat: RadioCategory) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const favoriteUrls = useMemo(
    () => new Set(favoriteStations),
    [favoriteStations],
  );

  const filteredStations = useMemo(() => {
    let stations = radioStations;

    if (showFavoritesOnly) {
      stations = stations.filter((s) => favoriteUrls.has(s.url));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      stations = stations.filter(
        (s) =>
          s.nameAr.toLowerCase().includes(q) ||
          s.nameEn.toLowerCase().includes(q),
      );
    }

    return stations;
  }, [searchQuery, showFavoritesOnly, favoriteUrls]);

  const groupedStations = useMemo(() => {
    const groups: Record<string, RadioStation[]> = {};
    for (const cat of radioCategories) {
      const catStations = filteredStations.filter((s) => s.category === cat);
      if (catStations.length > 0) {
        groups[cat] = catStations;
      }
    }
    return groups;
  }, [filteredStations]);

  const getStationName = (station: RadioStation) =>
    isArabic ? station.nameAr : station.nameEn;

  const isStationActive = (station: RadioStation) =>
    currentStation?.url === station.url;

  return (
    <div className="w-full min-h-screen bg-background text-foreground pb-32">
      <div className="relative z-10 w-[92%] max-w-7xl mx-auto pt-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t("radio.title")}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {t("radio.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3 mb-6 max-w-xl mx-auto">
          <div className="relative flex-1">
            <div
              className={`absolute top-1/2 -translate-y-1/2 ${
                isArabic ? "right-3" : "left-3"
              } text-muted-foreground`}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm" />
            </div>
            <input
              type="text"
              placeholder={t("radio.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl border border-border bg-card px-4 py-3 pl-10 pr-10 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary/50`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute top-1/2 -translate-y-1/2 ${
                  isArabic ? "left-3" : "right-3"
                } text-muted-foreground hover:text-foreground transition-colors`}
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
              showFavoritesOnly
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary"
            }`}
            title={isArabic ? "المفضلة فقط" : "Favorites only"}
          >
            <FontAwesomeIcon icon={faStar} className="text-sm" />
            <span className="hidden sm:inline text-sm font-medium">
              {isArabic ? "المفضلة" : "Favorites"}
            </span>
          </button>
        </div>

        {Object.keys(groupedStations).length === 0 ? (
          <div className="text-center py-16">
            <FontAwesomeIcon
              icon={faRadio}
              className="text-4xl text-muted-foreground/30 mb-4"
            />
            <p className="text-muted-foreground text-lg">
              {t("radio.noResults")}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {radioCategories.map((cat) => {
              const catStations = groupedStations[cat];
              if (!catStations) return null;

              const isCollapsed = collapsedCategories[cat] ?? false;

              return (
                <div key={cat}>
                  <button
                    onClick={() => toggleCategoryCollapse(cat)}
                    className="w-full flex items-center justify-between px-1 py-2 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {t(`radio.categories.${cat}`)}
                      </h2>
                      <span className="text-[10px] text-muted-foreground/60 font-medium">
                        ({catStations.length})
                      </span>
                    </div>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`text-xs text-muted-foreground/50 transition-transform duration-200 ${
                        isCollapsed ? "" : "rotate-180"
                      }`}
                    />
                  </button>

                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 transition-all duration-300 overflow-hidden ${
                      isCollapsed
                        ? "max-h-0 opacity-0 pointer-events-none"
                        : "max-h-[5000px] opacity-100"
                    }`}
                  >
                    {catStations.map((station) => {
                      const active = isStationActive(station);
                      const fav = favoriteUrls.has(station.url);

                      return (
                        <div
                          key={station.url}
                          className={`group relative flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all duration-300 ${
                            active
                              ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
                              : "border-border/50 bg-card/70 hover:border-primary/20 hover:bg-card hover:-translate-y-0.5 hover:shadow-md"
                          }`}
                          onClick={() => playStation(station)}
                        >
                          {/* Station Icon */}
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 transition-all duration-300 ${
                              active
                                ? "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md"
                                : "bg-secondary/50 text-primary group-hover:bg-primary/10"
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={station.icon}
                              className="text-lg"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3
                                className={`text-sm font-semibold truncate ${
                                  active ? "text-primary" : "text-foreground"
                                }`}
                              >
                                {getStationName(station)}
                              </h3>
                              {active && isPlaying && (
                                <span className="flex items-center gap-1 shrink-0">
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                  <span className="text-[10px] font-bold text-green-500 uppercase">
                                    {t("radio.player.live")}
                                  </span>
                                </span>
                              )}
                              {active && isConnecting && (
                                <span className="flex items-center gap-1 shrink-0">
                                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                                  <span className="text-[10px] font-bold text-yellow-500 uppercase">
                                    {t("radio.player.connecting")}
                                  </span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {t(`radio.categories.${station.category}`)}
                            </p>
                          </div>

                          {/* Favorite Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(station);
                            }}
                            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                              fav
                                ? "text-yellow-500 bg-yellow-500/10"
                                : "text-muted-foreground/30 hover:text-yellow-500 hover:bg-yellow-500/10"
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={faStar}
                              className="text-xs"
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
