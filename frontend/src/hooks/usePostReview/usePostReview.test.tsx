import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { postData } from "../../api";
import { mockPostReviewResponse } from "../../testData";
import { usePostReview } from "./usePostReview";
import { act, renderHook, waitFor } from "@testing-library/react";

jest.mock("../../api");
const mockPostData = postData as jest.Mock;

describe("usePostReview", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should return message on success", async () => {
    mockPostData.mockReturnValueOnce(Promise.resolve(mockPostReviewResponse));

    const { result } = renderHook(() => usePostReview());

    const response = await act(() =>
      result.current.postReview(
        "A wonderful test movie, passed every requirement!"
      )
    );

    await waitFor(() => expect(response?.message).toEqual("Success!"));
  });

  test("Should throw error", async () => {
    const mockError = new Error("Something went wrong");

    mockPostData.mockImplementationOnce(() => {
      throw mockError;
    });

    const { result } = renderHook(() => usePostReview());

    await act(() =>
      result.current.postReview(
        "A wonderful test movie, passed every requirement!"
      )
    );

    await waitFor(() => expect(result.current.error).toEqual(mockError));
  });

  test("Should return true when loading", async () => {
    mockPostData.mockReturnValueOnce(Promise.resolve(mockPostReviewResponse));

    const { result } = renderHook(() => usePostReview());

    act(() => {
      result.current.postReview(
        "A wonderful test movie, passed every requirement!"
      );
    });

    expect(result.current.isLoading).toEqual(true);

    await waitFor(() => expect(result.current.isLoading).toEqual(false));
  });
});
