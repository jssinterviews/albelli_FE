import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "../index";

test("should render a button type=button by default", () => {
  render(<Button />);
  const button = screen.getByRole("button");
  expect(button).toHaveAttribute("type", "button");
});

test("should render a disabled button when attribute loading=true", () => {
  render(<Button loading />);
  const button = screen.getByRole("button");
  expect(button).toBeDisabled();
});
