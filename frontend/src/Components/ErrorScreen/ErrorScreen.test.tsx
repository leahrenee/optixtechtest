import { describe, test } from "@jest/globals";
import ErrorScreen from "./ErrorScreen";
import { act, fireEvent, render } from "@testing-library/react";

const mockHandleRefreshClick = jest.fn();

const component = (
  <ErrorScreen
    movieCompaniesError={new Error("Movie Companies Error")}
    moviesError={new Error("Movies Error")}
    handleRefreshClick={mockHandleRefreshClick}
    errorShown={true}
  />
);

describe("ErrorScreen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should match default snapshot", async () => {
    const { asFragment } = render(component);

    expect(asFragment).toMatchSnapshot();
  });

  test("Should show correct alert for movie GET error", async () => {
    const { getByTestId } = render(component);

    const moviesAlert = getByTestId("movies-alert");

    expect(moviesAlert).toBeVisible();
  });

  test("Should show correct alert for movie companies GET error", async () => {
    const { getByTestId } = render(component);

    const moviesAlert = getByTestId("movie-companies-alert");

    expect(moviesAlert).toBeVisible();
  });

  test("CLICK - Should call refetch for movies and movie companies when pressing retry", async () => {
    const { getByTestId } = render(component);

    const retryButton = getByTestId("retry-button");

    fireEvent.click(retryButton);

    expect(mockHandleRefreshClick).toHaveBeenCalledTimes(1);
  });
});
