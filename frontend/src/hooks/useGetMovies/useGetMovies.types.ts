import { Movie } from "../../types";

export type GetMovies = {
  movies: Movie[];
  isLoading: boolean;
  error: Error | null;
  refetchMovies: () => Promise<void>;
};
