"use client";

import { STORAGE_KEYS } from "@/lib/storage";
import {
  DEFAULT_PALETTE,
  DEFAULT_PALETTE_HUE,
  VALID_PALETTE_MODES,
} from "@/utils/paletteEngine";

export const ThemeScript = () => {
  return (
    <script
      // The server emits an executable script; on client re-renders it must
      // not be executable again, which also avoids React's script-tag warning.
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
(function() {
  try {
    var root = document.documentElement;

    // ── Dark / Light ──────────────────────────────
    var stored = localStorage.getItem('${STORAGE_KEYS.theme}');
    var isDark = stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
    // Keep the UA canvas (and form controls) in sync before the first paint.
    root.style.colorScheme = isDark ? 'dark' : 'light';

    // ── Palette ───────────────────────────────────
    // Defaults come from paletteEngine; keep this aligned with PaletteContext.
    var storedPalette = localStorage.getItem('${STORAGE_KEYS.palette}') || '${DEFAULT_PALETTE}';
    var storedHue     = parseInt(localStorage.getItem('${STORAGE_KEYS.paletteHue}') || '${DEFAULT_PALETTE_HUE}', 10);
    var presets       = { teal:174, gold:38, emerald:148, midnight:228 };
    var validModes    = ${JSON.stringify(VALID_PALETTE_MODES)};

    if (validModes.indexOf(storedPalette) === -1) storedPalette = '${DEFAULT_PALETTE}';

    // For named presets: apply CSS class (globals.css handles the vars)
    root.classList.remove('teal','gold','emerald','midnight');
    if (storedPalette !== 'custom') {
      root.classList.add(storedPalette);
    } else {
      // For custom: inline all vars so there's no flash
      var h   = storedHue;
      var ah  = (h >= 15 && h <= 75) ? 174 : 43;
      var vars = isDark ? {
        '--background':              h+' 38% 9%',
        '--foreground':              h+' 42% 94%',
        '--card':                    h+' 34% 15%',
        '--card-foreground':         h+' 42% 94%',
        '--popover':                 h+' 34% 15%',
        '--popover-foreground':      h+' 42% 94%',
        '--primary':                 h+' 72% 50%',
        '--primary-foreground':      h+' 45% 8%',
        '--secondary':               h+' 28% 20%',
        '--secondary-foreground':    h+' 42% 90%',
        '--muted':                   h+' 24% 22%',
        '--muted-foreground':        h+' 22% 62%',
        '--accent':                  ah+' 86% 52%',
        '--accent-foreground':       h+' 45% 8%',
        '--destructive':             '0 84% 60%',
        '--destructive-foreground':  h+' 42% 94%',
        '--border':                  h+' 26% 25%',
        '--input':                   h+' 24% 22%',
        '--ring':                    h+' 72% 50%',
        '--player-bg':               h+' 38% 9% / 0.98',
        '--player-foreground':       h+' 42% 94%',
        '--player-control':          h+' 72% 50%',
        '--player-track':            h+' 24% 22%',
        '--player-track-active':     h+' 72% 50%',
        '--quran-surface':           h+' 32% 13%',
        '--quran-surface-foreground': h+' 42% 94%',
        '--quran-highlight':         h+' 72% 50%',
        '--quran-highlight-soft':    h+' 52% 17%',
        '--scrollbar-track':         h+' 38% 9%',
        '--scrollbar-thumb':         h+' 62% 38%',
        '--scrollbar-thumb-hover':   h+' 72% 48%',
        '--surah-header-foreground': h+' 42% 94%',
        '--surah-header-shadow':     '0 0% 0% / 0.65',
        '--prayer-times-next':       h+' 72% 50%',
        '--prayer-times-next-bg':    h+' 45% 8%',
        '--prayer-times-next-foreground': h+' 42% 94%',
      } : {
        '--background':              h+' 35% 96%',
        '--foreground':              h+' 58% 11%',
        '--card':                    h+' 28% 99%',
        '--card-foreground':         h+' 58% 11%',
        '--popover':                 h+' 28% 99%',
        '--popover-foreground':      h+' 58% 11%',
        '--primary':                 h+' 74% 28%',
        '--primary-foreground':      '0 0% 100%',
        '--secondary':               h+' 32% 90%',
        '--secondary-foreground':    h+' 55% 16%',
        '--muted':                   h+' 20% 90%',
        '--muted-foreground':        h+' 18% 36%',
        '--accent':                  ah+' 82% 40%',
        '--accent-foreground':       '0 0% 100%',
        '--destructive':             '0 73% 42%',
        '--destructive-foreground':  '0 0% 100%',
        '--border':                  h+' 24% 78%',
        '--input':                   h+' 20% 88%',
        '--ring':                    h+' 74% 28%',
        '--player-bg':               h+' 28% 99% / 0.97',
        '--player-foreground':       h+' 58% 11%',
        '--player-control':          h+' 74% 28%',
        '--player-track':            h+' 20% 88%',
        '--player-track-active':     h+' 74% 28%',
        '--quran-surface':           h+' 28% 99%',
        '--quran-surface-foreground': h+' 58% 11%',
        '--quran-highlight':         h+' 74% 34%',
        '--quran-highlight-soft':    h+' 68% 92%',
        '--scrollbar-track':         h+' 30% 93%',
        '--scrollbar-thumb':         h+' 65% 38%',
        '--scrollbar-thumb-hover':   h+' 74% 27%',
        '--surah-header-foreground': '0 0% 100%',
        '--surah-header-shadow':     '0 0% 0% / 0.55',
        '--prayer-times-next':       h+' 74% 28%',
        '--prayer-times-next-bg':    h+' 58% 11%',
        '--prayer-times-next-foreground': '0 0% 100%',
      };
      for (var k in vars) root.style.setProperty(k, vars[k]);
    }

    // Language and direction are server-rendered from the URL locale.

  } catch(e) {}
})();
        `,
      }}
    />
  );
};
