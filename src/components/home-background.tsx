"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import homeBackground from "@/app/homebg.jpg";

export function HomeBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="pointer-events-none absolute inset-0 z-0 hidden select-none md:block"
    >
      <Image
        src={homeBackground}
        alt=""
        fill
        priority
        sizes="(min-width: 768px) 100vw, 0px"
        className="object-cover"
      />
    </motion.div>
  );
}
