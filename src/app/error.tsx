"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
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
        <Button type="button" onClick={() => retry()}>
          Try again
        </Button>
        <Button variant="outline" render={<Link href="/" />} nativeButton={false}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
