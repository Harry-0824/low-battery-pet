import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(() => {
  cleanup();
});

describe("App", () => {
  it("renders mood options", () => {
    render(<App />);

    expect(screen.getByText("Low Battery Pet")).toBeTruthy();
    expect(screen.getByRole("button", { name: "還行" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "快沒電" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "很煩" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "有點孤單" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "不想思考" })).toBeTruthy();
  });

  it("lets the user select one mood option", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "快沒電" }));

    expect(screen.getByRole("button", { name: "快沒電" }).getAttribute("aria-pressed")).toBe(
      "true"
    );
    expect(screen.getByRole("button", { name: "還行" }).getAttribute("aria-pressed")).toBe(
      "false"
    );
  });

  it("lets the user toggle a context tag", () => {
    render(<App />);

    const walletButton = screen.getByRole("button", { name: "錢包危險" });
    fireEvent.click(walletButton);

    expect(walletButton.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(walletButton);

    expect(walletButton.getAttribute("aria-pressed")).toBe("false");
  });

  it("submits the check-in and displays derived user and pet state previews", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "快沒電" }));
    fireEvent.click(screen.getByRole("button", { name: "錢包危險" }));
    fireEvent.click(screen.getByRole("button", { name: "Preview state" }));

    expect(screen.getByText("Selected mood: low_battery")).toBeTruthy();
    expect(screen.getByText("Selected contexts: wallet_pressure")).toBeTruthy();
    expect(screen.getByText("energyLevel: critical")).toBeTruthy();
    expect(screen.getByText("hasWalletPressure: true")).toBeTruthy();
    expect(screen.getByText("mood: low_power")).toBeTruthy();
    expect(screen.getByText("effect: low_battery")).toBeTruthy();
  });

  it("accepts optional text and displays a companion reply preview", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Optional check-in note"), {
      target: { value: "Need a small plan" }
    });
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[3]);
    fireEvent.click(buttons[9]);
    fireEvent.click(screen.getByRole("button", { name: "Preview state" }));

    expect(screen.getByText("Tone: warm")).toBeTruthy();
    expect(screen.getByText("Pet line: I will keep the little light on beside you.")).toBeTruthy();
    expect(
      screen.getByText(
        "Tiny action: Set a 10 minute no-output rest block and put the phone face down."
      )
    ).toBeTruthy();
    expect(screen.getByText("Note: Need a small plan")).toBeTruthy();
  });
});
