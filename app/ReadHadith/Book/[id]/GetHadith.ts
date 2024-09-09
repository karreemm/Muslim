const maxHadithNumber = 4930;
import { toArabicNumber } from "@/app/Lib/Helpers";


export async function getHadith(bookId: string, hadithNumber: number | string): Promise<{ numberEn: number, numberAr: string, arabic: string } | null> {
  try {
    if (typeof hadithNumber === 'string') {
      hadithNumber = parseInt(hadithNumber, 10);
    }
    const response = await fetch(`https://api.hadith.gading.dev/books/${bookId}/${hadithNumber}`);
    const data = await response.json();
    if (data && data.data && data.data.contents) {
      return {
        numberEn: hadithNumber,
        numberAr: toArabicNumber(hadithNumber),
        arabic: data.data.contents.arab
      };
    } else {
      console.error('Hadith data is missing or in an unexpected format:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching hadith:', error);
    return null;
  }
}

export async function getMultipleHadiths(bookId: string, startingNumber: number | string): Promise<{ numberEn: number, numberAr: string, arabic: string }[]> {
    const hadiths = [];
    if (typeof startingNumber === 'string') {
      startingNumber = parseInt(startingNumber, 10);
    }
    for (let i = 0; i < 5; i++) {
      const hadithNumber = startingNumber + i;
      if (hadithNumber > maxHadithNumber) break;
      const hadith = await getHadith(bookId, hadithNumber);
      if (hadith) {
        hadiths.push(hadith);
      } else {
        break;
      }
    }
    return hadiths;
  }

