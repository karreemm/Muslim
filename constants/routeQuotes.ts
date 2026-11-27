// Verified Quran text for page quotes. Generated from
// data/searchQuran/quran-index.json (6,236 ayahs) and the Quran.com v4 API
// (code_v2 + page); do not edit by hand.

export type RouteQuote = {
  /** Uthmani text, used until the page font is ready. */
  text: string;
  /** Glyph text for the QCF page font, one entry per word. */
  codeV2: readonly string[];
  /** Madinah mushaf page, selects /quran-fonts/p{page}.woff2. */
  page: number;
  surah: number;
  ayah: number;
  surahNameAr: string;
  surahNameEn: string;
};

export const ROUTE_QUOTES = {
  quran: {
    text: "كِتَٰبٌ أَنزَلْنَٰهُ إِلَيْكَ مُبَٰرَكٌۭ لِّيَدَّبَّرُوٓا۟ ءَايَٰتِهِۦ وَلِيَتَذَكَّرَ أُو۟لُوا۟ ٱلْأَلْبَٰبِ",
    codeV2: ["ﱢ", "ﱣ", "ﱤ", "ﱥ", "ﱦ", "ﱧ", "ﱨ", "ﱩ", "ﱪ"],
    page: 455,
    surah: 38,
    ayah: 29,
    surahNameAr: "سُورَةُ صٓ",
    surahNameEn: "Saad",
  },
  listen: {
    text: "أَوْ زِدْ عَلَيْهِ وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا",
    codeV2: ["ﱏ", "ﱐ", "ﱑ", "ﱒ", "ﱓ", "ﱔ"],
    page: 574,
    surah: 73,
    ayah: 4,
    surahNameAr: "سُورَةُ المُزَّمِّلِ",
    surahNameEn: "Al-Muzzammil",
  },
  hadith: {
    text: "لَّقَدْ كَانَ لَكُمْ فِى رَسُولِ ٱللَّهِ أُسْوَةٌ حَسَنَةٌۭ لِّمَن كَانَ يَرْجُوا۟ ٱللَّهَ وَٱلْيَوْمَ ٱلْءَاخِرَ وَذَكَرَ ٱللَّهَ كَثِيرًۭا",
    codeV2: [
      "ﲾ",
      "ﲿ",
      "ﳀ",
      "ﳁ",
      "ﳂ",
      "ﳃ",
      "ﳄ",
      "ﳅ",
      "ﳆ",
      "ﳇ",
      "ﳈ",
      "ﳉ",
      "ﳊ",
      "ﳋ",
      "ﳌ",
      "ﳍ",
      "ﳎ",
    ],
    page: 420,
    surah: 33,
    ayah: 21,
    surahNameAr: "سُورَةُ الأَحۡزَابِ",
    surahNameEn: "Al-Ahzaab",
  },
  hadithBook: {
    text: "قُلْ إِن كُنتُمْ تُحِبُّونَ ٱللَّهَ فَٱتَّبِعُونِى يُحْبِبْكُمُ ٱللَّهُ وَيَغْفِرْ لَكُمْ ذُنُوبَكُمْ ۗ وَٱللَّهُ غَفُورٌۭ رَّحِيمٌۭ",
    codeV2: ["ﱞ", "ﱟ", "ﱠ", "ﱡ", "ﱢ", "ﱣ", "ﱤ", "ﱥ", "ﱦ", "ﱧ", "ﱨﱩ", "ﱪ", "ﱫ", "ﱬ"],
    page: 54,
    surah: 3,
    ayah: 31,
    surahNameAr: "سُورَةُ آلِ عِمۡرَانَ",
    surahNameEn: "Aal-i-Imraan",
  },
  azkar: {
    text: "ٱلَّذِينَ ءَامَنُوا۟ وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ ٱللَّهِ ۗ أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
    codeV2: ["ﳖ", "ﳗ", "ﳘ", "ﳙ", "ﳚ", "ﳛﳜ", "ﳝ", "ﳞ", "ﳟ", "ﳠ", "ﳡ"],
    page: 252,
    surah: 13,
    ayah: 28,
    surahNameAr: "سُورَةُ الرَّعۡدِ",
    surahNameEn: "Ar-Ra'd",
  },
  tasbeeh: {
    text: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَكُن مِّنَ ٱلسَّٰجِدِينَ",
    codeV2: ["ﱫ", "ﱬ", "ﱭ", "ﱮ", "ﱯ", "ﱰ"],
    page: 267,
    surah: 15,
    ayah: 98,
    surahNameAr: "سُورَةُ الحِجۡرِ",
    surahNameEn: "Al-Hijr",
  },
  prayer: {
    text: "حَٰفِظُوا۟ عَلَى ٱلصَّلَوَٰتِ وَٱلصَّلَوٰةِ ٱلْوُسْطَىٰ وَقُومُوا۟ لِلَّهِ قَٰنِتِينَ",
    codeV2: ["ﱁ", "ﱂ", "ﱃ", "ﱄ", "ﱅ", "ﱆ", "ﱇ", "ﱈ"],
    page: 39,
    surah: 2,
    ayah: 238,
    surahNameAr: "سُورَةُ البَقَرَةِ",
    surahNameEn: "Al-Baqara",
  },
  qibla: {
    text: "قَدْ نَرَىٰ تَقَلُّبَ وَجْهِكَ فِى ٱلسَّمَآءِ ۖ فَلَنُوَلِّيَنَّكَ قِبْلَةًۭ تَرْضَىٰهَا ۚ فَوَلِّ وَجْهَكَ شَطْرَ ٱلْمَسْجِدِ ٱلْحَرَامِ",
    codeV2: ["ﲌ", "ﲍ", "ﲎ", "ﲏ", "ﲐ", "ﲑﲒ", "ﲓ", "ﲔ", "ﲕﲖ", "ﲗ", "ﲘ", "ﲙ", "ﲚ", "ﲛﲜ"],
    page: 22,
    surah: 2,
    ayah: 144,
    surahNameAr: "سُورَةُ البَقَرَةِ",
    surahNameEn: "Al-Baqara",
  },
  radios: {
    text: "وَإِذَا قُرِئَ ٱلْقُرْءَانُ فَٱسْتَمِعُوا۟ لَهُۥ وَأَنصِتُوا۟ لَعَلَّكُمْ تُرْحَمُونَ",
    codeV2: ["ﲨ", "ﲩ", "ﲪ", "ﲫ", "ﲬ", "ﲭ", "ﲮ", "ﲯ"],
    page: 176,
    surah: 7,
    ayah: 204,
    surahNameAr: "سُورَةُ الأَعۡرَافِ",
    surahNameEn: "Al-A'raaf",
  },
  sadaqa: {
    text: "إِنَّ ٱلْمُصَّدِّقِينَ وَٱلْمُصَّدِّقَٰتِ وَأَقْرَضُوا۟ ٱللَّهَ قَرْضًا حَسَنًۭا يُضَٰعَفُ لَهُمْ وَلَهُمْ أَجْرٌۭ كَرِيمٌۭ",
    codeV2: ["ﳎ", "ﳏ", "ﳐ", "ﳑ", "ﳒ", "ﳓ", "ﳔ", "ﳕ", "ﳖ", "ﳗ", "ﳘ", "ﳙ"],
    page: 539,
    surah: 57,
    ayah: 18,
    surahNameAr: "سُورَةُ الحَدِيدِ",
    surahNameEn: "Al-Hadid",
  },
} as const satisfies Record<string, RouteQuote>;
