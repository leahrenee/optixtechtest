import { MovieCompany } from "../../types";

export type GetMovieCompaniesResults = {
  movieCompanies: MovieCompany[];
  isLoading: boolean;
  error: Error | null;
  refetchMovieCompanies: () => Promise<void>;
};
