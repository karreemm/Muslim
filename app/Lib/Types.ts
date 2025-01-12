export default interface TranslationPair {
    ar: string;
    en: string;
    [key: string]: string;
}

export interface DeceasedPerson {
    id: string;
    nameEn: string;
    nameAr: string;
    slug: string;
    messageEn: string;
    messageAr: string;
    createdAt: string;
}