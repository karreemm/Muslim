import { HadithBook, HadithChapter, Hadith, PaginatedResponse } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_HADITH_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_HADITH_API_BASE_URL;

export async function getBooks(): Promise<HadithBook[]> {
  try {
    const response = await fetch(`${BASE_URL}/books?apiKey=${API_KEY}`);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          "Invalid API key. Please check your NEXT_PUBLIC_HADITH_API_KEY in .env.local"
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.books || [];
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

export async function getChapters(
  bookSlug: string,
  paginate?: number,
  page?: number
): Promise<HadithChapter[] | PaginatedResponse<HadithChapter>> {
  try {
    let url = `${BASE_URL}/${bookSlug}/chapters?apiKey=${API_KEY}`;

    if (paginate) {
      url += `&paginate=${paginate}`;
    }

    if (page) {
      url += `&page=${page}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          "Invalid API key. Please check your NEXT_PUBLIC_HADITH_API_KEY in .env.local"
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.chapters && data.chapters.data) {
      return data;
    }

    return data.chapters || [];
  } catch (error) {
    console.error("Error fetching chapters:", error);
    throw error;
  }
}

export interface HadithFilters {
  hadithEnglish?: string;
  hadithUrdu?: string;
  hadithArabic?: string;
  hadithNumber?: string;
  book?: string;
  chapter?: string;
  status?: "Sahih" | "Hasan" | "Da`eef";
  paginate?: number;
  page?: number;
}

export async function getHadiths(
  filters: HadithFilters = {}
): Promise<PaginatedResponse<Hadith>> {
  try {
    let url = `${BASE_URL}/hadiths?apiKey=${API_KEY}`;

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url += `&${key}=${encodeURIComponent(value)}`;
      }
    });

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          "Invalid API key. Please check your NEXT_PUBLIC_HADITH_API_KEY in .env.local"
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching hadiths:", error);
    throw error;
  }
}

export async function getChapterHadiths(
  bookSlug: string,
  chapterNumber: string,
  page: number = 1,
  paginate: number = 10
): Promise<PaginatedResponse<Hadith>> {
  return getHadiths({
    book: bookSlug,
    chapter: chapterNumber,
    paginate,
    page,
  });
}

export async function searchHadiths(
  searchTerm: string,
  language: "en" | "ar" = "en",
  bookSlug?: string,
  page: number = 1,
  paginate: number = 10
): Promise<PaginatedResponse<Hadith>> {
  const filters: HadithFilters = {
    paginate,
    page,
  };

  if (language === "en") {
    filters.hadithEnglish = searchTerm;
  } else {
    filters.hadithArabic = searchTerm;
  }

  if (bookSlug) {
    filters.book = bookSlug;
  }

  return getHadiths(filters);
}

export async function searchHadithByNumber(
  hadithNumber: string,
  bookSlug?: string
): Promise<PaginatedResponse<Hadith>> {
  const filters: HadithFilters = {
    hadithNumber,
    paginate: 1,
  };

  if (bookSlug) {
    filters.book = bookSlug;
  }

  return getHadiths(filters);
}
