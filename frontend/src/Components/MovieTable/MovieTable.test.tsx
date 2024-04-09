import MovieTable from "./MovieTable";
import { act, fireEvent, render } from "@testing-library/react";
import { getData } from "../../api";
import { mockMovieCompanyData, mockMoviesData } from "../../testData";

jest.mock("../../api");
const mockGetData = getData as jest.Mock;

// Adding this promise to wait for the 2 second loading delay
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

  test("Should show loading spinner when loading", async () => {
    const { queryByTestId } = render(<MovieTable />);

    expect(queryByTestId("loading-spinner")).toBeInTheDocument();

    await act(wait);

    expect(queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });

  test("Should show error screen when error", async () => {
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
