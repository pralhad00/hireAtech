import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IconSquare } from "@/components/ui/icon-square";
import { getCategoryBySlug } from "@/lib/queries/categories";

/*
 * /services/[slug] — one category, empty-ready (plan step 3). Real category
 * data from the database; the approved-technician list is a real count plus
 * an honest empty state until Steps 8–9 build search and profiles. An
 * unknown slug gets the friendly 404 via notFound().
 */

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Service not found" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-strong sm:text-base">
        <Link
          href="/services"
          className="font-medium text-muted-strong underline-offset-4 hover:text-primary hover:underline"
        >
          Services
        </Link>
        <span aria-hidden={true}> / </span>
        <span aria-current="page" className="font-medium text-ink">
          {category.name}
        </span>
      </nav>

      <div className="mt-8 flex items-start gap-4">
        <IconSquare icon={category.icon} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="border-b border-dotted border-border block font-display text-3xl font-bold text-ink leading-none mb-1 sm:text-4xl">
            {category.name}
          </div>
          <p className="font-mono text-sm text-muted-strong sm:text-base">
            {category.tagline}
          </p>
        </div>
      </div>

      <p className="mt-6 max-w-prose text-muted-strong sm:text-base">
        {category.description}
      </p>

      <section
        aria-labelledby="technicians-heading"
        className="mt-10 rounded-md border border-border bg-surface"
      >
        <div className="border-b border-dotted border-border px-5 py-4 sm:px-6 sm:py-5">
          <h2
            id="technicians-heading"
            className="font-display text-lg font-semibold text-ink sm:text-xl"
          >
            Approved technicians
          </h2>
          <p className="mt-1 text-sm text-muted-strong sm:text-base">
            {category.approvedTechnicianCount === 0
              ? "None in this category yet — updates as technicians are approved."
              : `${category.approvedTechnicianCount} available.`}
          </p>
        </div>
        <div className="px-5 py-6 text-sm text-muted-strong sm:px-6 sm:text-base">
          {category.approvedTechnicianCount === 0 ? (
            <p>
              No approved technicians in this category yet. New technicians
              appear here{" "}
              <strong className="font-semibold text-ink">
                only after admin approval
              </strong>
              , so what you see is always current — check back soon, or try
              another{" "}
              <Link
                href="/services"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                service category
              </Link>{" "}
              .
            </p>
          ) : (
            // Real list arrives with technician search (Step 8).
            <p>Technician list coming soon.</p>
          )}
        </div>
      </section>
    </div>
  );
}
