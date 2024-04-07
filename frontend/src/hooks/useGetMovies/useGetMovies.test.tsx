import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { act, renderHook, waitFor } from "@testing-library/react";
import { getData } from "../../api";
import { useGetMovies } from "./useGetMovies";
import { mockMoviesData } from "../../testData";

jest.mock("../../api");
const mockGetData = getData as jest.Mock;

describe("useGetMovies", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should return data on success", async () => {
    mockGetData.mockReturnValueOnce(Promise.resolve(mockMoviesData));

    const { result } = renderHook(() => useGetMovies());

    await waitFor(() => expect(result.current.movies).toEqual(mockMoviesData));
  });

  test("Should throw error", async () => {
    const mockError = new Error("Something went wrong");

    mockGetData.mockImplementationOnce(() => {
      throw mockError;
    });

    const { result } = renderHook(() => useGetMovies());

    await waitFor(() => expect(result.current.error).toEqual(mockError));
  });

  test("Should return true when loading", async () => {
    mockGetData.mockReturnValueOnce(Promise.resolve(mockMoviesData));

    const { result } = renderHook(() => useGetMovies());

    expect(result.current.isLoading).toEqual(true);

    await waitFor(() => expect(result.current.isLoading).toEqual(false));
  });

  test("Should refetch movies when 'refetchMovies' is called", async () => {
    mockGetData.mockReturnValue(Promise.resolve(mockMoviesData));

    const { result } = renderHook(() => useGetMovies());

    expect(mockGetData).toHaveBeenCalledTimes(1);

    await act(() => result.current.refetchMovies());

    expect(mockGetData).toHaveBeenCalledTimes(2);
  });
});
