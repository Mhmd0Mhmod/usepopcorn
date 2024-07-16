import { useEffect, useState } from "react";
import { KEY } from "../config";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      try {
        setError("");
        setIsLoading(true);
        const response = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("An error occurred. Please try again later.");
        const data = await response.json();
        console.log(data);
        if (data.Response === "False") throw new Error("No results found.");
        setMovies(data.Search);
      } catch (e) {
        console.log(e);
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    fetchData();
    // onCloseMovie();
    return function () {
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, error };
}
