export default async function GetSurah(surahNumber: string) {
    const edition = 'quran-uthmani';
    try {
      const response = await fetch(`http://api.alquran.cloud/v1/surah/${surahNumber}/${edition}`);
      const data = await response.json();
      console.log('Fetched Surah Data:', data);
      return data.data;
    } catch (error) {
      console.error('Error fetching Surah:', error);
      throw error;
    }
  }