import { useCallback, useEffect, useState } from "react";
import { MovieCompany } from "../../types";
import { getData } from "../../api";
import { GetMovieCompaniesResults } from "./useGetMovieCompanies.types";

export const useGetMovieCompanies = (): GetMovieCompaniesResults => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movieCompanies, setMovieCompanies] = useState<MovieCompany[]>([]);

  const fetchMovieCompanies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getData<MovieCompany[]>("movieCompanies");
      setMovieCompanies(response);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchMovieCompanies = useCallback(fetchMovieCompanies, []);

  useEffect(() => {
    fetchMovieCompanies();
  }, []);

  return { movieCompanies, isLoading, error, refetchMovieCompanies };
};
