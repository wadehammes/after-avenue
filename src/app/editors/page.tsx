import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { WebPage } from "schema-dts";
import { EditorsPage } from "src/components/EditorsPage/EditorsPage.component";
import { fetchAllEditors } from "src/contentful/getEditors";
import { fetchPage } from "src/contentful/getPages";
import { EDITORS_PAGE_SLUG } from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

// Fetch the editors page, tell Next.js which metadata
// (e.g. page title) to display.
export async function generateMetadata(): Promise<Metadata> {
  const draft = await draftMode();

  const editorsPage = await fetchPage({
    slug: EDITORS_PAGE_SLUG,
    preview: draft.isEnabled,
  });

  if (!editorsPage) {
    return notFound();
  }

  return {
    metadataBase: new URL(`${envUrl()}/editors`),
    alternates: {
      canonical: "/",
    },
    title: `${editorsPage.pageTitle} - ${editorsPage.pageDisplayTitle} | After Avenue`,
    keywords: editorsPage.metaKeywords.join(","),
    robots:
      editorsPage.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
  };
}

// The actual EditorsPage component.
async function Editors() {
  const draft = await draftMode();

  // Fetch the editors page entry by slug,
  // using the content preview if draft mode is enabled:
  const editorsPage = await fetchPage({
    slug: EDITORS_PAGE_SLUG,
    preview: draft.isEnabled,
  });

  // Fetch all editors
  const allEditors = await fetchAllEditors({ preview: draft.isEnabled });

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

  const title = `Editors - ${editorsPage.pageDisplayTitle} | After Avenue`;

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Next.js requires this
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="hidden-title">{title}</h1>
      <EditorsPage pageFields={editorsPage} editors={allEditors} />
    </>
  );
}

export default Editors;
