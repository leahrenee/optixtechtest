import { describe, test } from "@jest/globals";
import { fireEvent, render, waitFor } from "@testing-library/react";
import ReviewForm from "./ReviewForm";
import {
  mockMoviesData,
  mockPostReviewRequest,
  mockPostReviewResponse,
} from "../../testData";
import { postData } from "../../api";

jest.mock("../../api");
const mockPostData = postData as jest.Mock;

const component = (
  <ReviewForm
    selectedMovie={mockMoviesData[0]}
    setSelectedMovie={jest.fn()}
    handleFormSubmission={jest.fn()}
  />
);

describe("ReviewForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should match default snapshot", async () => {
    const { asFragment } = render(component);

    expect(asFragment()).toMatchSnapshot();
  });

  test("Should submit form with correct review", async () => {
    mockPostData.mockReturnValueOnce(Promise.resolve(mockPostReviewResponse));

    const { getByTestId, getByLabelText } = render(component);

    const reviewInput = getByLabelText("Movie Review");
    const submitButton = getByTestId("submit-button");

    fireEvent.change(reviewInput, {
      target: { value: mockPostReviewRequest.review },
    });

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockPostData).toHaveBeenCalledWith("submitReview", {
        review: mockPostReviewRequest.review,
      })
    );
  });
});
