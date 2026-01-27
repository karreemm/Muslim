import { removeDiacritics } from '@/utils/helpers';

export interface SearchAyah {
  number: number;
  text: string;
  edition: {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
  };
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

export interface SearchResponse {
  count: number;
  matches: SearchAyah[];
}

export const searchAyahs = async (
  keyword: string,
  surah: string | number = "all",
  page: number = 1,
  limit: number = 20
): Promise<SearchResponse | null> => {
  try {
    if (!keyword || keyword.trim().length === 0) {
      return { count: 0, matches: [] };
    }

    const normalizedKeyword = removeDiacritics(keyword.trim());

    if (normalizedKeyword.length <= 2) {
      throw new Error('Search term is too short. Please use at least 3 characters for better results.');
    }

    console.log('Original Keyword:', keyword);
    console.log('Normalized Keyword:', normalizedKeyword);
    console.log('Page:', page, 'Limit:', limit);

    const url = `https://api.alquran.cloud/v1/search/${encodeURIComponent(normalizedKeyword)}/${surah}/ar`;
    console.log('Search URL:', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      console.log('No results found (404)');
      return { count: 0, matches: [] };
    }

    if (response.status === 500) {
      console.error('Server error (500) - API cannot process this search');
      throw new Error('The API server is having trouble processing this search. Try using a longer or more specific search term.');
    }

    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      throw new Error(`Failed to search ayahs: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (!data.data || data.data.count === 0) {
      return { count: 0, matches: [] };
    }

    const quranMatches = data.data.matches.filter(
      (match: SearchAyah) => match.edition.type === "quran"
    );

    console.log('Quran Matches:', quranMatches.length);

    if (quranMatches.length === 0) {
      return { count: 0, matches: [] };
    }

    const uniqueAyahNumbers = Array.from(
      new Set(quranMatches.map((match: SearchAyah) => match.number))
    );

    console.log('Total unique ayahs:', uniqueAyahNumbers.length);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAyahNumbers = uniqueAyahNumbers.slice(startIndex, endIndex);

    console.log('Fetching ayahs for page:', paginatedAyahNumbers);

    const fullAyahs = [];
    for (const num of paginatedAyahNumbers) {
      try {
        const ayahResponse = await fetch(
          `https://api.alquran.cloud/v1/ayah/${num}/quran-uthmani`,
        );

        if (ayahResponse.ok) {
          const ayahData = await ayahResponse.json();
          fullAyahs.push(ayahData.data);
        }

        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`Error fetching ayah ${num}:`, error);
      }
    }

    return {
      count: uniqueAyahNumbers.length,
      matches: fullAyahs,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout - API took too long to respond');
        throw new Error('Request timeout. Please try again.');
      }
      console.error('Error searching ayahs:', error.message);
    } else {
      console.error('Error searching ayahs:', error);
    }
    throw error;
  }
};

export const searchInEdition = async (
  keyword: string,
  edition: string,
): Promise<SearchResponse | null> => {
  return searchAyahs(keyword, "all");
};

export const searchInSurah = async (
  keyword: string,
  surahNumber: number,
): Promise<SearchResponse | null> => {
  return searchAyahs(keyword, surahNumber);
};