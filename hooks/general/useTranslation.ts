import { useLanguage } from "@/context/general/LanguageContext";
import { getNamespace, translate } from "@/lib/i18n";

export { translate } from "@/lib/i18n";

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: string, params?: Record<string, string | number>): string =>
    translate(language, key, params);

  return {
    t,
    getNamespace: (namespace: string) => getNamespace(language, namespace),
    language,
  };
}
