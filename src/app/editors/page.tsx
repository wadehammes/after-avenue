import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
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
    robots: "index, follow",
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

  return (
    <Suspense>
      <EditorsPage pageFields={editorsPage} editors={allEditors} />
    </Suspense>
  );
}

export default Editors;
