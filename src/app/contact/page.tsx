import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { ContactPage } from "src/components/ContactPage/ContactPage.component";
import { fetchPage } from "src/contentful/getPages";
import {
  createBreadcrumbSchema,
  createOrganizationSchema,
  createSchemaGraph,
  createWebPageSchema,
} from "src/lib/schema";
import { envUrl } from "src/utils/helpers";

export async function generateMetadata(): Promise<Metadata> {
  const draft = await draftMode();

  const page = await fetchPage({
    slug: "contact",
    preview: draft.isEnabled,
  });

  if (!page) {
    return notFound();
  }

  return {
    metadataBase: new URL(`${envUrl()}/contact`),
    alternates: {
      canonical: "/",
    },
    title: `${page.pageTitle} | After Avenue`,
    keywords: page.metaKeywords.join(","),
    robots:
      page.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    description: page.pageDescription,
  };
}

const Contact = async () => {
  const draft = await draftMode();

  const page = await fetchPage({
    slug: "contact",
    preview: draft.isEnabled,
  });

  if (!page) {
    return notFound();
  }

  const pageUrl = `${envUrl()}/contact`;
  const publisher = createOrganizationSchema();
  const breadcrumb = createBreadcrumbSchema([
    { name: "Home", url: envUrl() },
    { name: "Contact", url: pageUrl },
  ]);

  const webPage = createWebPageSchema({
    url: pageUrl,
    name: page.pageTitle,
    description: page.pageDescription,
    datePublished: page.publishDate,
    dateModified: page.updatedAt,
    breadcrumb,
    publisher,
  });

  const schemaGraph = createSchemaGraph([webPage]);

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Next.js requires this
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <ContactPage pageFields={page} />
    </>
  );
};

export default Contact;
