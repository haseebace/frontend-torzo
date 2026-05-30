import type { Metadata } from "next";
import { FeedbackCard } from "./_components/feedback-card";

export const metadata: Metadata = {
  title: "Animation System",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnimationsPage() {
  return <FeedbackCard />;
}
