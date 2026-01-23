export default async function GetJuz(id: string) {
  try {
    const response = await fetch(
      `https://api.quran.com/api/v4/verses/by_juz/${id}?words=true&word_fields=text_uthmani,line_number,page_number&per_page=1000`
    );
    const data = await response.json();
    return data.verses;
  } catch (error) {
    console.error("Error fetching Juz:", error);
    throw error;
  }
}
