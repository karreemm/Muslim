"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../Context/LanguageContext";
import { useSadaqaGarya } from "../Context/SadaqatContext";
import { slugify } from "../Lib/Helpers";
import { DeceasedPerson } from "../Lib/Types";
import TranslationPair from "../Lib/Types";

export default function SadaqaGaryaPage() {

  const router = useRouter();
  const { language } = useLanguage();
  const { addDeceasedPerson } = useSadaqaGarya();
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [messageEn, setMessageEn] = useState(
    "This is a Sadaqa Jariyah page for the deceased. May Allah elevate their status in Jannah and grant them peace. Ameen."
  );
  const [messageAr, setMessageAr] = useState(
    "هذه صفحة صدقة جارية للمتوفى. نسأل الله أن يرفع درجته في الجنة ويجعل قبره روضة من رياض الجنة. آمين."
  );

  const translations: { [key: string]: TranslationPair } = {
    title: {
      en: "Create Sadaqa Garya",
      ar: "إنشاء صدقة جارية",
    },
    nameEnLabel: {
      en: "Deceased Name (English)",
      ar: "اسم المتوفى (بالإنجليزية)",
    },
    nameArLabel: {
      en: "Deceased Name (Arabic)",
      ar: "اسم المتوفى (بالعربية)",
    },
    messageEnLabel: {
      en: "Message (English)",
      ar: "الرسالة (بالإنجليزية)",
    },
    messageArLabel: {
      en: "Message (Arabic)",
      ar: "الرسالة (بالعربية)",
    },
    generate: {
      en: "Generate Page",
      ar: "إنشاء الصفحة",
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn || !nameAr) return;

    const timestamp = new Date().getTime();
    const baseSlug = slugify(nameEn);
    const uniqueSlug = `${baseSlug}-${timestamp}`;

    const deceased: DeceasedPerson = {
      id: uniqueSlug,
      nameEn,
      nameAr,
      messageEn,
      messageAr,
      slug: uniqueSlug,
      createdAt: new Date().toISOString(),
    };

    // Add deceased person using context
    addDeceasedPerson(deceased);

    // Encode the data for URL sharing
    const encodedData = btoa(JSON.stringify(deceased));
    
    // Navigate to the newly created page with encoded data
    router.push(`/SadaqaGarya/${uniqueSlug}?data=${encodedData}`);

  };

  const validateForm = () => {
    return nameEn.trim() !== "" && nameAr.trim() !== "";
  };

  return (
    <div className="min-h-screen bg-[#FFF5E4] dark:bg-slate-900 p-8 flex items-center">
      <div className="w-[90%] md:w-[60%] mx-auto mt-20">
        <h1 className="text-3xl mb-8 text-center text-[#134B70] dark:text-white">
          {translations.title[language]}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#134B70] dark:text-white mb-2">
              {translations.nameEnLabel[language]} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 text-[#134B70] dark:text-white"
              required
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-[#134B70] dark:text-white mb-2">
              {translations.nameArLabel[language]} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              className="fontAmiri w-full p-2 border rounded-md bg-white dark:bg-slate-800 text-[#134B70] dark:text-white"
              required
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-[#134B70] dark:text-white mb-2">
              {translations.messageEnLabel[language]}
            </label>
            <textarea
              value={messageEn}
              onChange={(e) => setMessageEn(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 text-[#134B70] dark:text-white min-h-[100px]"
              dir="ltr"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-[#134B70] dark:text-white mb-2">
              {translations.messageArLabel[language]}
            </label>
            <textarea
              value={messageAr}
              onChange={(e) => setMessageAr(e.target.value)}
              className="fontAmiri w-full p-2 border rounded-md bg-white dark:bg-slate-800 text-[#134B70] dark:text-white min-h-[100px]"
              dir="rtl"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={!validateForm()}
            className="w-full bg-teal-600 text-white p-3 rounded-md hover:bg-teal-700 transition"
          >
            {translations.generate[language]}
          </button>
          <div className="h-10"></div>
        </form>
      </div>
    </div>
  );
}
