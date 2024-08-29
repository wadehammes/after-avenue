import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
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
    robots: "index, follow",
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

  return (
    <WorkPage
      pageFields={workPage}
      allWork={allWorkSortedFeaturedFirst}
      allWorkCategories={allWorkCategories}
    />
  );
}

export default Work;
