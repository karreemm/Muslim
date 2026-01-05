import aboDawod from "../Assets/Books/aboDawod.webp";
import bukhari from "../Assets/Books/bukhari.webp";
import ibnMajah from "../Assets/Books/ibnMajah.webp";
import muslim from "../Assets/Books/muslim.webp";
import nasai from "../Assets/Books/nasai.webp";
import termezei from "../Assets/Books/termezei.webp";
import meshkatAlMasabih from "../Assets/Books/mishkatAlMasabih.webp";

export const hadithBooks = [
  {
    id: "sahih-bukhari",
    slug: "sahih-bukhari",
    name_en: "Sahih Bukhari",
    name_ar: "صحيح البخاري",
    image: bukhari,
    description_en: "The most authentic collection of hadith",
    description_ar: "أصح كتب الحديث",
  },
  {
    id: "sahih-muslim",
    slug: "sahih-muslim",
    name_en: "Sahih Muslim",
    name_ar: "صحيح مسلم",
    image: muslim,
    description_en: "The second most authentic hadith collection",
    description_ar: "ثاني أصح كتب الحديث",
  },
  {
    id: "al-tirmidhi",
    slug: "al-tirmidhi",
    name_en: "Jami' Al-Tirmidhi",
    name_ar: "جامع الترمذي",
    image: termezei,
    description_en: "Comprehensive collection by Imam Tirmidhi",
    description_ar: "مجموعة شاملة للإمام الترمذي",
  },
  {
    id: "abu-dawood",
    slug: "abu-dawood",
    name_en: "Sunan Abu Dawood",
    name_ar: "سنن أبي داود",
    image: aboDawod,
    description_en: "Collection focusing on legal hadiths",
    description_ar: "مجموعة تركز على الأحاديث الفقهية",
  },
  {
    id: "ibn-e-majah",
    slug: "ibn-e-majah",
    name_en: "Sunan Ibn-e-Majah",
    name_ar: "سنن ابن ماجه",
    image: ibnMajah,
    description_en: "One of the six major hadith collections",
    description_ar: "أحد الكتب الستة",
  },
  {
    id: "sunan-nasai",
    slug: "sunan-nasai",
    name_en: "Sunan An-Nasa'i",
    name_ar: "سنن النسائي",
    image: nasai,
    description_en: "Comprehensive hadith collection",
    description_ar: "مجموعة شاملة للأحاديث",
  },
  {
    id: "mishkat",
    slug: "mishkat",
    name_en: "Mishkat Al-Masabih",
    name_ar: "مشكاة المصابيح",
    image: meshkatAlMasabih,
    description_en: "A comprehensive hadith collection",
    description_ar: "مجموعة شاملة للأحاديث",
  },
];
