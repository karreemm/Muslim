"use client";

import { useEffect, useRef, useState } from "react";

function cssVarToRgb(varName: string): { r: number; g: number; b: number } {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();

  const parts = raw.split(/\s+/);
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
}

const DARK_THRESHOLD = 0.45;
const LIGHT_THRESHOLD = 0.72;
const MAX_CACHE_SIZE = 15;
const DEBOUNCE_MS = 150;

interface ColorConfig {
  strokeVar: string;
  bgVar: string;
  strokeDarken?: number;
}

const cache = new Map<string, string>();

function makeCacheKey(src: string, strokeVar: string, bgVar: string) {
  if (typeof document === "undefined") return "";
  const stroke = getComputedStyle(document.documentElement)
    .getPropertyValue(strokeVar)
    .trim();
  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue(bgVar)
    .trim();
  return `${src}|${stroke}|${bg}`;
}

async function recolorImage(src: string, config: ColorConfig): Promise<string> {
  const cacheKey = makeCacheKey(src, config.strokeVar, config.bgVar);
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const strokeRgb = cssVarToRgb(config.strokeVar);
  const bgRgb = cssVarToRgb(config.bgVar);
  const darken = config.strokeDarken ?? 0.75;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i] / 255;
        const g = d[i + 1] / 255;
        const b = d[i + 2] / 255;
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        if (lum < DARK_THRESHOLD) {
          const scale = (lum / DARK_THRESHOLD) * darken;
          d[i]     = Math.min(255, Math.round(strokeRgb.r * (0.15 + scale * 0.85)));
          d[i + 1] = Math.min(255, Math.round(strokeRgb.g * (0.15 + scale * 0.85)));
          d[i + 2] = Math.min(255, Math.round(strokeRgb.b * (0.15 + scale * 0.85)));
        } else if (lum > LIGHT_THRESHOLD) {
          const scale = (lum - LIGHT_THRESHOLD) / (1 - LIGHT_THRESHOLD);
          d[i]     = Math.round(bgRgb.r * 0.85 + bgRgb.r * 0.15 * scale + 255 * 0.05 * scale);
          d[i + 1] = Math.round(bgRgb.g * 0.85 + bgRgb.g * 0.15 * scale + 255 * 0.05 * scale);
          d[i + 2] = Math.round(bgRgb.b * 0.85 + bgRgb.b * 0.15 * scale + 255 * 0.05 * scale);
        } else {
          const t = (lum - DARK_THRESHOLD) / (LIGHT_THRESHOLD - DARK_THRESHOLD);
          d[i]     = Math.round(strokeRgb.r * (1 - t) + bgRgb.r * t);
          d[i + 1] = Math.round(strokeRgb.g * (1 - t) + bgRgb.g * t);
          d[i + 2] = Math.round(strokeRgb.b * (1 - t) + bgRgb.b * t);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      if (cache.size >= MAX_CACHE_SIZE) {
        const oldest = cache.keys().next().value;
        if (oldest)
        cache.delete(oldest);
      }

      cache.set(cacheKey, dataUrl);
      resolve(dataUrl);
    };
    img.onerror = reject;
    img.src = src;
  });
}

export function useHeaderColor(src: string, config: ColorConfig) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const configRef = useRef(config);
  configRef.current = config;

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recolor = async () => {
    try {
      const url = await recolorImage(src, configRef.current);
      setDataUrl(url);
    } catch (e) {
      console.error("[useHeaderColor] failed to recolor image", e);
    }
  };

  const debouncedRecolor = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      for (const key of cache.keys()) {
        if (key.startsWith(src + "|")) cache.delete(key);
      }
      recolor();
    }, DEBOUNCE_MS);
  };

  useEffect(() => {
    recolor();
  }, [src]);

  useEffect(() => {
    const htmlObserver = new MutationObserver(debouncedRecolor);
    htmlObserver.observe(document.documentElement, {
      attributes: true,
    });

    const styleObserver = new MutationObserver(debouncedRecolor);
    styleObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      htmlObserver.disconnect();
      styleObserver.disconnect();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [src]);

  return dataUrl;
}