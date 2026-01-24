export interface TranslationEdition {
  id: string;
  name: string;
  language: string;
  englishName: string;
  format: string;
  type: string;
}

export interface AyahTranslation {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  edition: {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
  };
}

export const popularTranslations: TranslationEdition[] = [
  {
    id: "en.asad",
    name: "Muhammad Asad",
    language: "en",
    englishName: "Muhammad Asad",
    format: "text",
    type: "translation",
  },
  {
    id: "en.sahih",
    name: "Saheeh International",
    language: "en",
    englishName: "Saheeh International",
    format: "text",
    type: "translation",
  },
  {
    id: "en.pickthall",
    name: "Mohammed Marmaduke William Pickthall",
    language: "en",
    englishName: "Pickthall",
    format: "text",
    type: "translation",
  },
  {
    id: "en.yusufali",
    name: "Abdullah Yusuf Ali",
    language: "en",
    englishName: "Yusuf Ali",
    format: "text",
    type: "translation",
  },
  {
    id: "en.hilali",
    name: "Muhammad Taqi-ud-Din al-Hilali and Muhammad Muhsin Khan",
    language: "en",
    englishName: "Hilali & Khan",
    format: "text",
    type: "translation",
  },
  {
    id: "en.ahmedali",
    name: "Ahmed Ali",
    language: "en",
    englishName: "Ahmed Ali",
    format: "text",
    type: "translation",
  },
];

export const getAyahTranslation = async (
  surahNumber: number,
  ayahNumber: number,
  editionId: string = "en.sahih",
): Promise<AyahTranslation | null> => {
  try {
    const reference = `${surahNumber}:${ayahNumber}`;
    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${reference}/${editionId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch ayah translation");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching ayah translation:", error);
    return null;
  }
};

export const getMultipleTranslations = async (
  surahNumber: number,
  ayahNumber: number,
  editionIds: string[],
): Promise<AyahTranslation[] | null> => {
  try {
    const reference = `${surahNumber}:${ayahNumber}`;
    const editions = editionIds.join(",");
    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${reference}/editions/${editions}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch ayah translations");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching ayah translations:", error);
    return null;
  }
};
