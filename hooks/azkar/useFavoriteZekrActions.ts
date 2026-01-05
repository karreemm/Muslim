import { useEffect, useState } from "react";
import { useFavoriteAzkar } from "@/context/FavoriteAzkarContext";
import { AzkarItem } from "../../app/(pages)/azkar/service/GetAzkar";

/**
 * Custom hook to manage favorite azkar/zekr actions
 * @param categoryId - The category ID for the azkar/zekr
 * @returns Object containing favorite management functions and state
 */
export function useFavoriteZekrActions(categoryId: string) {
  const { favoriteAzkar, addFavoriteAzkar, removeFavoriteAzkar } =
    useFavoriteAzkar();

  /**
   * Handle adding/removing azkar from favorites
   * @param azkar - The azkar item to toggle
   */
  const handleLoveClick = (azkar: AzkarItem) => {
    const isFav = favoriteAzkar.some(
      (fav) => fav.number === azkar.number && fav.categoryId === categoryId
    );
    if (isFav) {
      removeFavoriteAzkar(azkar.number!, categoryId);
    } else {
      addFavoriteAzkar({
        ...azkar,
        categoryId: categoryId,
      });
    }
  };

  /**
   * Check if a specific zekr number is favorited
   * @param number - The zekr number to check
   * @returns boolean indicating if the zekr is favorited
   */
  const isFavorite = (number: number) => {
    return favoriteAzkar.some(
      (fav) => fav.number === number && fav.categoryId === categoryId
    );
  };

  /**
   * Get favorite status for a specific zekr (with state management)
   * @param zekr - The zekr item to check
   * @returns Object with favorite status and toggle function
   */
  const useFavoriteStatus = (zekr: AzkarItem | null) => {
    const [isFav, setIsFav] = useState<boolean>(false);

    useEffect(() => {
      if (zekr) {
        const status = favoriteAzkar.some(
          (fav) => fav.number === zekr.number && fav.categoryId === categoryId
        );
        setIsFav(status);
      }
    }, [zekr, favoriteAzkar]);

    const toggle = () => {
      if (zekr) {
        handleLoveClick(zekr);
        setIsFav(!isFav);
      }
    };

    return { isFav, toggle };
  };

  return {
    handleLoveClick,
    isFavorite,
    useFavoriteStatus,
    favoriteAzkar,
  };
}
