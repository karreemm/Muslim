export const getLocation = async () => {
  try {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              maximumAge: 300000,
              enableHighAccuracy: false,
            });
          }
        );

        const { latitude, longitude } = position.coords;

        const response = await fetch(
          `/api/location?lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        return data;
      } catch (geoError) {
      }
    }

    const response = await fetch("/api/location");

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (err) {
    console.error("Error fetching user location:", err);
    throw new Error("Could not fetch location");
  }
};
