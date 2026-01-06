import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const response = await fetch(
      "http://ip-api.com/json/?fields=city,country,lat,lon"
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const city = data.city;
    const country = data.country;
    const latitude = data.lat;
    const longitude = data.lon;

    if (!city || !country) {
      throw new Error("Invalid response from location API");
    }

    const cityInArabic = await translateToArabic(city);
    const countryInArabic = await translateToArabic(country);

    return NextResponse.json({
      city: { en: city, ar: cityInArabic },
      country: { en: country, ar: countryInArabic },
      latitude,
      longitude,
    });
  } catch (error) {
    console.error("Error fetching location:", error);
    return NextResponse.json(
      { error: "Could not fetch location" },
      { status: 500 }
    );
  }
}

async function translateToArabic(text: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|ar`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.responseData.translatedText;
  } catch (err) {
    console.error("Error translating text:", err);
    return text;
  }
}
