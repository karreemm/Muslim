import AboBakr from "../Assets/Reciters/AboBakr.png";
import AhmedAgamy from "../Assets/Reciters/AhmedAgamy.png";
import Ali from "../Assets/Reciters/Ali.png";
import Besfer from "../Assets/Reciters/Besfer.png";
import HanyRefay from "../Assets/Reciters/HanyRefay.png";
import Husary from "../Assets/Reciters/Husary.png";
import Ibrahim from "../Assets/Reciters/Ibrahim.png";
import MaherMeaqly from "../Assets/Reciters/MaherMeaqly.png";
import Mashary from "../Assets/Reciters/Mashary.png";
import Menshawy from "../Assets/Reciters/Menshawy.png";
import MuhammedGebril from "../Assets/Reciters/MuhammedGebril.png";
import MuhammedIob from "../Assets/Reciters/MuhammedIob.png";
import Shorem from "../Assets/Reciters/Shorem.png";
import Sodes from "../Assets/Reciters/Sodes.png";

import aboDawod from "../Assets/Books/aboDawod.png"
import bukhari from "../Assets/Books/bukhari.png"
import daremi from "../Assets/Books/daremi.png"
import ibnMajah from "../Assets/Books/ibnMajah.png"
import malik from "../Assets/Books/malik.png"
import muslim from "../Assets/Books/muslim.png"
import nasai from "../Assets/Books/nasai.png"
import termezei from "../Assets/Books/termezei.png"

import beads from "../Assets/Azkar/beads.png"
import moon from "../Assets/Azkar/moon.png"
import mosque from "../Assets/Azkar/mosque.png"
import praying from "../Assets/Azkar/praying.png"
import quran from "../Assets/Azkar/quran.png"
import sleep from "../Assets/Azkar/sleep.png"
import sunny from "../Assets/Azkar/sunny.png"
import wakeUp from "../Assets/Azkar/wake-up.png"

export const surahNames = [
    { number: 1, en: "Al-Fatiha", ar: "الفاتحة", ayahs: 7 },
    { number: 2, en: "Al-Baqarah", ar: "البقرة", ayahs: 286 },
    { number: 3, en: "Aal-E-Imran", ar: "آل عمران", ayahs: 200 },
    { number: 4, en: "An-Nisa", ar: "النساء", ayahs: 176 },
    { number: 5, en: "Al-Maidah", ar: "المائدة", ayahs: 120 },
    { number: 6, en: "Al-Anam", ar: "الأنعام", ayahs: 165 },
    { number: 7, en: "Al-Araf", ar: "الأعراف", ayahs: 206 },
    { number: 8, en: "Al-Anfal", ar: "الأنفال", ayahs: 75 },
    { number: 9, en: "At-Tawbah", ar: "التوبة", ayahs: 129 },
    { number: 10, en: "Yunus", ar: "يونس", ayahs: 109 },
    { number: 11, en: "Hud", ar: "هود", ayahs: 123 },
    { number: 12, en: "Yusuf", ar: "يوسف", ayahs: 111 },
    { number: 13, en: "Ar-Rad", ar: "الرعد", ayahs: 43 },
    { number: 14, en: "Ibrahim", ar: "إبراهيم", ayahs: 52 },
    { number: 15, en: "Al-Hijr", ar: "الحجر", ayahs: 99 },
    { number: 16, en: "An-Nahl", ar: "النحل", ayahs: 128 },
    { number: 17, en: "Al-Isra", ar: "الإسراء", ayahs: 111 },
    { number: 18, en: "Al-Kahf", ar: "الكهف", ayahs: 110 },
    { number: 19, en: "Maryam", ar: "مريم", ayahs: 98 },
    { number: 20, en: "Taha", ar: "طه", ayahs: 135 },
    { number: 21, en: "Al-Anbiya", ar: "الأنبياء", ayahs: 112 },
    { number: 22, en: "Al-Hajj", ar: "الحج", ayahs: 78 },
    { number: 23, en: "Al-Muminun", ar: "المؤمنون", ayahs: 118 },
    { number: 24, en: "An-Nur", ar: "النور", ayahs: 64 },
    { number: 25, en: "Al-Furqan", ar: "الفرقان", ayahs: 77 },
    { number: 26, en: "Ash-Shuara", ar: "الشعراء", ayahs: 227 },
    { number: 27, en: "An-Naml", ar: "النمل", ayahs: 93 },
    { number: 28, en: "Al-Qasas", ar: "القصص", ayahs: 88 },
    { number: 29, en: "Al-Ankabut", ar: "العنكبوت", ayahs: 69 },
    { number: 30, en: "Ar-Rum", ar: "الروم", ayahs: 60 },
    { number: 31, en: "Luqman", ar: "لقمان", ayahs: 34 },
    { number: 32, en: "As-Sajda", ar: "السجدة", ayahs: 30 },
    { number: 33, en: "Al-Ahzab", ar: "الأحزاب", ayahs: 73 },
    { number: 34, en: "Saba", ar: "سبأ", ayahs: 54 },
    { number: 35, en: "Fatir", ar: "فاطر", ayahs: 45 },
    { number: 36, en: "Yaseen", ar: "يس", ayahs: 83 },
    { number: 37, en: "As-Saffat", ar: "الصافات", ayahs: 182 },
    { number: 38, en: "Sad", ar: "ص", ayahs: 88 },
    { number: 39, en: "Az-Zumar", ar: "الزمر", ayahs: 75 },
    { number: 40, en: "Ghafir", ar: "غافر", ayahs: 85 },
    { number: 41, en: "Fussilat", ar: "فصلت", ayahs: 54 },
    { number: 42, en: "Ash-Shura", ar: "الشورى", ayahs: 53 },
    { number: 43, en: "Az-Zukhruf", ar: "الزخرف", ayahs: 89 },
    { number: 44, en: "Ad-Dukhan", ar: "الدخان", ayahs: 59 },
    { number: 45, en: "Al-Jathiya", ar: "الجاثية", ayahs: 37 },
    { number: 46, en: "Al-Ahqaf", ar: "الأحقاف", ayahs: 35 },
    { number: 47, en: "Muhammad", ar: "محمد", ayahs: 38 },
    { number: 48, en: "Al-Fath", ar: "الفتح", ayahs: 29 },
    { number: 49, en: "Al-Hujraat", ar: "الحجرات", ayahs: 18 },
    { number: 50, en: "Qaf", ar: "ق", ayahs: 45 },
    { number: 51, en: "Adh-Dhariyat", ar: "الذاريات", ayahs: 60 },
    { number: 52, en: "At-Tur", ar: "الطور", ayahs: 49 },
    { number: 53, en: "An-Najm", ar: "النجم", ayahs: 62 },
    { number: 54, en: "Al-Qamar", ar: "القمر", ayahs: 55 },
    { number: 55, en: "Ar-Rahman", ar: "الرحمن", ayahs: 78 },
    { number: 56, en: "Al-Waqia", ar: "الواقعة", ayahs: 96 },
    { number: 57, en: "Al-Hadid", ar: "الحديد", ayahs: 29 },
    { number: 58, en: "Al-Mujadila", ar: "المجادلة", ayahs: 22 },
    { number: 59, en: "Al-Hashr", ar: "الحشر", ayahs: 24 },
    { number: 60, en: "Al-Mumtahina", ar: "الممتحنة", ayahs: 13 },
    { number: 61, en: "As-Saff", ar: "الصف", ayahs: 14 },
    { number: 62, en: "Al-Jumua", ar: "الجمعة", ayahs: 11 },
    { number: 63, en: "Al-Munafiqun", ar: "المنافقون", ayahs: 11 },
    { number: 64, en: "At-Taghabun", ar: "التغابن", ayahs: 18 },
    { number: 65, en: "At-Talaq", ar: "الطلاق", ayahs: 12 },
    { number: 66, en: "At-Tahrim", ar: "التحريم", ayahs: 12 },
    { number: 67, en: "Al-Mulk", ar: "الملك", ayahs: 30 },
    { number: 68, en: "Al-Qalam", ar: "القلم", ayahs: 52 },
    { number: 69, en: "Al-Haaqqa", ar: "الحاقة", ayahs: 52 },
    { number: 70, en: "Al-Maarij", ar: "المعارج", ayahs: 44 },
    { number: 71, en: "Nuh", ar: "نوح", ayahs: 28 },
    { number: 72, en: "Al-Jinn", ar: "الجن", ayahs: 28 },
    { number: 73, en: "Al-Muzzammil", ar: "المزمل", ayahs: 20 },
    { number: 74, en: "Al-Muddathir", ar: "المدثر", ayahs: 56 },
    { number: 75, en: "Al-Qiyama", ar: "القيامة", ayahs: 40 },
    { number: 76, en: "Al-Insan", ar: "الإنسان", ayahs: 31 },
    { number: 77, en: "Al-Mursalat", ar: "المرسلات", ayahs: 50 },
    { number: 78, en: "An-Naba", ar: "النبأ", ayahs: 40 },
    { number: 79, en: "An-Naziat", ar: "النازعات", ayahs: 46 },
    { number: 80, en: "Abasa", ar: "عبس", ayahs: 42 },
    { number: 81, en: "At-Takwir", ar: "التكوير", ayahs: 29 },
    { number: 82, en: "Al-Infitar", ar: "الإنفطار", ayahs: 19 },
    { number: 83, en: "Al-Mutaffifin", ar: "المطففين", ayahs: 36 },
    { number: 84, en: "Al-Inshiqaq", ar: "الإنشقاق", ayahs: 25 },
    { number: 85, en: "Al-Buruj", ar: "البروج", ayahs: 22 },
    { number: 86, en: "At-Tariq", ar: "الطارق", ayahs: 17 },
    { number: 87, en: "Al-Ala", ar: "الأعلى", ayahs: 19 },
    { number: 88, en: "Al-Ghashiya", ar: "الغاشية", ayahs: 26 },
    { number: 89, en: "Al-Fajr", ar: "الفجر", ayahs: 30 },
    { number: 90, en: "Al-Balad", ar: "البلد", ayahs: 20 },
    { number: 91, en: "Ash-Shams", ar: "الشمس", ayahs: 15 },
    { number: 92, en: "Al-Lail", ar: "الليل", ayahs: 21 },
    { number: 93, en: "Ad-Duha", ar: "الضحى", ayahs: 11 },
    { number: 94, en: "Ash-Sharh", ar: "الشرح", ayahs: 8 },
    { number: 95, en: "At-Tin", ar: "التين", ayahs: 8 },
    { number: 96, en: "Al-Alaq", ar: "العلق", ayahs: 19 },
    { number: 97, en: "Al-Qadr", ar: "القدر", ayahs: 5 },
    { number: 98, en: "Al-Bayyina", ar: "البينة", ayahs: 8 },
    { number: 99, en: "Az-Zalzala", ar: "الزلزلة", ayahs: 8 },
    { number: 100, en: "Al-Adiyat", ar: "العاديات", ayahs: 11 },
    { number: 101, en: "Al-Qaria", ar: "القارعة", ayahs: 11 },
    { number: 102, en: "At-Takathur", ar: "التكاثر", ayahs: 8 },
    { number: 103, en: "Al-Asr", ar: "العصر", ayahs: 3 },
    { number: 104, en: "Al-Humaza", ar: "الهمزة", ayahs: 9 },
    { number: 105, en: "Al-Fil", ar: "الفيل", ayahs: 5 },
    { number: 106, en: "Quraish", ar: "قريش", ayahs: 4 },
    { number: 107, en: "Al-Maun", ar: "الماعون", ayahs: 7 },
    { number: 108, en: "Al-Kawthar", ar: "الكوثر", ayahs: 3 },
    { number: 109, en: "Al-Kafiroon", ar: "الكافرون", ayahs: 6 },
    { number: 110, en: "An-Nasr", ar: "النصر", ayahs: 3 },
    { number: 111, en: "Al-Masad", ar: "المسد", ayahs: 5 },
    { number: 112, en: "Al-Ikhlas", ar: "الإخلاص", ayahs: 4 },
    { number: 113, en: "Al-Falaq", ar: "الفلق", ayahs: 5 },
    { number: 114, en: "An-Nas", ar: "الناس", ayahs: 6 }
  ];


export const juzNames = [
  { number: 1, name: { en: "Juz' 1", ar: "الجزء 1" }, surahs: 2 },    
  { number: 2, name: { en: "Juz' 2", ar: "الجزء 2" }, surahs: 1 },    
  { number: 3, name: { en: "Juz' 3", ar: "الجزء 3" }, surahs: 2 },    
  { number: 4, name: { en: "Juz' 4", ar: "الجزء 4" }, surahs: 2 },    
  { number: 5, name: { en: "Juz' 5", ar: "الجزء 5" }, surahs: 2 },    
  { number: 6, name: { en: "Juz' 6", ar: "الجزء 6" }, surahs: 2 },    
  { number: 7, name: { en: "Juz' 7", ar: "الجزء 7" }, surahs: 2 },    
  { number: 8, name: { en: "Juz' 8", ar: "الجزء 8" }, surahs: 2 },    
  { number: 9, name: { en: "Juz' 9", ar: "الجزء 9" }, surahs: 2 },    
  { number: 10, name: { en: "Juz' 10", ar: "الجزء 10" }, surahs: 2 }, 
  { number: 11, name: { en: "Juz' 11", ar: "الجزء 11" }, surahs: 2 }, 
  { number: 12, name: { en: "Juz' 12", ar: "الجزء 12" }, surahs: 2 }, 
  { number: 13, name: { en: "Juz' 13", ar: "الجزء 13" }, surahs: 2 }, 
  { number: 14, name: { en: "Juz' 14", ar: "الجزء 14" }, surahs: 2 }, 
  { number: 15, name: { en: "Juz' 15", ar: "الجزء 15" }, surahs: 2 }, 
  { number: 16, name: { en: "Juz' 16", ar: "الجزء 16" }, surahs: 2 }, 
  { number: 17, name: { en: "Juz' 17", ar: "الجزء 17" }, surahs: 2 }, 
  { number: 18, name: { en: "Juz' 18", ar: "الجزء 18" }, surahs: 2 }, 
  { number: 19, name: { en: "Juz' 19", ar: "الجزء 19" }, surahs: 2 }, 
  { number: 20, name: { en: "Juz' 20", ar: "الجزء 20" }, surahs: 2 }, 
  { number: 21, name: { en: "Juz' 21", ar: "الجزء 21" }, surahs: 3 }, 
  { number: 22, name: { en: "Juz' 22", ar: "الجزء 22" }, surahs: 3 }, 
  { number: 23, name: { en: "Juz' 23", ar: "الجزء 23" }, surahs: 3 }, 
  { number: 24, name: { en: "Juz' 24", ar: "الجزء 24" }, surahs: 3 }, 
  { number: 25, name: { en: "Juz' 25", ar: "الجزء 25" }, surahs: 3 }, 
  { number: 26, name: { en: "Juz' 26", ar: "الجزء 26" }, surahs: 3 }, 
  { number: 27, name: { en: "Juz' 27", ar: "الجزء 27" }, surahs: 3 }, 
  { number: 28, name: { en: "Juz' 28", ar: "الجزء 28" }, surahs: 3 }, 
  { number: 29, name: { en: "Juz' 29", ar: "الجزء 29" }, surahs: 11 },
  { number: 30, name: { en: "Juz' 30", ar: "الجزء 30" }, surahs: 37 } 
];

export const reciters = [
  { id: "ar.abdullahbasfar", NameEn: "Abdullah Basfar", NameAr: "عبد الله بصفر", image: Besfer },
  { id: "ar.abdurrahmaansudais", NameEn: "Abdurrahman Al-Sudais", NameAr: "عبدالرحمن السديس", image: Sodes },
  { id: "ar.shaatree", NameEn: "Abu Bakr Ash-Shaatree", NameAr: "أبو بكر الشاطري", image: AboBakr },
  { id: "ar.ahmedajamy", NameEn: "Ahmed Al-Ajamy", NameAr: "أحمد العجمي", image: AhmedAgamy },
  { id: "ar.alafasy", NameEn: "Mishary Alafasy", NameAr: "مشاري العفاسي", image: Mashary },
  { id: "ar.hanirifai", NameEn: "Hani Rifai", NameAr: "هاني الرفاعي", image: HanyRefay },
  { id: "ar.husarymujawwad", NameEn: "Mahmoud Al-Husary (Mujawwad)", NameAr: "محمود الحصري (المجود)", image: Husary },
  { id: "ar.hudhaify", NameEn: "Ali Al-Hudhaify", NameAr: "علي الحذيفي", image: Ali },
  { id: "ar.ibrahimakhbar", NameEn: "Ibrahim Akhdar", NameAr: "إبراهيم الأخضر", image: Ibrahim },
  { id: "ar.mahermuaiqly", NameEn: "Maher Al Muaiqly", NameAr: "ماهر المعيقلي", image: MaherMeaqly },
  { id: "ar.muhammadayyoub", NameEn: "Muhammad Ayyoub", NameAr: "محمد أيوب", image: MuhammedIob },
  { id: "ar.muhammadjibreel", NameEn: "Muhammad Jibreel", NameAr: "محمد جبريل", image: MuhammedGebril },
  { id: "ar.saoodshuraym", NameEn: "Saood bin Ibraaheem Ash-Shuraym", NameAr: "سعود الشريم", image: Shorem },
  {id:"ar.minshawi", NameEn: "Mohamed El-Minshawi", NameAr: "محمد المنشاوي", image: Menshawy}
];

export const hadithBooks = [
  {
      id: 'muslim',
      name_en: 'Muslim',
      name_ar: 'مسلم',
      image: muslim,
      number: 800
  },
  {
      id: 'bukhari',
      name_en: 'Bukhari',
      name_ar: 'البخاري',
      image: bukhari,
      number: 590
  },
  {
      id: 'tirmidzi',
      name_en: 'Tirmidhi',
      name_ar: 'الترمذي',
      image: termezei,
      number: 770     
  },
  {
      id: 'nasai',
      name_en: 'Nasai',
      name_ar: 'النسائي',
      image: nasai,
      number: 800
  },
  {
      id: 'abu-daud',
      name_en: 'Abu Daud',
      name_ar: 'أبو داود',
      image: aboDawod,
      number: 780
  },
  {
      id: 'ibnu-majah',
      name_en: 'Ibnu Majah',
      name_ar: 'ابن ماجه',
      image: ibnMajah,
      number: 800
  },
  {
      id: 'darimi',
      name_en: 'Darimi',
      name_ar: 'الدارمي',
      image: daremi,
      number: 660
  },
  {
      id: 'malik',
      name_en: 'Malik',
      name_ar: 'مالك',
      image: malik,
      number: 300
  }
];

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


