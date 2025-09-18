import aboDawod from "../Assets/Books/aboDawod.webp"
import bukhari from "../Assets/Books/bukhari.webp"
import daremi from "../Assets/Books/daremi.webp"
import ibnMajah from "../Assets/Books/ibnMajah.webp"
import malik from "../Assets/Books/malik.webp"
import muslim from "../Assets/Books/muslim.webp"
import nasai from "../Assets/Books/nasai.webp"
import termezei from "../Assets/Books/termezei.webp"

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