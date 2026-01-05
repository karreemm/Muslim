import beads from "../assets/azkar/beads.webp";
import moon from "../assets/azkar/moon.webp";
import mosque from "../assets/azkar/mosque.webp";
import praying from "../assets/azkar/praying.webp";
import quran from "../assets/azkar/quran.webp";
import sleep from "../assets/azkar/sleep.webp";
import sunny from "../assets/azkar/sunny.webp";
import wakeUp from "../assets/azkar/wake-up.webp";

export const AzkarCategories = [
  {
    id: "morning_azkar",
    ar: "أذكار الصباح",
    en: "Morning Azkar",
    number: 25,
    image: sunny,
  },
  {
    id: "evening_azkar",
    ar: "أذكار المساء",
    en: "Evening Azkar",
    number: 25,
    image: moon,
  },
  {
    id: "post_salah_azkar",
    ar: "أذكار بعد السلام من الصلاة المفروضة",
    en: "Post-Salah Azkar",
    number: 9,
    image: praying,
  },
  { id: "tasbeeh", ar: "تسابيح", en: "Tasbeeh", number: 16, image: beads },
  {
    id: "sleep_azkar",
    ar: "أذكار النوم",
    en: "Sleep Azkar",
    number: 10,
    image: sleep,
  },
  {
    id: "wake_up_azkar",
    ar: "أذكار الاستيقاظ",
    en: "Wake Up Azkar",
    number: 3,
    image: wakeUp,
  },
  {
    id: "quranic_duas",
    ar: "أدعية قرآنية",
    en: "Quranic Duas",
    number: 26,
    image: quran,
  },
  {
    id: "prophets_duas",
    ar: "أدعية الأنبياء",
    en: "Prophets' Duas",
    number: 13,
    image: mosque,
  },
];
