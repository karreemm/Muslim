import axios from 'axios';

export const getPrayerTimes = async (city: string, country: string, date: string) => {
  try {
    const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity/${date}`, {
      params: {
        city,
        country,
        method: 5, 
      },
    });
    return response.data.data.timings;
  } catch (err) {
    console.error('Failed to fetch prayer times:', err);
    throw new Error('Failed to fetch prayer times');
  }
};