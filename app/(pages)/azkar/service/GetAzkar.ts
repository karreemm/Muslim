export interface AzkarItem {
  category: string;
  count: string;
  totalCount: number;
  currentCount: number;
  description: string;
  reference: string;
  content: string;
  number?: number;
}

export interface AzkarData {
  [category: string]: AzkarItem[];
}

const parseTotalCount = (count: string): number => {
  const parsed = parseInt(count, 10);
  return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
};

export const fetchAzkarByCategory = async (
  category: string,
): Promise<AzkarItem[] | null> => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json",
    );
    const data: AzkarData = await response.json();
    let azkarItems = data[category] || null;

    if (azkarItems) {
      if (category === "أذكار الصباح") {
        azkarItems = azkarItems.filter(
          (_, index) => index !== 0 && index !== 12,
        );
      }

      if (category === "أدعية قرآنية" || category === "أدعية الأنبياء") {
        azkarItems = azkarItems.map((item) => ({
          ...item,
          content: item.content
            .replace(/\\n',/g, " ")
            .replace(/'|"/g, "")
            .trim(),
          reference: item.reference.trim(),
        }));
      }

      return azkarItems.map((item, index) => ({
        ...item,
        number: index + 1,
        totalCount: parseTotalCount(item.count),
        currentCount: 0,
      }));
    }

    return null;
  } catch (error) {
    console.error("Error fetching Azkar:", error);
    return null;
  }
};

export const fetchAzkarCategoryCount = async (
  category: string,
): Promise<number> => {
  const azkarItems = await fetchAzkarByCategory(category);
  return azkarItems?.length ?? 0;
};

export const fetchAzkarItem = async (
  category: string,
  itemNumber: number,
): Promise<AzkarItem | null> => {
  const azkarItems = await fetchAzkarByCategory(category);
  if (azkarItems && itemNumber > 0 && itemNumber <= azkarItems.length) {
    return azkarItems[itemNumber - 1];
  }
  return null;
};

export const fetchAzkarItems = async (
  category: string,
  startNumber: number,
  count: number = 5,
): Promise<AzkarItem[] | null> => {
  const azkarItems = await fetchAzkarByCategory(category);
  if (azkarItems && startNumber > 0 && startNumber <= azkarItems.length) {
    const endNumber = Math.min(startNumber + count - 1, azkarItems.length);
    return azkarItems.slice(startNumber - 1, endNumber);
  }
  return null;
};
