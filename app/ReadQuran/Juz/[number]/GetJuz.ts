const edition = 'quran-uthmani';

interface Ayah {
  number: number;
  text: string;
  surah: {
    number: number;
    name: string;
  };
}

interface JuzData {
  ayahs: Ayah[];
}

interface ApiResponse {
  data: JuzData;
}

export default async function GetJuzAyahs(juzNumber: number | string): Promise<Ayah[] | null> {
  try {
    const response = await fetch(`http://api.alquran.cloud/v1/juz/${juzNumber}/${edition}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching Juz: ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    return data.data.ayahs;

  } catch (error) {
    console.error('Error fetching Juz:', error);
    return null; 
  }
}

