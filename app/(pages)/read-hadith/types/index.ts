export interface HadithBook {
    bookName: string;
    writerName: string;
    aboutWriter: string;
    bookSlug: string;
    hadiths_count: string;
    chapters_count: string;
}

export interface HadithChapter {
    id: number;
    chapterNumber: string;
    chapterEnglish: string;
    chapterUrdu: string;
    chapterArabic: string;
    bookSlug: string;
}

export interface Hadith {
    id: number;
    hadithNumber: string;
    englishNarrator: string;
    hadithEnglish: string;
    hadithUrdu: string;
    urduNarrator: string;
    hadithArabic: string;
    headingArabic: string;
    headingUrdu: string;
    headingEnglish: string;
    chapterId: string;
    bookSlug: string;
    volume: string;
    status: string;
    bookName?: string;
    chapterNumber?: string;
}

export interface PaginatedResponse<T> {
    hadiths?: {
        current_page: number;
        data: T[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
    chapters?: {
        current_page: number;
        data: T[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}