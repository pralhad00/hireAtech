"use client";

import Link from "next/link";
import { useEffect } from "react";

/*
 * Root error boundary (spec §10): never show stack traces or DB details to
 * the user. This version of the convention gives the boundary a `retry`
 * callback (the older `reset` was renamed) for a clean recovery path.
 */

export default function AppError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    // Server-side detail stays in the server logs; the page stays friendly.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        That didn’t work — it’s not your fault
      </h1>
      <p className="mt-3 max-w-prose text-muted-strong">
        A technical problem interrupted this page. Nothing was lost: you can
        try again right away, or go back to the home page and pick up from
        there.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 font-semibold text-white transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-ink bg-surface px-5 py-2.5 font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
