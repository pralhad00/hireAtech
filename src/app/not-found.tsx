import Link from "next/link";
import { Button } from "@/components/ui/button";

/*
 * Friendly 404 (spec route table): links to Services and How it works.
 * No stack traces, no joke content — helpful next steps only.
 */

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        We couldn’t find that page
      </h1>
      <p className="mt-3 max-w-prose text-muted-strong">
        The address may have a typo, or the page may have moved. From here you
        can go straight back to what is most likely what you need:
      </p>
      <ul className="mt-8 flex flex-col gap-3 sm:flex-row">
        <li>
          <Button
            render={<Link href="/services" />}
            nativeButton={false}
            className="justify-center"
          >
            Browse services
          </Button>
        </li>
        <li>
          <Button
            variant="outline"
            render={<Link href="/how-it-works" />}
            nativeButton={false}
            className="justify-center"
          >
            How it works
          </Button>
        </li>
      </ul>
      <p className="mt-8 text-sm text-muted-strong">
        Or{" "}
        <Link
          href="/"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          go back to the home page
        </Link>
        .
      </p>
    </div>
  );
}
