"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

/**
 * A fixed-position button that triggers the browser's back navigation.
 */
export default function GoBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="bg-background border-border text-foreground hover:bg-muted fixed top-4 right-4 z-100 flex h-10 w-10 items-center justify-center rounded-full border shadow-md transition-colors"
      title="Go Back"
    >
      <FaArrowLeft className="h-5 w-5" />
    </button>
  );
}
