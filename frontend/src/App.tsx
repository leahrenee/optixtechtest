import { useState } from "react";
import { Movie, MovieCompany } from "./types";
import { useGetMovies } from "./hooks/useGetMovies/useGetMovies";
import { useGetMovieCompanies } from "./hooks/useGetMovieCompanies/useGetMovieCompanies";
import { usePostReview } from "./hooks/usePostReview/usePostReview";

export const App = () => {
  // Data hooks
  const {
    movies,
    isLoading: isLoadingMovies,
    error: moviesError,
    refetchMovies,
  } = useGetMovies();

  const {
    movieCompanies,
    isLoading: isLoadingMovieCompanies,
    error: movieCompaniesError,
    refetchMovieCompanies,
  } = useGetMovieCompanies();

  const {
    isLoading: isSubmitReviewLoading,
    error: submitReviewError,
    postReview,
  } = usePostReview();

  const [selectedMovie, setSelectedMovie] = useState<Movie | undefined>();
  const [reviewResponse, setReviewResponse] = useState<string | undefined>();

  const handleRefreshClick = async () => {
    refetchMovies();
    refetchMovieCompanies();
  };

  const handleSubmitReview = async (review: number) => {
    const response = await postReview(review);

    if (!isSubmitReviewLoading || !submitReviewError) {
      response && setReviewResponse(response.message);
    }

    setTimeout(() => {
      setSelectedMovie(undefined);
      setReviewResponse(undefined);
    }, 2000);
  };

  return (
    <div>
      {(isLoadingMovies || isLoadingMovieCompanies) && <div>Loading...</div>}
      {(!!moviesError || !!movieCompaniesError) && <div>Movies Error</div>}
      {!(isLoadingMovies || isLoadingMovieCompanies) &&
        !(!!moviesError || !!movieCompaniesError) && (
          <>
            <h2>Welcome to Movie database!</h2>
            <button
              onClick={handleRefreshClick}
              disabled={isLoadingMovies || isLoadingMovieCompanies}
            >
              Refresh
            </button>
            <p>Total movies displayed {movies.length}</p>
            <span>Title - Review - Film Company</span>
            <br />
            {movies.map((movie: Movie) => (
              <span
                onClick={() => {
                  setSelectedMovie(movie);
                }}
                key={movie.id}
              >
                {movie.title}{" "}
                {movie.reviews
                  .reduce(
                    (acc: any, i: any) => (acc + i) / movie.reviews.length,
                    0
                  )
                  ?.toString()
                  .substring(0, 3)}{" "}
                {
                  movieCompanies.find(
                    (f: MovieCompany) => f.id === movie.filmCompanyId
                  )?.name
                }
                <br />
              </span>
            ))}
            <br />
            <div>
              {selectedMovie
                ? selectedMovie.title
                  ? "You have selected " + selectedMovie.title
                  : "No Movie Title"
                : "No Movie Selected"}
              {selectedMovie && <p>Please leave a review below</p>}
              {selectedMovie && (
                <>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmitReview(3);
                    }}
                  >
                    <label>
                      Review:
                      <input type="text" />
                    </label>
                  </form>
                  <div>{reviewResponse && reviewResponse}</div>
                </>
              )}
            </div>
          </>
        )}
    </div>
  );
};
