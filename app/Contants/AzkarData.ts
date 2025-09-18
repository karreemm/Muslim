import beads from "../Assets/Azkar/beads.webp"
import moon from "../Assets/Azkar/moon.webp"
import mosque from "../Assets/Azkar/mosque.webp"
import praying from "../Assets/Azkar/praying.webp"
import quran from "../Assets/Azkar/quran.webp"
import sleep from "../Assets/Azkar/sleep.webp"
import sunny from "../Assets/Azkar/sunny.webp"
import wakeUp from "../Assets/Azkar/wake-up.webp"

export const AzkarCategories = [
    { id: 'morning_azkar', ar: 'أذكار الصباح', en: 'Morning Azkar', number: 25, image: sunny },
    { id: 'evening_azkar', ar: 'أذكار المساء', en: 'Evening Azkar', number: 25, image: moon },
    { id: 'post_salah_azkar', ar: 'أذكار بعد السلام من الصلاة المفروضة', en: 'Post-Salah Azkar', number: 9, image: praying },
    { id: 'tasbeeh', ar: 'تسابيح', en: 'Tasbeeh', number: 16, image: beads },
    { id: 'sleep_azkar', ar: 'أذكار النوم', en: 'Sleep Azkar', number: 10, image: sleep },
    { id: 'wake_up_azkar', ar: 'أذكار الاستيقاظ', en: 'Wake Up Azkar', number: 3, image: wakeUp },
    { id: 'quranic_duas', ar: 'أدعية قرآنية', en: 'Quranic Duas', number: 26, image: quran },
    { id: 'prophets_duas', ar: 'أدعية الأنبياء', en: 'Prophets\' Duas', number: 13, image: mosque }
  ];