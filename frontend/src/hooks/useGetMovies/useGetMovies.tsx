import { useCallback, useEffect, useState } from "react";
import { Movie } from "../../types";
import { getData } from "../../api";
import { GetMovies } from "./useGetMovies.types";

export const useGetMovies = (): GetMovies => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState<Movie[]>([]);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getData<Movie[]>("movies");
      setMovies(response);
    } catch (err: any) {
      setError(err);
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  const refetchMovies = useCallback(fetchMovies, []);

  useEffect(() => {
    fetchMovies();
  }, []);

  return { movies, isLoading, error, refetchMovies };
};
