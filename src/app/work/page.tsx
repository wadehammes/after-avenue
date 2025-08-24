import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { WebPage } from "schema-dts";
import { WorkPage } from "src/components/WorkPage/WorkPage.component";
import { fetchPage } from "src/contentful/getPages";
import { fetchAllWork } from "src/contentful/getWork";
import { fetchAllWorkCategories } from "src/contentful/getWorkCategories";
import { WORK_SLUG } from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

// Fetch the work page, tell Next.js which metadata
// (e.g. page title) to display.
export async function generateMetadata(): Promise<Metadata> {
  const draft = await draftMode();

  const workPage = await fetchPage({
    slug: WORK_SLUG,
    preview: draft.isEnabled,
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
    description: workPage.metaDescription,
    keywords: workPage.metaKeywords.join(","),
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
  const draft = await draftMode();

  // Fetch the work page entry by slug,
  // using the content preview if draft mode is enabled:
  const workPage = await fetchPage({
    slug: WORK_SLUG,
    preview: draft.isEnabled,
  });

  const allWorkCategories = await fetchAllWorkCategories({
    preview: draft.isEnabled,
  });

  // Fetch all work entries
  const allWork = await fetchAllWork({ preview: draft.isEnabled });

  if (!workPage || !allWork) {
    // If a work entry can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

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
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Next.js requires this
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorkPage
        pageFields={workPage}
        allWork={allWork}
        allWorkCategories={allWorkCategories}
      />
    </>
  );
}

export default Work;
