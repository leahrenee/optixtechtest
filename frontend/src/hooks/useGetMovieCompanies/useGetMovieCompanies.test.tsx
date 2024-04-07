import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { act, renderHook, waitFor } from "@testing-library/react";
import { getData } from "../../api";
import { useGetMovieCompanies } from "./useGetMovieCompanies";
import { mockMovieCompanyData } from "../../testData";

jest.mock("../../api");
const mockGetData = getData as jest.Mock;

describe("useGetMovieCompanies", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should return data on success", async () => {
    mockGetData.mockReturnValueOnce(Promise.resolve(mockMovieCompanyData));

    const { result } = renderHook(() => useGetMovieCompanies());

    await waitFor(() =>
      expect(result.current.movieCompanies).toEqual(mockMovieCompanyData)
    );
  });

  test("Should throw error", async () => {
    const mockError = new Error("Something went wrong");

    mockGetData.mockImplementationOnce(() => {
      throw mockError;
    });

    const { result } = renderHook(() => useGetMovieCompanies());

    await waitFor(() => expect(result.current.error).toEqual(mockError));
  });

  test("Should return true when loading", async () => {
    mockGetData.mockReturnValueOnce(Promise.resolve(mockMovieCompanyData));

    const { result } = renderHook(() => useGetMovieCompanies());

    expect(result.current.isLoading).toEqual(true);

    await waitFor(() => expect(result.current.isLoading).toEqual(false));
  });

  test("Should refetch data when 'refetchMovieCompanies' is called", async () => {
    mockGetData.mockReturnValue(Promise.resolve(mockMovieCompanyData));

    const { result } = renderHook(() => useGetMovieCompanies());

    expect(mockGetData).toHaveBeenCalledTimes(1);

    await act(() => result.current.refetchMovieCompanies());

    expect(mockGetData).toHaveBeenCalledTimes(2);
  });
});
