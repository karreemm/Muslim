interface Surah {
    number: number;
    englishName: string;
    arabicName: string;
    ayahs: Array<{ number: number; audio: string }>;
}

export const fetchSurahByNumber = async (surahNumber: number, reciterId: string): Promise<Surah | null> => {
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/quran/${reciterId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('API Response:', data); 
        const surah = data.data.surahs.find((s: Surah) => s.number === surahNumber);
        console.log('Fetched Surah:', surah); 
        return surah || null;
    } catch (error) {
        console.error('Error fetching surah:', error);
        return null;
    }
};