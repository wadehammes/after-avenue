import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { ContactPage } from "src/components/ContactPage/ContactPage.component";
import { fetchPage } from "src/contentful/getPages";
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

  return <ContactPage pageFields={page} />;
};

export default Contact;
