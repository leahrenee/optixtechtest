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
  tableHeader: "movie-table-header",
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

  [`& .${classes.tableHeader}`]: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "2px 12px",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const MovieTable = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | undefined>();
  const [errorShown, setErrorShown] = useState(false);
  const [loadingShown, setloadingShown] = useState(false);
  const [tableSort, setTableSort] = useState<SortType>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [formResponseAlert, setFormResponseAlert] = useState("");

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("sm"));
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

  useEffect(() => {
    if (movieCompaniesError || moviesError) {
      setErrorShown(true);
    }
  }, [movieCompaniesError, moviesError]);

  useEffect(() => {
    if (isLoadingMovies || isLoadingMovieCompanies) {
      setloadingShown(true);
    } else {
      setloadingShown(false);
    }
  }, [isLoadingMovies, isLoadingMovieCompanies]);

  useEffect(() => {
    if (selectedMovie && mobile) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [mobile, desktop, selectedMovie]);

  const handleRefreshClick = async () => {
    setSelectedMovie(undefined);
    setErrorShown(false);
    refetchMovies();
    refetchMovieCompanies();
  };

  const getMovieScore = (movie: Movie) => {
    return movie.reviews.reduce(
      (acc: any, i: any) => (acc + i) / movie.reviews.length,
      0
    );
  };

  const handleSort = () => {
    if (tableSort === "asc" || tableSort === undefined) {
      setTableSort("desc");
      movies.sort((a, b) => getMovieScore(a) - getMovieScore(b));
    } else if (tableSort === "desc") {
      setTableSort("asc");
      movies.sort((a, b) => getMovieScore(b) - getMovieScore(a));
    }
  };

  return (
    <>
      {loadingShown && !errorShown ? (
        <Box padding="40px" data-testid="loading-spinner">
          <CircularProgress size={60} />
        </Box>
      ) : (
        <StyledPaper>
          {errorShown ? (
            <ErrorScreen
              movieCompaniesError={movieCompaniesError}
              moviesError={moviesError}
              handleRefreshClick={handleRefreshClick}
              errorShown={errorShown}
            />
          ) : (
            <>
              <Box className={classes.tableHeader}>
                {movies.length > 1 ? (
                  <Typography>Found {movies.length} Movies</Typography>
                ) : (
                  <Typography>No Movies!</Typography>
                )}
                <IconButton
                  onClick={handleRefreshClick}
                  disabled={isLoadingMovies || isLoadingMovieCompanies}
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
                      <TableCell>Title</TableCell>
                      <TableCell>
                        <TableSortLabel
                          direction={tableSort}
                          onClick={handleSort}
                          data-testid="sort-movie-table"
                        >
                          Review Score
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Film Company</TableCell>
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
                            mobile && setModalOpen(true);
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
                  {desktop ? (
                    <ReviewForm
                      selectedMovie={selectedMovie}
                      setSelectedMovie={setSelectedMovie}
                      handleFormSubmission={setFormResponseAlert}
                    />
                  ) : (
                    <Modal
                      open={modalOpen}
                      onClose={() => {
                        setModalOpen(!modalOpen);
                        setSelectedMovie(undefined);
                      }}
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
