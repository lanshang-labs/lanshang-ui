import { vi } from "vitest";
// jsdom does not implement pseudo-element styles; rc-table only needs the base
// element's computed style to measure its scrollbar in component tests.
const getComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = ((element: Element) => getComputedStyle(element)) as typeof window.getComputedStyle;
Object.defineProperty(window, "matchMedia", {
  value: vi
    .fn()
    .mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
});

globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
