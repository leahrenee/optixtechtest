import {
  Alert,
  AlertTitle,
  Button,
  Paper,
  Snackbar,
  Typography,
  styled,
} from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { useState } from "react";

interface Props {
  movieCompaniesError: Error | null;
  moviesError: Error | null;
  handleRefreshClick: () => void;
  errorShown: boolean;
}

const StyledPaper = styled(Paper)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: 20,
}));

const ErrorScreen = ({
  movieCompaniesError,
  moviesError,
  handleRefreshClick,
  errorShown,
}: Props) => {
  const [showMoviesAlert, setShowMoviesAlert] = useState(errorShown);
  const [showMovieCompaniesAlert, setShowMovieCompaniesAlert] =
    useState(errorShown);

  return (
    <StyledPaper data-testid="error-paper">
      <Typography mb={2}>Oops! Something went wrong.</Typography>
      <SentimentVeryDissatisfiedIcon fontSize="large" color="primary" />
      <Button
        onClick={handleRefreshClick}
        color="primary"
        variant="contained"
        sx={{ mt: 2 }}
        data-testid="retry-button"
      >
        Retry?
      </Button>
      {moviesError && (
        <Snackbar
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          open={showMovieCompaniesAlert && !!moviesError}
          data-testid="movie-companies-alert"
        >
          <Alert
            severity="error"
            onClose={() => setShowMovieCompaniesAlert(false)}
          >
            <AlertTitle>Movies Error</AlertTitle>
            <Typography>{moviesError.message}</Typography>
          </Alert>
        </Snackbar>
      )}
      {movieCompaniesError && (
        <Snackbar
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          open={showMoviesAlert && !!movieCompaniesError}
          data-testid="movies-alert"
        >
          <Alert severity="error" onClose={() => setShowMoviesAlert(false)}>
            <AlertTitle>Movies Company Error</AlertTitle>
            <Typography>{movieCompaniesError.message}</Typography>
          </Alert>
        </Snackbar>
      )}
    </StyledPaper>
  );
};

export default ErrorScreen;
