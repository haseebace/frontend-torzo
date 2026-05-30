import type { Metadata } from "next";
import { AnimationsDemo } from "./_components/animations-demo";

export const metadata: Metadata = {
  title: "Animation System",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnimationsPage() {
  return <AnimationsDemo />;
}
