import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { useGetMovies } from "../../hooks/useGetMovies/useGetMovies";
import { useGetMovieCompanies } from "../../hooks/useGetMovieCompanies/useGetMovieCompanies";
import { Movie, MovieCompany } from "../../types";
import RefreshIcon from "@mui/icons-material/Refresh";
import ReviewForm from "../ReviewForm/ReviewForm";
import ErrorScreen from "../ErrorScreen/ErrorScreen";

const classes = {
  tableContainer: "movie-table-container",
  tableToolbar: "movie-table-header",
  tableColumnsHead: "movie-table-columns-head",
};

type SortType = "desc" | "asc" | undefined;

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  bgcolor: "white",
  borderRadius: "5px",
  boxShadow: 24,
  padding: "20px 0px",
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  [`& .${classes.tableContainer}`]: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  [`& .${classes.tableToolbar}`]: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "2px 12px",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },

  [`& .${classes.tableColumnsHead}`]: {
    fontWeight: "bold",
  },
}));

const MovieTable = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [tableSort, setTableSort] = useState<SortType>("desc");
  const [formResponseAlert, setFormResponseAlert] = useState("");

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const showError = !!moviesError || !!movieCompaniesError;

  const isLoading = isLoadingMovies || isLoadingMovieCompanies;

  const showModal = selectedMovie && mobile;

  const handleRefreshClick = () => {
    setSelectedMovie(null);
    refetchMovies();
    refetchMovieCompanies();
  };

  const getMovieScore = (movie: Movie) => {
    return (
      movie.reviews.reduce((acc: any, i: any) => acc + i, 0) /
      movie.reviews.length
    );
  };

  const handleSortOnClick = () => {
    tableSort === "asc" ? setTableSort("desc") : setTableSort("asc");
  };

  tableSort === "asc"
    ? movies.sort((a, b) => getMovieScore(a) - getMovieScore(b))
    : movies.sort((a, b) => getMovieScore(b) - getMovieScore(a));

  return (
    <>
      {isLoading && !showError ? (
        <Box padding="40px" data-testid="loading-spinner">
          <CircularProgress size={60} />
        </Box>
      ) : (
        <StyledPaper>
          {showError ? (
            <ErrorScreen
              movieCompaniesError={movieCompaniesError}
              moviesError={moviesError}
              handleRefreshClick={handleRefreshClick}
              errorShown={showError}
            />
          ) : (
            <>
              <Box className={classes.tableToolbar}>
                {movies.length > 1 ? (
                  <Typography>Found {movies.length} Movies</Typography>
                ) : (
                  <Typography>No Movies!</Typography>
                )}
                <IconButton
                  onClick={handleRefreshClick}
                  disabled={isLoading}
                  color="primary"
                  data-testid="refresh-button"
                >
                  <RefreshIcon />
                </IconButton>
              </Box>
              <TableContainer className={classes.tableContainer}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableColumnsHead}>
                        Title
                      </TableCell>
                      <TableCell className={classes.tableColumnsHead}>
                        <TableSortLabel
                          active
                          direction={tableSort}
                          onClick={handleSortOnClick}
                          data-testid="sort-movie-table"
                        >
                          Review Score
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className={classes.tableColumnsHead}>
                        Film Company
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {movies.map((movie: Movie, index: number) => {
                      return (
                        <TableRow
                          hover
                          key={movie.id}
                          onClick={() => {
                            setSelectedMovie(movie);
                          }}
                          selected={selectedMovie?.id === movie.id}
                          sx={{ cursor: "pointer" }}
                          data-testid={`movie-${index}-row`}
                        >
                          <TableCell>{movie.title}</TableCell>
                          <TableCell data-testid={`movie-${index}-score`}>
                            {getMovieScore(movie).toFixed(1)}
                          </TableCell>
                          <TableCell>
                            {
                              movieCompanies.find(
                                (company: MovieCompany) =>
                                  company.id === movie.filmCompanyId
                              )?.name
                            }
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              {selectedMovie && (
                <>
                  {!mobile ? (
                    <ReviewForm
                      selectedMovie={selectedMovie}
                      setSelectedMovie={setSelectedMovie}
                      handleFormSubmission={setFormResponseAlert}
                    />
                  ) : (
                    <Modal
                      open={!!showModal}
                      onClose={() => setSelectedMovie(null)}
                    >
                      <Box sx={modalStyle}>
                        <ReviewForm
                          selectedMovie={selectedMovie}
                          setSelectedMovie={setSelectedMovie}
                          handleFormSubmission={setFormResponseAlert}
                        />
                      </Box>
                    </Modal>
                  )}
                </>
              )}
            </>
          )}
          <Snackbar
            anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
            open={!!formResponseAlert}
            autoHideDuration={2000}
          >
            <Alert severity="success" variant="filled">
              {formResponseAlert}
            </Alert>
          </Snackbar>
        </StyledPaper>
      )}
    </>
  );
};

export default MovieTable;
