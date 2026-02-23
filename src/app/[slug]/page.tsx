import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { AboutPage } from "src/components/AboutPage/AboutPage.component";
import { JsonLd } from "src/components/JsonLd/JsonLd.component";
import { PageComponent } from "src/components/Page/Page.component";
import type { Page as PageType } from "src/contentful/getPages";
import { fetchPage, fetchPages } from "src/contentful/getPages";
import type { SitemapItem } from "src/lib/generateSitemap";
import { outputSitemap } from "src/lib/generateSitemap";
import {
  createBreadcrumbSchema,
  createOrganizationSchema,
  createSchemaGraph,
  createWebPageSchema,
} from "src/lib/schema";
import {
  EDITORS_PAGE_SLUG,
  EXCLUDED_PAGE_SLUGS_FROM_BUILD,
  HOME_PAGE_SLUG,
  TEST_PAGE_SLUG,
} from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

export const revalidate = 3600;
export const dynamicParams = false;

interface PageParams {
  slug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

// Tell Next.js about all our pages so
// they can be statically generated at build time.
export async function generateStaticParams(): Promise<PageParams[]> {
  const pages = await fetchPages({ preview: false });

  if (pages) {
    // Generate Sitemap
    const routes: SitemapItem[] = pages
      .map((page: PageType) => {
        if (page.pageSlug.includes(TEST_PAGE_SLUG) || !page.enableIndexing) {
          return {
            route: "",
            modTime: "",
          };
        }

        if (page.pageSlug === HOME_PAGE_SLUG) {
          return {
            route: "/",
            modTime: page.updatedAt,
          };
        }

        return {
          route: `/${page.pageSlug}`,
          modTime: page.updatedAt,
        };
      })
      .filter((item: SitemapItem) => item.route.length);

    outputSitemap(routes, "pages");
  }

  return pages
    .filter((page) => !EXCLUDED_PAGE_SLUGS_FROM_BUILD.includes(page.pageSlug))
    .map((page) => ({ slug: page.pageSlug }));
}

// For each page, tell Next.js which metadata
// (e.g. page title) to display.
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const draft = await draftMode();

  const page = await fetchPage({
    slug,
    preview: draft.isEnabled,
  });

  if (!page) {
    return notFound();
  }

  const url =
    page.pageSlug === HOME_PAGE_SLUG
      ? envUrl()
      : `${envUrl()}/${page.pageSlug}`;
  const title = `${page.pageDisplayTitle} | After Avenue`;

  return {
    metadataBase: new URL(url),
    alternates: {
      canonical: "/",
    },
    title,
    description: page.pageDescription,
    keywords: (page.metaKeywords ?? []).join(","),
    robots:
      page.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    openGraph: {
      title,
      description: page.pageDescription,
      url,
      siteName: "After Avenue",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.pageDescription,
    },
  };
}

// The actual Page component.
async function Page({ params }: PageProps) {
  const { slug } = await params;
  const draft = await draftMode();

  // Fetch a single page by slug,
  // using the content preview if draft mode is enabled:
  const page = await fetchPage({
    slug,
    preview: draft.isEnabled,
  });

  if (!page) {
    // If a page can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  const pageUrl =
    page.pageSlug === HOME_PAGE_SLUG
      ? envUrl()
      : `${envUrl()}/${page.pageSlug}`;
  const publisher = createOrganizationSchema();
  const breadcrumbItems = [{ name: "Home", url: envUrl() }];

  if (page.pageSlug !== HOME_PAGE_SLUG) {
    breadcrumbItems.push({
      name: page.pageDisplayTitle || page.pageTitle,
      url: pageUrl,
    });
  }

  const breadcrumb = createBreadcrumbSchema(breadcrumbItems);

  const webPage = createWebPageSchema({
    url: pageUrl,
    name: page.pageDisplayTitle || page.pageTitle,
    description: page.pageDescription,
    datePublished: page.publishDate,
    dateModified: page.updatedAt,
    breadcrumb,
    publisher,
  });

  const schemaGraph = createSchemaGraph([webPage]);

  if (page.pageSlug === "about") {
    const editorsPage = await fetchPage({
      slug: EDITORS_PAGE_SLUG,
      preview: false,
    });
    const isEditorsPagePublished = editorsPage !== null;

    return (
      <>
        <JsonLd data={schemaGraph} />
        <AboutPage
          pageFields={page}
          isEditorsPagePublished={isEditorsPagePublished}
        />
      </>
    );
  }

  return (
    <>
      <JsonLd data={schemaGraph} />
      <PageComponent fields={page} />
    </>
  );
}

export default Page;
