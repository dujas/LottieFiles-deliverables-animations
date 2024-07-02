import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AnimationList from ".";

describe("template list", () => {
  it("should render template list", async () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <AnimationList />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(getByTestId("animations_list")).toBeInTheDocument(),
    );
  });
});
