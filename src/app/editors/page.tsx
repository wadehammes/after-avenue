import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { EditorsPage } from "src/components/EditorsPage/EditorsPage.component";
import { JsonLd } from "src/components/JsonLd/JsonLd.component";
import { fetchAllEditorsForMainPage } from "src/contentful/getEditors";
import { fetchPage } from "src/contentful/getPages";
import {
  createBreadcrumbSchema,
  createOrganizationSchema,
  createSchemaGraph,
  createWebPageSchema,
} from "src/lib/schema";
import { EDITORS_PAGE_SLUG } from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

export const revalidate = 3600;

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

  const [editorsPage, allEditors] = await Promise.all([
    fetchPage({
      slug: EDITORS_PAGE_SLUG,
      preview: draft.isEnabled,
    }),
    fetchAllEditorsForMainPage({
      preview: draft.isEnabled,
    }),
  ]);

  if (!editorsPage) {
    // If a page can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  const { pageDescription, publishDate, updatedAt } = editorsPage;

  const pageUrl = `${envUrl()}/editors`;
  const publisher = createOrganizationSchema();
  const breadcrumb = createBreadcrumbSchema([
    { name: "Home", url: envUrl() },
    { name: "Editors", url: pageUrl },
  ]);

  const webPage = createWebPageSchema({
    url: pageUrl,
    name: "Editors",
    description: pageDescription,
    datePublished: publishDate,
    dateModified: updatedAt,
    breadcrumb,
    publisher,
  });

  const schemaGraph = createSchemaGraph([webPage]);
  const title = `Editors - ${editorsPage.pageDisplayTitle} | After Avenue`;

  return (
    <>
      <JsonLd data={schemaGraph} />
      <h1 className="hidden-title">{title}</h1>
      <EditorsPage pageFields={editorsPage} editors={allEditors} />
    </>
  );
}

export default Editors;
