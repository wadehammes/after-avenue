import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { WebPage } from "schema-dts";
import { WorkEntryPage } from "src/components/WorkEntryPage/WorkEntryPage.component";
import type { Work } from "src/contentful/getWork";
import {
  fetchAllWork,
  fetchRandomWork,
  fetchWorkByCategory,
  fetchWorkBySlug,
} from "src/contentful/getWork";
import { outputSitemap } from "src/lib/generateSitemap";
import type { SitemapItem } from "src/lib/generateSitemap";
import {
  EXCLUDED_PAGE_SLUGS_FROM_BUILD,
  TEST_PAGE_SLUG,
} from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

interface WorkParams {
  slug: string;
}

interface WorkProps {
  params: WorkParams;
}

// Tell Next.js about all our work entries so
// they can be statically generated at build time.
export async function generateStaticParams(): Promise<WorkParams[]> {
  const workEntries = await fetchAllWork({ preview: false });

  if (workEntries) {
    // Generate Sitemap
    const routes: SitemapItem[] = workEntries
      .map((page: Work) => {
        if (page.workSlug.includes(TEST_PAGE_SLUG)) {
          return {
            route: "",
            modTime: "",
          };
        }

        return {
          route: `/work/${page.workSlug}`,
          modTime: page.updatedAt,
        };
      })
      .filter((item: SitemapItem) => item.route.length);

    outputSitemap(routes, "work");
  }

  return workEntries
    .filter((work) => !EXCLUDED_PAGE_SLUGS_FROM_BUILD.includes(work.workSlug))
    .map((work) => ({ slug: work.workSlug }));
}

// For each work entry, tell Next.js which metadata
// (e.g. work title) to display.
export async function generateMetadata({
  params,
}: WorkProps): Promise<Metadata> {
  const workEntry = await fetchWorkBySlug({
    slug: params.slug,
    preview: draftMode().isEnabled,
  });

  if (!workEntry) {
    return notFound();
  }

  return {
    metadataBase: new URL(`${envUrl()}/work/${workEntry.workSlug}`),
    alternates: {
      canonical: "/",
    },
    title: `${workEntry.workClient} - ${workEntry.workTitle} | After Avenue`,
    description: workEntry.workDescription
      ? documentToPlainTextString(workEntry.workDescription)
      : "",
    robots:
      process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
  };
}

// The actual WorkEntry component.
async function WorkEntry({ params }: WorkProps) {
  // Fetch a single work entry by slug,
  // using the content preview if draft mode is enabled:
  const workEntry = await fetchWorkBySlug({
    slug: params.slug,
    preview: draftMode().isEnabled,
  });

  if (!workEntry) {
    // If a work entry can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  const workSeries = await fetchWorkByCategory({
    category: workEntry.workSeriesCategory?.categoryName ?? "",
    preview: draftMode().isEnabled,
  });

  const workSeriesUnique = workSeries.filter((work) => {
    return workEntry.workSlug !== work.workSlug;
  });

  const randomRecentWork = await fetchRandomWork({
    preview: draftMode().isEnabled,
  });

  const randomRecentWorkUnique = randomRecentWork
    .filter((work) => workEntry.workSlug !== work.workSlug)
    .slice(0, 3);

  const { workClient, workTitle, workDescription, publishDate, updatedAt } =
    workEntry;

  const jsonLd: WebPage = {
    "@type": "WebPage",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 0,
          name: "Home",
        },
        {
          "@type": "ListItem",
          position: 1,
          name: "Work",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `${workClient} - ${workTitle}`,
        },
      ],
    },
    description: workDescription
      ? documentToPlainTextString(workDescription)
      : "",
    datePublished: publishDate,
    dateModified: updatedAt,
    name: `${workClient} - ${workTitle}`,
    publisher: {
      "@type": "Organization",
      name: "After Avenue",
    },
  };

  return (
    <Suspense>
      <script
        id="workEntrySchema"
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Next.js requires this
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorkEntryPage
        workEntry={workEntry}
        workSeries={workSeriesUnique}
        recentWork={randomRecentWorkUnique}
      />
    </Suspense>
  );
}

export default WorkEntry;
