import { useEffect, useState } from "react";
import { AzkarCategories } from "@/app/Contants/AzkarData";

/**
 * Custom hook to manage azkar category information
 * @param categoryId - The ID of the category to find
 * @returns Object containing category names in both languages and loading state
 */
export function useAzkarCategory(categoryId: string) {
  const [categoryNameEn, setCategoryNameEn] = useState<string>("");
  const [categoryNameAr, setCategoryNameAr] = useState<string>("");
  const [category, setCategory] = useState<any>(null);

  useEffect(() => {
    const foundCategory = AzkarCategories.find((cat) => cat.id === categoryId);
    if (foundCategory) {
      setCategoryNameEn(foundCategory.en);
      setCategoryNameAr(foundCategory.ar);
      setCategory(foundCategory);
    } else {
      setCategoryNameEn("");
      setCategoryNameAr("");
      setCategory(null);
    }
  }, [categoryId]);

  return {
    categoryNameEn,
    categoryNameAr,
    category,
  };
}
