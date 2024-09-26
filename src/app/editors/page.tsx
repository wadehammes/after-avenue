import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import Script from "next/script";
import { WebPage } from "schema-dts";
import { EditorsPage } from "src/components/EditorsPage/EditorsPage.component";
import { fetchAllEditors } from "src/contentful/getEditors";
import { fetchPage } from "src/contentful/getPages";
import { EDITORS_PAGE_SLUG } from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

// Fetch the editors page, tell Next.js which metadata
// (e.g. page title) to display.
export async function generateMetadata(): Promise<Metadata> {
  const editorsPage = await fetchPage({
    slug: EDITORS_PAGE_SLUG,
    preview: draftMode().isEnabled,
  });

  if (!editorsPage) {
    return notFound();
  }

  return {
    metadataBase: new URL(`${envUrl()}/editors`),
    alternates: {
      canonical: "/",
    },
    title: `${editorsPage.pageTitle} | After Avenue`,
    robots:
      editorsPage.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
  };
}

// The actual EditorsPage component.
async function Editors() {
  // Fetch the editors page entry by slug,
  // using the content preview if draft mode is enabled:
  const editorsPage = await fetchPage({
    slug: EDITORS_PAGE_SLUG,
    preview: draftMode().isEnabled,
  });

  // Fetch all editors
  const allEditors = await fetchAllEditors({ preview: draftMode().isEnabled });

  if (!editorsPage) {
    // If a page can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  const { pageDescription, publishDate, updatedAt } = editorsPage;

  const jsonLd: WebPage = {
    "@type": "WebPage",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
        },
        {
          "@type": "ListItem",
          position: 1,
          name: "Editors",
        },
      ],
    },
    name: "Editors",
    description: pageDescription,
    datePublished: publishDate,
    dateModified: updatedAt,
    publisher: {
      "@type": "Organization",
      name: "After Avenue",
    },
  };

  return (
    <>
      <Script
        id="editorsSchema"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>
      <EditorsPage pageFields={editorsPage} editors={allEditors} />
    </>
  );
}

export default Editors;
