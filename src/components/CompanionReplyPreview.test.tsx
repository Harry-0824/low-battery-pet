import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { CompanionReply } from "../features/reply/replyTypes";
import CompanionReplyPreview from "./CompanionReplyPreview";

const createReply = (tinyAction = "喝一口水，讓自己慢慢回來。"): CompanionReply => ({
  reply: "今天先不用很厲害，慢慢靠近就好。",
  petLine: "小電量獸在旁邊點點頭。",
  tinyAction,
  tone: "calm"
});

afterEach(() => {
  cleanup();
});

describe("CompanionReplyPreview", () => {
  it("marks the tiny action as gently charged after one click", () => {
    render(<CompanionReplyPreview reply={createReply()} />);

    const actionButton = screen.getByRole("button", { name: "我做了！" });

    fireEvent.click(actionButton);

    expect(
      (screen.getByRole("button", { name: "充了一小格電 ⚡" }) as HTMLButtonElement).disabled
    ).toBe(true);
    expect(screen.getByTestId("tiny-action-burst").textContent).toContain("♡");
    expect(screen.getByTestId("tiny-action-burst").textContent).toContain("＋");
    expect(screen.getByTestId("tiny-action-burst").textContent).toContain("✦");
  });

  it("resets the tiny action button when a new reply is rendered", () => {
    const { rerender } = render(<CompanionReplyPreview reply={createReply("站起來伸展一下。")} />);

    fireEvent.click(screen.getByRole("button", { name: "我做了！" }));
    expect(
      (screen.getByRole("button", { name: "充了一小格電 ⚡" }) as HTMLButtonElement).disabled
    ).toBe(true);

    rerender(<CompanionReplyPreview reply={createReply("把手機翻面一分鐘。")} />);

    expect((screen.getByRole("button", { name: "我做了！" }) as HTMLButtonElement).disabled).toBe(
      false
    );
  });
});
