import { HadithBook, HadithChapter, Hadith, PaginatedResponse } from "../types";

async function fetchHadithApi(
  params: Record<string, string | number | undefined>,
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const response = await fetch(`/api/hadith?${searchParams.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        errorData?.error ||
          "Invalid hadith API key. Check HADITH_API_KEY in .env.local, then restart dev server.",
      );
    }
    throw new Error(
      errorData?.error || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json();
}

export async function getBooks(): Promise<HadithBook[]> {
  try {
    const data = await fetchHadithApi({ mode: "books" });
    return data.books || [];
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

export async function getChapters(
  bookSlug: string,
  paginate?: number,
  page?: number,
): Promise<HadithChapter[] | PaginatedResponse<HadithChapter>> {
  try {
    const data = await fetchHadithApi({
      mode: "chapters",
      bookSlug,
      paginate,
      page,
    });

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
  filters: HadithFilters = {},
): Promise<PaginatedResponse<Hadith>> {
  try {
    const data = await fetchHadithApi({ mode: "hadiths", ...filters });
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
  paginate: number = 10,
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
  paginate: number = 10,
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
  bookSlug?: string,
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
