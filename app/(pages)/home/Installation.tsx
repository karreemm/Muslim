import install from "../../Assets/Installation.webp";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";

export default function Installation() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-[90%] bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-white flex flex-col gap-10 md:flex md:flex-row md:justify-between md:items-center">
          <div className="w-full md:w-[70%] flex flex-col">
            <h1 className="text-2xl font-bold">{t("home.install")}</h1>

            <ul
              className={`flex flex-col list-disc list-outside text-lg gap-3 mt-5 relative ${
                language === "en" ? "pl-5" : "pr-5"
              }`}
            >
              <li
                className={`before:absolute ${
                  language === "en" ? "before:left-0" : "before:right-0"
                } before:text-lg before:font-bold before:top-0 before:mt-1`}
              >
                {t("home.step1")}
              </li>

              <li
                className={`before:absolute ${
                  language === "en" ? "before:left-0" : "before:right-0"
                } before:text-lg before:font-bold before:top-0 before:mt-8`}
              >
                {t("home.step2")}
              </li>

              <li
                className={`before:absolute ${
                  language === "en" ? "before:left-0" : "before:right-0"
                } before:text-lg before:font-bold before:top-0 before:mt-16`}
              >
                {t("home.step3")}
              </li>
            </ul>
          </div>
          <div className="w-full md:w-[30%] flex justify-center">
            <img
              src={install.src}
              alt="Installation"
              className="w-[80%] rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
}
