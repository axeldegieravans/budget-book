"use client";

import { render } from "@testing-library/react";

import { useScrollToElement } from "@/hooks/use-scroll-to-element";

function ScrollHarness({
  isActive,
  offset = 128,
}: {
  isActive: boolean;
  offset?: number;
}) {
  const targetRef = {
    current: {
      getBoundingClientRect: () => ({
        top: 300,
      }),
    },
  } as React.RefObject<HTMLDivElement | null>;

  useScrollToElement(targetRef, isActive, offset);

  return null;
}

describe("useScrollToElement", () => {
  const scrollTo = jest.fn();

  beforeEach(() => {
    scrollTo.mockReset();
    Object.defineProperty(window, "scrollTo", {
      value: scrollTo,
      writable: true,
    });
    Object.defineProperty(window, "scrollY", {
      value: 50,
      writable: true,
    });
  });

  it("scrollt naar het doel wanneer actief", () => {
    render(<ScrollHarness isActive offset={100} />);

    expect(scrollTo).toHaveBeenCalledWith({ top: 250, behavior: "smooth" });
  });

  it("doet niets wanneer niet actief", () => {
    render(<ScrollHarness isActive={false} />);

    expect(scrollTo).not.toHaveBeenCalled();
  });
});
