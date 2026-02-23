import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { JsonLd } from "src/components/JsonLd/JsonLd.component";
import { WorkEntryPage } from "src/components/WorkEntryPage/WorkEntryPage.component";
import type { Work } from "src/contentful/getWork";
import {
  fetchAllWork,
  fetchRandomWork,
  fetchWorkByCategory,
  fetchWorkBySlug,
} from "src/contentful/getWork";
import type { SitemapItem } from "src/lib/generateSitemap";
import { outputSitemap } from "src/lib/generateSitemap";
import {
  createBreadcrumbSchema,
  createOrganizationSchema,
  createSchemaGraph,
  createVideoObjectSchema,
  createWebPageSchema,
} from "src/lib/schema";
import {
  EXCLUDED_PAGE_SLUGS_FROM_BUILD,
  TEST_PAGE_SLUG,
} from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

export const revalidate = 3600;
export const dynamicParams = false;

interface WorkParams {
  slug: string;
}

interface WorkProps {
  params: Promise<WorkParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
  const draft = await draftMode();
  const { slug } = await params;

  const workEntry = await fetchWorkBySlug({
    slug,
    preview: draft.isEnabled,
  });

  if (!workEntry) {
    return notFound();
  }

  const url = `${envUrl()}/work/${workEntry.workSlug}`;
  const title = `${workEntry.workClient} - ${workEntry.workTitle} | After Avenue`;
  const description = workEntry.workDescription
    ? documentToPlainTextString(workEntry.workDescription)
    : "";

  return {
    metadataBase: new URL(url),
    alternates: {
      canonical: "/",
    },
    title,
    description,
    keywords: (workEntry.workCategories ?? [])
      .map((category) => (category ? category.categoryName : ""))
      .join(","),
    robots:
      process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    openGraph: {
      title,
      description,
      url,
      siteName: "After Avenue",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// The actual WorkEntry component.
async function WorkEntry({ params, searchParams }: WorkProps) {
  const [{ slug }, search] = await Promise.all([params, searchParams]);
  const playVideo = search?.playVideo === "true";

  const draft = await draftMode();

  // Fetch a single work entry by slug,
  // using the content preview if draft mode is enabled:
  const workEntry = await fetchWorkBySlug({
    slug,
    preview: draft.isEnabled,
  });

  if (!workEntry) {
    // If a work entry can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  const [workSeries, randomRecentWork] = await Promise.all([
    fetchWorkByCategory({
      category: workEntry.workSeriesCategory?.categoryName ?? "",
      preview: draft.isEnabled,
    }),
    fetchRandomWork({
      preview: draft.isEnabled,
    }),
  ]);

  const workSeriesUnique = workSeries.filter((work) => {
    return workEntry.workSlug !== work.workSlug;
  });

  const randomRecentWorkUnique = randomRecentWork
    .filter((work) => workEntry.workSlug !== work.workSlug)
    .slice(0, 3);

  const {
    workClient,
    workTitle,
    workDescription,
    publishDate,
    updatedAt,
    workVideoUrl,
  } = workEntry;

  const pageUrl = `${envUrl()}/work/${workEntry.workSlug}`;
  const descriptionText = workDescription
    ? documentToPlainTextString(workDescription)
    : "";
  const fullTitle = `${workClient} - ${workTitle}`;

  const publisher = createOrganizationSchema();

  const breadcrumb = createBreadcrumbSchema([
    { name: "Home", url: envUrl() },
    { name: "Work", url: `${envUrl()}/work` },
    { name: fullTitle, url: pageUrl },
  ]);

  const videoObject = createVideoObjectSchema({
    name: fullTitle,
    description: descriptionText,
    contentUrl: workVideoUrl,
    embedUrl: workVideoUrl,
    uploadDate: publishDate,
    datePublished: publishDate,
    dateModified: updatedAt,
    publisher,
  });

  const webPage = createWebPageSchema({
    url: pageUrl,
    name: fullTitle,
    description: descriptionText,
    datePublished: publishDate,
    dateModified: updatedAt,
    breadcrumb,
    publisher,
    video: videoObject,
  });

  const schemaGraph = createSchemaGraph([webPage, videoObject]);

  return (
    <>
      <JsonLd data={schemaGraph} />
      <WorkEntryPage
        playVideo={playVideo}
        workEntry={workEntry}
        workSeries={workSeriesUnique}
        recentWork={randomRecentWorkUnique}
      />
    </>
  );
}

export default WorkEntry;
