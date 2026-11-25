"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoadingMark } from "@/components/ui/LoadingMark";
import { useTranslation } from "@/hooks/general/useTranslation";
import { APP_LOADING_EVENT } from "@/lib/loading";

const MIN_VISIBLE_MS = 300;

/**
 * Opaque, themed cover rendered in the static HTML and shown on every document
 * load and before language navigation. React owns its visibility, so a
 * root-layout navigation cannot remove the attribute that keeps it on screen.
 */
export default function ThemeLoadingOverlay() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const [shownAt, setShownAt] = useState(() => Date.now());

  useEffect(() => {
    const show = () => {
      setShownAt(Date.now());
      setVisible(true);
    };
    document.addEventListener(APP_LOADING_EVENT, show);
    return () => document.removeEventListener(APP_LOADING_EVENT, show);
  }, []);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const finish = () => {
      if (cancelled) return;
      const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - shownAt));
      timer = setTimeout(() => {
        if (!cancelled) setVisible(false);
      }, remaining);
    };

    requestAnimationFrame(finish);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [visible, pathname, shownAt]);

  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  return (
    <div
      id="app-loader"
      data-visible={visible ? "true" : "false"}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">{t("common.loading")}</span>
      <LoadingMark />
    </div>
  );
}
