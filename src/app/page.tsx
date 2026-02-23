import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { HomePage } from "src/components/HomePage/HomePage";
import { JsonLd } from "src/components/JsonLd/JsonLd.component";
import { fetchPage } from "src/contentful/getPages";
import { fetchAllFeaturedWork } from "src/contentful/getWork";
import {
  createBreadcrumbSchema,
  createOrganizationSchema,
  createSchemaGraph,
  createWebPageSchema,
} from "src/lib/schema";
import { envUrl } from "src/utils/helpers";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const draft = await draftMode();

  const page = await fetchPage({
    slug: "home",
    preview: draft.isEnabled,
  });

  if (!page) {
    return notFound();
  }

  const url = envUrl();
  const title = `After Avenue | ${page.pageTitle}`;

  return {
    metadataBase: new URL(url),
    alternates: {
      canonical: "/",
    },
    title,
    description: page.metaDescription,
    keywords: page.metaKeywords.join(","),
    robots:
      page.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    openGraph: {
      title,
      description: page.metaDescription,
      url,
      siteName: "After Avenue",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.metaDescription,
    },
  };
}

const Home = async () => {
  const draft = await draftMode();

  const page = await fetchPage({
    slug: "home",
    preview: draft.isEnabled,
  });

  if (!page) {
    return notFound();
  }

  const featuredWork = await fetchAllFeaturedWork({
    preview: draft.isEnabled,
  });

  const { pageDescription, publishDate, updatedAt } = page;

  const pageUrl = envUrl();
  const publisher = createOrganizationSchema();
  const breadcrumb = createBreadcrumbSchema([{ name: "Home", url: pageUrl }]);

  const webPage = createWebPageSchema({
    url: pageUrl,
    name: "After Avenue",
    description: pageDescription,
    datePublished: publishDate,
    dateModified: updatedAt,
    breadcrumb,
    publisher,
  });

  const schemaGraph = createSchemaGraph([webPage]);

  return (
    <>
      <JsonLd data={schemaGraph} />
      <HomePage featuredWork={featuredWork} pageFields={page} />
    </>
  );
};

export default Home;
