import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IconButton } from "@/components/ui/IconButton";

describe("IconButton", () => {
  it("exposes an accessible label", () => {
    render(
      <IconButton label="Delete ayah">
        <span aria-hidden="true">x</span>
      </IconButton>,
    );

    const button = screen.getByRole("button", { name: "Delete ayah" });
    expect(button).toHaveAttribute("title", "Delete ayah");
  });
});
