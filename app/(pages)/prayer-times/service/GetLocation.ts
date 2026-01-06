export const getLocation = async () => {
  try {
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
