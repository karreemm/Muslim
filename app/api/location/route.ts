import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    let latitude: number;
    let longitude: number;
    let city: string;
    let country: string;

    if (lat && lon) {
      latitude = parseFloat(lat);
      longitude = parseFloat(lon);

      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=8&addressdetails=1&accept-language=en`,
        {
          headers: {
            "User-Agent": "Muslim-App/1.0",
          },
        }
      );

      if (!geoResponse.ok) {
        throw new Error("Reverse geocoding failed");
      }

      const geoData = await geoResponse.json();
      city =
        geoData.address.state ||
        geoData.address.city ||
        geoData.address.town ||
        geoData.address.county ||
        geoData.address.region;
      country = geoData.address.country;
    } else {
      const response = await fetch(
        "http://ip-api.com/json/?fields=city,country,lat,lon"
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      city = data.city;
      country = data.country;
      latitude = data.lat;
      longitude = data.lon;
    }

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
