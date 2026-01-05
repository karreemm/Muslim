import { useState, useEffect } from "react";
import { HadithBook } from "@/types";
import { getBooks } from "@/app/(pages)/read-hadith/service/HadithApiService";

export function useHadithBooks() {
  const [books, setBooks] = useState<HadithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        const data = await getBooks();
        setBooks(data);
        setError(null);
      } catch (err) {
        setError("Failed to load hadith books");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  return { books, loading, error };
}
