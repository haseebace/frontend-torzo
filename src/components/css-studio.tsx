"use client";

import { startStudio } from "cssstudio";
import { useEffect } from "react";

export function CssStudio() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const timer = setTimeout(() => {
        startStudio();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
