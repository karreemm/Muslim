"use client";

import type { ComponentProps } from "react";
import NextLink from "next/link";
import { useLanguage } from "@/context/general/LanguageContext";
import { localizePath } from "@/lib/i18n";

type LocalizedLinkProps = ComponentProps<typeof NextLink>;

/**
 * A `next/link` wrapper that keeps root-relative URLs inside the active locale.
 * External, hash, mailto, and tel links are left untouched.
 */
export default function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const { language } = useLanguage();

  let localizedHref: LocalizedLinkProps["href"] = href;

  if (typeof href === "string") {
    localizedHref = localizePath(language, href);
  } else if (href && typeof href === "object" && typeof href.pathname === "string") {
    localizedHref = {
      ...href,
      pathname: localizePath(language, href.pathname),
    };
  }

  return <NextLink href={localizedHref} {...props} />;
}
