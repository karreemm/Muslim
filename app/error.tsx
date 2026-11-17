"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/general/useTranslation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-3xl font-bold text-destructive">
          !
        </div>
        <h1 className="text-2xl font-bold text-foreground">{t("common.errorTitle")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t("common.errorDescription")}
        </p>
        {error.digest ? (
          <p className="mt-3 text-xs text-muted-foreground/70">
            Error ID: <code>{error.digest}</code>
          </p>
        ) : null}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          >
            {t("common.tryAgain")}
          </button>
          <Link
            href="/"
            className="rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-secondary/50"
          >
            {t("common.backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
