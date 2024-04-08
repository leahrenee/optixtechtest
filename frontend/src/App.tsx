import MovieTable from "./Components/MovieTable/MovieTable";
import { Container, Typography, styled } from "@mui/material";
import LocalMoviesTwoToneIcon from "@mui/icons-material/LocalMoviesTwoTone";

const classes = {
  title: "App-title",
  flexCenter: "App-flex-center",
};

const StyledContainer = styled(Container)(() => ({
  padding: 40,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  [`& .${classes.title}`]: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: "12px 0px",
  },
}));

export const App = () => {
  return (
    <StyledContainer>
      <div className={classes.title}>
        <LocalMoviesTwoToneIcon color="primary" fontSize="medium" />
        <Typography variant="h5">Welcome to Movie database!</Typography>
      </div>
      <MovieTable />
    </StyledContainer>
  );
};
