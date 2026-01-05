# Muslim App - API Documentation

This document provides comprehensive information about all APIs used in the Muslim web application. Each API is documented with its endpoints, parameters, authentication requirements, and usage examples.

---

## Table of Contents

1. [Quran APIs](#quran-apis)
2. [Hadith API](#hadith-api)
3. [Prayer Times API](#prayer-times-api)
4. [Azkar API](#azkar-api)

---

## 1. Quran APIs

### 1.1 AlQuran Cloud API

**Base URL:** `https://api.alquran.cloud/v1`

**Authentication:** ❌ No API Key Required

**Description:** Provides Quran text, audio, and surah information in various editions and languages.

#### Endpoints:

##### Get Surah by Number

```
GET /surah/{surahNumber}/{edition}
```

**Parameters:**

- `surahNumber` (required): Surah number (1-114)
- `edition` (required): Edition identifier (e.g., `quran-uthmani`, `ar.alafasy`)

**Example:**

```
https://api.alquran.cloud/v1/surah/1/quran-uthmani
```

**Response:**

```json
{
  "data": {
    "number": 1,
    "name": "سورة الفاتحة",
    "englishName": "Al-Fatiha",
    "ayahs": [
      {
        "number": 1,
        "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        "numberInSurah": 1
      }
    ]
  }
}
```

---

##### Get Juz by Number

```
GET /juz/{juzNumber}/{edition}
```

**Parameters:**

- `juzNumber` (required): Juz number (1-30)
- `edition` (required): Edition identifier (default: `quran-uthmani`)

**Example:**

```
https://api.alquran.cloud/v1/juz/1/quran-uthmani
```

**Response:**

```json
{
  "data": {
    "ayahs": [
      {
        "number": 1,
        "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        "surah": {
          "number": 1,
          "name": "الفاتحة"
        }
      }
    ]
  }
}
```

---

##### Get Surah with Audio (Listen Quran)

```
GET /surah/{surahNumber}/{reciterId}
```

**Parameters:**

- `surahNumber` (required): Surah number (1-114)
- `reciterId` (required): Reciter identifier (e.g., `ar.alafasy`, `ar.abdurrahmaansudais`)

**Example:**

```
https://api.alquran.cloud/v1/surah/1/ar.alafasy
```

**Available Reciters:**

- `ar.abdullahbasfar` - Abdullah Basfar (عبد الله بصفر)
- `ar.abdurrahmaansudais` - Abdurrahman Al-Sudais (عبدالرحمن السديس)
- `ar.shaatree` - Abu Bakr Ash-Shaatree (أبو بكر الشاطري)
- `ar.ahmedajamy` - Ahmed Al-Ajamy (أحمد العجمي)
- `ar.alafasy` - Mishary Alafasy (مشاري العفاسي)
- `ar.hanirifai` - Hani Rifai (هاني الرفاعي)
- `ar.husarymujawwad` - Mahmoud Al-Husary (محمود الحصري)
- `ar.hudhaify` - Ali Al-Hudhaify (علي الحذيفي)
- `ar.ibrahimakhbar` - Ibrahim Akhdar (إبراهيم الأخضر)
- `ar.mahermuaiqly` - Maher Al Muaiqly (ماهر المعيقلي)
- `ar.muhammadayyoub` - Muhammad Ayyoub (محمد أيوب)
- `ar.muhammadjibreel` - Muhammad Jibreel (محمد جبريل)
- `ar.saoodshuraym` - Saood Ash-Shuraym (سعود الشريم)
- `ar.minshawi` - Mohamed El-Minshawi (محمد المنشاوي)

---

### 1.2 Quran Tafseer API

**Base URL:** `http://api.quran-tafseer.com`

**Authentication:** ❌ No API Key Required

**Description:** Provides Quranic tafseer (interpretation) in multiple languages and from various scholars.

#### Endpoints:

##### Get Tafseer List

```
GET /tafseer
```

**Example:**

```
http://api.quran-tafseer.com/tafseer
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "التفسير الميسر",
    "language": "ar",
    "author": "مجموعة من العلماء",
    "book_name": "التفسير الميسر"
  }
]
```

---

##### Get Ayah Tafseer

```
GET /tafseer/{tafseerId}/{surahNumber}/{ayahNumber}
```

**Parameters:**

- `tafseerId` (required): Tafseer book ID
- `surahNumber` (required): Surah number (1-114)
- `ayahNumber` (required): Ayah number within the surah

**Example:**

```
http://api.quran-tafseer.com/tafseer/1/1/1
```

**Response:**

```json
{
  "tafseer_id": 1,
  "tafseer_name": "التفسير الميسر",
  "ayah_url": "http://...",
  "ayah_number": 1,
  "text": "سُورَة الفَاتِحَة: الحمد..."
}
```

---

### 1.3 Islamic Network Audio CDN

**Base URL:** `https://cdn.islamic.network/quran/audio`

**Authentication:** ❌ No API Key Required

**Description:** CDN for high-quality Quran audio files by various reciters.

#### Audio Files:

```
GET /192/{reciterId}/{absoluteAyahNumber}.mp3
```

**Parameters:**

- `reciterId` (required): Reciter identifier
- `absoluteAyahNumber` (required): Absolute ayah number (1-6236)

**Example:**

```
https://cdn.islamic.network/quran/audio/192/ar.alafasy/1.mp3
```

**Note:** Absolute ayah number is calculated by adding cumulative ayah count up to the surah + relative ayah number within that surah.

---

## 2. Hadith API

**Base URL:** Set via environment variable

**Authentication:** ✅ API Key Required

**Description:** Comprehensive hadith database with books, chapters, and searchable hadiths in multiple languages.

#### Endpoints:

##### Get All Books

```
GET /books?apiKey={API_KEY}
```

**Example:**

```
{BASE_URL}/books?apiKey=your_api_key
```

**Response:**

```json
{
  "books": [
    {
      "id": 1,
      "name": "Sahih Bukhari",
      "slug": "sahih-bukhari",
      "hadiths_count": 7563
    }
  ]
}
```

---

##### Get Book Chapters

```
GET /{bookSlug}/chapters?apiKey={API_KEY}&paginate={paginate}&page={page}
```

**Parameters:**

- `bookSlug` (required): Book identifier (e.g., `sahih-bukhari`)
- `paginate` (optional): Number of items per page
- `page` (optional): Page number

**Example:**

```
{BASE_URL}/sahih-bukhari/chapters?apiKey=your_api_key&paginate=20&page=1
```

**Response:**

```json
{
  "chapters": {
    "data": [
      {
        "id": 1,
        "book_slug": "sahih-bukhari",
        "chapter_number": "1",
        "chapter_english": "Revelation",
        "chapter_arabic": "بدء الوحي"
      }
    ],
    "current_page": 1,
    "total": 97
  }
}
```

---

##### Get Hadiths with Filters

```
GET /hadiths?apiKey={API_KEY}&{filters}
```

**Available Filters:**

- `hadithEnglish`: Search in English text
- `hadithUrdu`: Search in Urdu text
- `hadithArabic`: Search in Arabic text
- `hadithNumber`: Specific hadith number
- `book`: Book slug
- `chapter`: Chapter number
- `status`: Hadith status (`Sahih`, `Hasan`, `Da'eef`)
- `paginate`: Items per page
- `page`: Page number

**Example:**

```
{BASE_URL}/hadiths?apiKey=your_api_key&book=sahih-bukhari&chapter=1&paginate=10&page=1
```

**Response:**

```json
{
  "hadiths": {
    "data": [
      {
        "id": 1,
        "hadith_number": "1",
        "english_narrator": "Umar bin Al-Khattab",
        "hadith_english": "I heard Allah's Messenger saying...",
        "hadith_arabic": "سمعت رسول الله صلى الله عليه وسلم يقول...",
        "status": "Sahih"
      }
    ],
    "current_page": 1,
    "total": 7563
  }
}
```

---

## 3. Prayer Times API

### 3.1 Aladhan API

**Base URL:** `https://api.aladhan.com/v1`

**Authentication:** ❌ No API Key Required

**Description:** Islamic prayer times API with multiple calculation methods and location support.

#### Endpoints:

##### Get Prayer Times by Coordinates

```
GET /timings/{date}?latitude={lat}&longitude={lon}&method={method}
```

**Parameters:**

- `date` (required): Date in DD-MM-YYYY format or timestamp
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate
- `method` (optional): Calculation method (default: 5 - Egyptian General Authority)

**Calculation Methods:**

- `0` - Shia Ithna-Ashari
- `1` - University of Islamic Sciences, Karachi
- `2` - Islamic Society of North America
- `3` - Muslim World League
- `4` - Umm Al-Qura University, Makkah
- `5` - Egyptian General Authority of Survey (Used in app)
- `7` - Institute of Geophysics, University of Tehran

**Example:**

```
https://api.aladhan.com/v1/timings/05-01-2026?latitude=30.0444&longitude=31.2357&method=5
```

---

##### Get Prayer Times by City

```
GET /timingsByCity/{date}?city={city}&country={country}&method={method}
```

**Parameters:**

- `date` (required): Date in DD-MM-YYYY format
- `city` (required): City name
- `country` (required): Country name
- `method` (optional): Calculation method (default: 5)

**Example:**

```
https://api.aladhan.com/v1/timingsByCity/05-01-2026?city=Cairo&country=Egypt&method=5
```

**Response:**

```json
{
  "data": {
    "timings": {
      "Fajr": "05:15",
      "Sunrise": "06:45",
      "Dhuhr": "12:00",
      "Asr": "14:50",
      "Sunset": "17:15",
      "Maghrib": "17:15",
      "Isha": "18:40",
      "Imsak": "05:05",
      "Midnight": "00:00"
    }
  }
}
```

---

## 4. Azkar API

**Base URL:** `https://raw.githubusercontent.com/nawafalqari/azkar-api`

**Authentication:** ❌ No API Key Required

**Description:** Collection of Islamic remembrances (Azkar) categorized by occasion and time.

#### Endpoint:

```
GET /56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json
```

**Example:**

```
https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json
```

**Response Structure:**

```json
{
  "أذكار الصباح": [
    {
      "category": "أذكار الصباح",
      "count": "1",
      "description": "من قالها موقنا بها...",
      "reference": "البخاري 7/150",
      "content": "اللَّهُمَّ أَنْتَ رَبِّي..."
    }
  ],
  "أذكار المساء": [...],
  "أذكار الاستيقاظ": [...],
  "أذكار النوم": [...],
  "أذكار الصلاة": [...],
  "أدعية قرآنية": [...],
  "أدعية الأنبياء": [...]
}
```

**Available Categories:**

- أذكار الصباح (Morning Azkar)
- أذكار المساء (Evening Azkar)
- أذكار الاستيقاظ (Waking up Azkar)
- أذكار النوم (Sleeping Azkar)
- أذكار الصلاة (Prayer Azkar)
- أدعية قرآنية (Quranic Supplications)
- أدعية الأنبياء (Prophets' Supplications)

---

## Additional Resources

- **AlQuran Cloud API Docs:** https://alquran.cloud/api
- **Aladhan API Docs:** https://aladhan.com/prayer-times-api
- **Nominatim Docs:** https://nominatim.org/release-docs/latest/api/Overview/

---

**Made by [Kareem Abdel Nabi](https://github.com/karreemm)**
