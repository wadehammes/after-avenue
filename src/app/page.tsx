import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { HomePage } from "src/components/HomePage/HomePage";
import { fetchPage } from "src/contentful/getPages";
import { fetchAllFeaturedWork } from "src/contentful/getWork";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPage({
    slug: "home",
    preview: draftMode().isEnabled,
  });

  if (!page) {
    return notFound();
  }

  return {
    title: `${page.pageTitle} | After Avenue`,
    robots:
      page.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    description: page.pageDescription,
  };
}

const Home = async () => {
  const featuredWork = await fetchAllFeaturedWork({
    preview: draftMode().isEnabled,
  });

  return <HomePage featuredWork={featuredWork} />;
};

export default Home;
