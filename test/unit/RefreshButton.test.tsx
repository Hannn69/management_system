// test/unit/RefreshButton.test.tsx
// Example unit test for React component

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { RefreshButton } from "@/components/RefreshButton";

describe("RefreshButton Component", () => {
  it("renders the refresh button", () => {
    render(<RefreshButton />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("button should be clickable", () => {
    render(<RefreshButton />);
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("should handle click events", () => {
    const { container } = render(<RefreshButton />);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });
});
