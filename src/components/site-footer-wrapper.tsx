"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";

export function SiteFooterWithAnimation() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <div className={isHomepage ? "origin-center animate-homepage-enter" : ""}>
      <SiteFooter />
    </div>
  );
}
