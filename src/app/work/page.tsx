import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import Script from "next/script";
import { WebPage } from "schema-dts";
import { WorkPage } from "src/components/WorkPage/WorkPage.component";
import { fetchPage } from "src/contentful/getPages";
import { fetchAllWork } from "src/contentful/getWork";
import { fetchAllWorkCategories } from "src/contentful/getWorkCategories";
import { WORK_SLUG } from "src/utils/constants";
import { convertBooleanToNumber, envUrl } from "src/utils/helpers";

// Fetch the work page, tell Next.js which metadata
// (e.g. page title) to display.
export async function generateMetadata(): Promise<Metadata> {
  const workPage = await fetchPage({
    slug: WORK_SLUG,
    preview: draftMode().isEnabled,
  });

  if (!workPage) {
    return notFound();
  }

  return {
    metadataBase: new URL(`${envUrl()}/work`),
    alternates: {
      canonical: "/",
    },
    title: `${workPage.pageTitle} | After Avenue`,
    robots:
      process.env.ENVIRONMENT === "production"
        ? workPage?.enableIndexing
          ? "index, follow"
          : "noindex, nofollow"
        : "noindex, nofollow",
  };
}

// The actual Work component.
async function Work() {
  // Fetch the work page entry by slug,
  // using the content preview if draft mode is enabled:
  const workPage = await fetchPage({
    slug: WORK_SLUG,
    preview: draftMode().isEnabled,
  });

  const allWorkCategories = await fetchAllWorkCategories({
    preview: draftMode().isEnabled,
  });

  // Fetch all work entries
  const allWork = await fetchAllWork({ preview: draftMode().isEnabled });

  if (!workPage || !allWork) {
    // If a work entry can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  const allWorkSortedFeaturedFirst = allWork
    .sort(
      (a, b) =>
        convertBooleanToNumber(b.featuredOnHomePage) -
        convertBooleanToNumber(a.featuredOnHomePage),
    )
    .filter((work) => !work.hideFromWorkFeeds);

  const { pageDescription, publishDate, updatedAt } = workPage;

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
      ],
    },
    description: pageDescription,
    datePublished: publishDate,
    dateModified: updatedAt,
    name: "Work",
    publisher: {
      "@type": "Organization",
      name: "After Avenue",
    },
  };

  return (
    <>
      <Script
        id="workSchema"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>
      <WorkPage
        pageFields={workPage}
        allWork={allWorkSortedFeaturedFirst}
        allWorkCategories={allWorkCategories}
      />
    </>
  );
}

export default Work;
