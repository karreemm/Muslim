import { siteDescription, siteName, SITE_URL } from "@/lib/seo";
import { localeDirections, locales, type Locale } from "@/lib/i18n";

export function WebsiteJsonLd({ locale }: { locale: Locale }) {
  const name = siteName(locale);
  const description = siteDescription(locale);
  const homeUrl = `${SITE_URL}/${locale}`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: homeUrl,
        name,
        description,
        inLanguage: [...locales],
        potentialAction: {
          "@type": "SearchAction",
          target: `${homeUrl}/search-ayah?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name,
        url: homeUrl,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/icons/icon-512.png`,
          width: 512,
          height: 512,
        },
        sameAs: ["https://github.com/karreemm/Muslim"],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      data-direction={localeDirections[locale]}
    />
  );
}
