import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { WebPage } from "schema-dts";
import { HomePage } from "src/components/HomePage/HomePage";
import { fetchPage } from "src/contentful/getPages";
import { fetchAllFeaturedWork } from "src/contentful/getWork";
import { envUrl } from "src/utils/helpers";

export async function generateMetadata(): Promise<Metadata> {
  const draft = await draftMode();

  const page = await fetchPage({
    slug: "home",
    preview: draft.isEnabled,
  });

  if (!page) {
    return notFound();
  }

  return {
    metadataBase: new URL(`${envUrl()}/`),
    alternates: {
      canonical: "/",
    },
    title: `After Avenue | ${page.pageTitle}`,
    robots:
      page.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    description: page.metaDescription,
    keywords: page.metaKeywords.join(","),
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
      ],
    },
    name: "After Avenue",
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
      <link
        rel="preload"
        as="image"
        href="https://i.vimeocdn.com/video/1930339589-b66d9665a265b4aec5af999f9b67e63603dbd29477edd5a8d8297499da25473d-d_640"
      />
      <script
        id="homeSchema"
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Next.js requires this
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage featuredWork={featuredWork} pageFields={page} />
    </>
  );
};

export default Home;
