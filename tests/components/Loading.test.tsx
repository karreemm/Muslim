import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Loading from "@/components/general/Loading";

describe("Loading", () => {
  it("renders an accessible status region", () => {
    render(<Loading />);

    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("aria-label", "Loading");
    expect(status).toHaveAttribute("aria-live", "polite");
  });
});
