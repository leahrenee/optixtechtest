import {
  Button,
  Container,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { usePostReview } from "../../hooks/usePostReview/usePostReview";
import { useState } from "react";
import { Movie } from "../../types";

interface Props {
  selectedMovie: Movie;
  setSelectedMovie: React.Dispatch<React.SetStateAction<Movie | undefined>>;
  handleFormSubmission: React.Dispatch<React.SetStateAction<string>>;
}

const classes = {
  form: "review-form",
};

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: 20,

  [`& .${classes.form}`]: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 24,

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  },
}));

const ReviewForm = ({
  selectedMovie,
  setSelectedMovie,
  handleFormSubmission,
}: Props) => {
  const [reviewResponse, setReviewResponse] = useState<string>();

  // Post Hook
  const {
    isLoading: isSubmitReviewLoading,
    error: submitReviewError,
    postReview,
  } = usePostReview();

  const validationSchema = yup.object({
    review: yup
      .string()
      .required("Review is required to submit")
      .max(100, "Review must be less than 100 characters"),
  });

  const formik = useFormik({
    initialValues: {
      review: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (value) => {
      const response = await postReview(value.review);

      if ((!isSubmitReviewLoading || !submitReviewError) && response) {
        setReviewResponse(response.message);
        handleFormSubmission(response.message);
      }

      setTimeout(() => {
        setSelectedMovie(undefined);
        setReviewResponse(undefined);
        handleFormSubmission("");
      }, 2000);
    },
  });

  return (
    <StyledContainer>
      <Typography style={{ marginBottom: "4px" }}>
        Please Enter Review for{" "}
        <span style={{ fontWeight: "bold", fontStyle: "italic" }}>
          {selectedMovie.title}
        </span>
      </Typography>
      <form
        onSubmit={formik.handleSubmit}
        className={classes.form}
        data-testid="review-form"
      >
        <TextField
          fullWidth
          variant="standard"
          id="review"
          name="review"
          label="Movie Review"
          value={formik.values.review}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.review && Boolean(formik.errors.review)}
          helperText={formik.touched.review && formik.errors.review}
          disabled={!!reviewResponse}
        />
        <Button
          color="primary"
          variant="contained"
          type="submit"
          data-testid="submit-button"
          disabled={!!reviewResponse || !formik.isValid}
        >
          Submit
        </Button>
      </form>
    </StyledContainer>
  );
};

export default ReviewForm;
