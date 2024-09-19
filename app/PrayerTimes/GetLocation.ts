
const translateToArabic = async (text: string): Promise<string> => {
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Translation response:', data); 
    return data.responseData.translatedText;
  } catch (err) {
    console.error('Error translating text:', err);
    return text; 
  }
};

export const getLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const { city, country_name: country } = await response.json();

    const cityInArabic = await translateToArabic(city);
    const countryInArabic = await translateToArabic(country);

    return {
      city: { en: city, ar: cityInArabic },
      country: { en: country, ar: countryInArabic },
    };
  } catch (err) {
    console.error('Error fetching user location:', err);
    throw new Error('Could not fetch location');
  }
};