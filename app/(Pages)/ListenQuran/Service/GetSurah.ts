export interface Ayah {
  number: number;
  audio: string;
  text?: string;
}

export interface Surah {
  number: number;
  name?: string;
  englishName: string;
  arabicName?: string;
  reciterId?: string | number;
  ayahs: Ayah[];
}

export const fetchSurahByNumber = async (
  surahNumber: number,
  reciterId: string
): Promise<Surah | null> => {
  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/${reciterId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("API Response:", data);
    const surah = data.data;
    console.log("Fetched Surah:", surah);
    return surah || null;
  } catch (error) {
    console.error("Error fetching surah:", error);
    return null;
  }
};

export const fetchAyahAudio = async (
  surahNumber: number,
  ayahNumber: number,
  reciterId: string
): Promise<Blob | null> => {
  try {
    const response = await fetch(
      `/api/proxy?surahNumber=${surahNumber}&ayahNumber=${ayahNumber}&reciterId=${reciterId}`
    );
    if (!response.ok) {
      console.error(
        `Failed to fetch audio for ayah ${ayahNumber}: ${response.statusText}`
      );
      return null;
    }
    return await response.blob();
  } catch (error) {
    console.error(`Error fetching audio for ayah ${ayahNumber}:`, error);
    return null;
  }
};
