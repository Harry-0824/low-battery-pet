import { describe, expect, it, vi } from "vitest";
import { registerServiceWorker } from "./registerServiceWorker";

describe("registerServiceWorker", () => {
  it("registers the app service worker after the window load event", () => {
    const register = vi.fn();
    const addEventListener = vi.fn((event: string, callback: EventListener) => {
      if (event === "load") {
        callback(new Event("load"));
      }
    });

    const fakeWindow = {
      addEventListener,
      navigator: {
        serviceWorker: {
          register
        }
      }
    } as unknown as Window;

    registerServiceWorker(fakeWindow);

    expect(addEventListener).toHaveBeenCalledWith("load", expect.any(Function));
    expect(register).toHaveBeenCalledWith("/sw.js");
  });

  it("does not register when service workers are unavailable", () => {
    const addEventListener = vi.fn();
    const fakeWindow = {
      addEventListener,
      navigator: {}
    } as unknown as Window;

    registerServiceWorker(fakeWindow);

    expect(addEventListener).not.toHaveBeenCalled();
  });
});
