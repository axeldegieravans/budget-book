"use client";

import { useEffect, type RefObject } from "react";

const DEFAULT_SCROLL_OFFSET = 128;

export function useScrollToElement<T extends HTMLElement>(
  targetRef: RefObject<T | null>,
  isActive: boolean,
  offset = DEFAULT_SCROLL_OFFSET,
) {
  useEffect(() => {
    if (!isActive || !targetRef.current) {
      return;
    }

    const top = targetRef.current.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }, [isActive, offset, targetRef]);
}
