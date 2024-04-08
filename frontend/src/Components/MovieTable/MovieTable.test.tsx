import MovieTable from "./MovieTable";
import {
  act,
  fireEvent,
  getByTestId,
  render,
  waitFor,
} from "@testing-library/react";
import { getData } from "../../api";
import { mockMovieCompanyData, mockMoviesData } from "../../testData";

jest.mock("../../api");
const mockGetData = getData as jest.Mock;

// Adding this promise to wait for the hardcoded 2 second loading delay
const wait = () => new Promise((resolve) => setTimeout(resolve, 2200));

describe("MovieTable", () => {
  beforeEach(() => {
    mockGetData.mockImplementation((path: string) => {
      if (path.includes("movies")) {
        return mockMoviesData;
      }

      if (path.includes("movieCompanies")) {
        return mockMovieCompanyData;
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should match default snapshot", async () => {
    const { asFragment } = render(<MovieTable />);

    await act(wait);

    expect(asFragment()).toMatchSnapshot();
  });

  test("Should match loading state", async () => {
    const { getByTestId } = render(<MovieTable />);

    expect(getByTestId("loading-spinner")).toBeVisible();
  });

  test("Should match error state", async () => {
    const mockError = new Error("Something went wrong");

    mockGetData.mockImplementation(({ path }) => {
      if (path.includes("movies")) {
        return mockMoviesData;
      }

      if (path.includes("movieCompanies")) {
        throw mockError;
      }
    });

    const { getByTestId } = render(<MovieTable />);

    await act(wait);

    expect(getByTestId("error-paper")).toBeVisible();
  });

  test("CLICK - Should refetch movies when clicking refresh icon", async () => {
    const { getByTestId } = render(<MovieTable />);

    await act(wait);

    const refreshButton = getByTestId("refresh-button");

    act(() => fireEvent.click(refreshButton));

    await act(wait);

    expect(mockGetData).toHaveBeenCalledTimes(4);
  });

  test("CLICK - Should sort row when clicking score header", async () => {
    const { getByTestId } = render(<MovieTable />);

    await act(wait);

    const sortScore = getByTestId("sort-movie-table");

    // Ascending order
    act(() => fireEvent.click(sortScore));
    expect(getByTestId("movie-0-score").innerHTML).toEqual("0.2");

    // Descending Order
    act(() => fireEvent.click(sortScore));
    expect(getByTestId("movie-0-score").innerHTML).toEqual("1.3");
  });
});
