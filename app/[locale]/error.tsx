"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <h2 className="text-3xl font-fraunces mb-4 text-brand">
        Something went wrong!
      </h2>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-charcoal text-ivory rounded-md"
      >
        Try again
      </button>
    </div>
  );
}
