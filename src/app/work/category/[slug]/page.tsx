import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { WorkPage } from "src/components/WorkPage/WorkPage.component";
import { fetchPage } from "src/contentful/getPages";
import { fetchAllWork } from "src/contentful/getWork";
import {
  fetchAllWorkCategories,
  fetchWorkCategoryBySlug,
  type WorkCategory,
} from "src/contentful/getWorkCategories";
import type { SitemapItem } from "src/lib/generateSitemap";
import { outputSitemap } from "src/lib/generateSitemap";
import { TEST_PAGE_SLUG } from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

interface WorkCategoryParams {
  slug: string;
}

interface WorkCategoryProps {
  params: Promise<WorkCategoryParams>;
}

// Tell Next.js about all our work categories
// they can be statically generated at build time.
export async function generateStaticParams(): Promise<WorkCategoryParams[]> {
  const workCategories = await fetchAllWorkCategories({
    preview: false,
  });

  if (workCategories) {
    // Generate Sitemap
    const routes: SitemapItem[] = workCategories
      .map((category: WorkCategory) => {
        if (category.slug.includes(TEST_PAGE_SLUG)) {
          return {
            route: "",
            modTime: "",
          };
        }

        if (category.slug === "uncategorized") {
          return {
            route: "",
            modTime: "",
          };
        }

        return {
          route: `/work/category/${category.slug}`,
          modTime: category.updatedAt,
        };
      })
      .filter((item: SitemapItem) => item.route.length);

    outputSitemap(routes, "workCategories");
  }

  return workCategories.map((category) => ({ slug: category.slug }));
}

// For each work category, tell Next.js which metadata
// (e.g. category name) to display.
export async function generateMetadata({
  params,
}: WorkCategoryProps): Promise<Metadata> {
  const { slug } = await params;
  const draft = await draftMode();

  const workCategory = await fetchWorkCategoryBySlug({
    slug,
    preview: draft.isEnabled,
  });

  if (!workCategory) {
    return notFound();
  }

  return {
    metadataBase: new URL(`${envUrl()}/work/category/${workCategory.slug}`),
    alternates: {
      canonical: "/",
    },
    title: `${workCategory.categoryName} - Work | After Avenue`,
    robots:
      process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    description: `All of our ${workCategory.categoryName} work`,
  };
}

// The actual WorkCategoryEntry component.
async function WorkCategoryEntry({ params }: WorkCategoryProps) {
  const { slug } = await params;
  const draft = await draftMode();

  // Fetch a single work category entry by slug,
  // using the content preview if draft mode is enabled:
  const workCategory = await fetchWorkCategoryBySlug({
    slug,
    preview: draft.isEnabled,
  });

  if (!workCategory) {
    // If a work entry can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  const allWorkCategories = await fetchAllWorkCategories({ preview: false });

  const allWork = await fetchAllWork({
    preview: draft.isEnabled,
  });

  const workPage = await fetchPage({
    slug: "work",
    preview: draft.isEnabled,
  });

  if (!workPage) {
    return notFound();
  }

  const allWorkByCategory = allWork.filter((work) => {
    return work.workCategories.some((category) => {
      return category
        ? category.categoryName === workCategory.categoryName
        : false;
    });
  });

  if (!allWorkByCategory.length) {
    return notFound();
  }

  const workPageWithCategory = {
    ...workPage,
    pageDisplayTitle: workCategory.categoryName,
    contactFooterButtonText: "Contact Us Today",
    contactFooterTitle: "The last stop before <span>your story begins.</span>",
  };

  return (
    <WorkPage
      pageFields={workPageWithCategory}
      allWork={allWorkByCategory}
      allWorkCategories={allWorkCategories}
    />
  );
}

export default WorkCategoryEntry;
