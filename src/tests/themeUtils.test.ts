import { describe, it, expect, vi, beforeEach } from "vitest";
import { initTheme, getCurrentTheme } from "@utils/themeUtils";

// Mock DOM elements
const mockThemeToggle = {
  querySelector: vi.fn(),
  addEventListener: vi.fn(),
} as any;

const mockHtmlElement = {
  setAttribute: vi.fn(),
} as any;

describe("themeUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock document methods
    vi.stubGlobal("document", {
      documentElement: mockHtmlElement,
      getElementById: vi.fn().mockReturnValue(mockThemeToggle),
    });

    // Mock icons
    mockThemeToggle.querySelector.mockImplementation((selector: string) => {
      if (selector === ".sun-icon" || selector === ".moon-icon") {
        return {
          classList: {
            add: vi.fn(),
            remove: vi.fn(),
          },
        };
      }
      return null;
    });
  });

  it("should initialize theme with default light theme", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: false,
    } as any);

    initTheme();

    expect(mockHtmlElement.setAttribute).toHaveBeenCalledWith(
      "data-color-scheme",
      "light",
    );
    expect(getCurrentTheme()).toBe("light");
  });

  it("should use saved theme from localStorage", () => {
    vi.mocked(localStorage.getItem).mockReturnValue("dark");

    initTheme();

    expect(mockHtmlElement.setAttribute).toHaveBeenCalledWith(
      "data-color-scheme",
      "dark",
    );
    expect(getCurrentTheme()).toBe("dark");
  });

  it("should use system preference when no saved theme", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
    } as any);

    initTheme();

    expect(mockHtmlElement.setAttribute).toHaveBeenCalledWith(
      "data-color-scheme",
      "dark",
    );
    expect(getCurrentTheme()).toBe("dark");
  });

  it("should handle missing theme toggle gracefully", () => {
    vi.mocked(document.getElementById).mockReturnValue(null);

    expect(() => initTheme()).not.toThrow();
  });
});
