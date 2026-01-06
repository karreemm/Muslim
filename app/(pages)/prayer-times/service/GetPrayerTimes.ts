import axios from "axios";

export const getPrayerTimes = async (
  city: string,
  country: string,
  date: string,
  latitude?: number,
  longitude?: number
) => {
  try {
    if (city && country) {
      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity/${date}`,
        {
          params: {
            city,
            country,
            method: 5,
          },
        }
      );
      return response.data.data.timings;
    }

    if (latitude !== undefined && longitude !== undefined) {
      const response = await axios.get(
        `https://api.aladhan.com/v1/timings/${date}`,
        {
          params: {
            latitude,
            longitude,
            method: 5,
          },
        }
      );
      return response.data.data.timings;
    }
    throw new Error("Could not determine location for prayer times");
  } catch (err) {
    console.error("Failed to fetch prayer times:", err);
    throw new Error("Failed to fetch prayer times");
  }
};
