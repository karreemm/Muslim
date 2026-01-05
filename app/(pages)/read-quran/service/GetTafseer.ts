export interface TafseerBook {
  id: number;
  name: string;
  language: string;
  author: string;
  book_name: string;
}

export interface AyahTafseer {
  tafseer_id: number;
  tafseer_name: string;
  ayah_url: string;
  ayah_number: number;
  text: string;
}

export const getTafseerList = async (): Promise<TafseerBook[]> => {
  try {
    const response = await fetch("/api/tafseer");
    if (!response.ok) {
      throw new Error("Failed to fetch tafseer list");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tafseer list:", error);
    return [];
  }
};

export const getAyahTafseer = async (
  tafseerId: number,
  surahNumber: number,
  ayahNumber: number
): Promise<AyahTafseer | null> => {
  try {
    const response = await fetch(
      `/api/tafseer?tafseerId=${tafseerId}&surahNumber=${surahNumber}&ayahNumber=${ayahNumber}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch ayah tafseer");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ayah tafseer:", error);
    return null;
  }
};
