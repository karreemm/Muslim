export default async function GetPage(pageNumber: string) {
  try {
    const response = await fetch(
      `https://api.quran.com/api/v4/verses/by_page/${pageNumber}?words=true&word_fields=text_uthmani,code_v2,line_number,page_number`,
    );
    const data = await response.json();
    return data.verses;
  } catch (error) {
    console.error("Error fetching Page:", error);
    throw error;
  }
}
