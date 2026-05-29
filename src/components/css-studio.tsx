"use client";

import { startStudio } from "cssstudio";
import { useEffect } from "react";

export function CssStudio() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      startStudio();
    }
  }, []);

  return null;
}
