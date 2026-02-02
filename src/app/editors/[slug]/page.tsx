import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { Thing } from "schema-dts";
import { EditorsEntryPage } from "src/components/EditorsEntryPage/EditorsEntryPage.component";
import type { EditorType } from "src/contentful/getEditors";
import { fetchAllEditors, fetchEditorBySlug } from "src/contentful/getEditors";
import { fetchWorkByEditor } from "src/contentful/getWork";
import type { SitemapItem } from "src/lib/generateSitemap";
import { outputSitemap } from "src/lib/generateSitemap";
import {
  createBreadcrumbSchema,
  createOrganizationSchema,
  createPersonSchema,
  createSchemaGraph,
  createVideoListSchema,
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

interface EditorParams {
  slug: string;
}

interface EditorsProps {
  params: Promise<EditorParams>;
}

// Tell Next.js about all our editor entries so
// they can be statically generated at build time.
export async function generateStaticParams(): Promise<EditorParams[]> {
  const editorEntries = await fetchAllEditors({
    preview: false,
  });

  if (editorEntries) {
    // Generate Sitemap
    const routes: SitemapItem[] = editorEntries
      .map((editor: EditorType) => {
        if (editor.editorSlug.includes(TEST_PAGE_SLUG)) {
          return {
            route: "",
            modTime: "",
          };
        }

        return {
          route: `/editors/${editor.editorSlug}`,
          modTime: editor.updatedAt,
        };
      })
      .filter((item: SitemapItem) => item.route.length);

    outputSitemap(routes, "editors");
  }

  return editorEntries
    .filter(
      (editor) => !EXCLUDED_PAGE_SLUGS_FROM_BUILD.includes(editor.editorSlug),
    )
    .map((editor) => ({ slug: editor.editorSlug }));
}

// For each editor entry, tell Next.js which metadata
// (e.g. editor name) to display.
export async function generateMetadata({
  params,
}: EditorsProps): Promise<Metadata> {
  const { slug } = await params;
  const draft = await draftMode();

  const editorEntry = await fetchEditorBySlug({
    slug,
    preview: draft.isEnabled,
  });

  if (!editorEntry) {
    return notFound();
  }

  return {
    metadataBase: new URL(`${envUrl()}/editors/${editorEntry.editorSlug}`),
    alternates: {
      canonical: "/",
    },
    title: `Editors - ${editorEntry.editorName} - Award-winning Post House in Atlanta, GA | After Avenue`,
    robots:
      process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    description: editorEntry.metaDescription,
  };
}

// The actual EditorEntry component.
async function EditorEntry({ params }: EditorsProps) {
  const { slug } = await params;

  const draft = await draftMode();

  // Fetch a single editor entry by slug,
  // using the content preview if draft mode is enabled:
  const editorEntry = await fetchEditorBySlug({
    slug,
    preview: draft.isEnabled,
  });

  if (!editorEntry) {
    // If a work entry can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  const editorsWork = await fetchWorkByEditor({
    editorSlug: editorEntry.editorSlug,
    preview: draft.isEnabled,
  });

  const {
    editorName,
    editorBio,
    editorTitle,
    editorHeadshot,
    publishDate,
    updatedAt,
  } = editorEntry;

  const pageUrl = `${envUrl()}/editors/${editorEntry.editorSlug}`;
  const descriptionText = editorBio ? documentToPlainTextString(editorBio) : "";
  const publisher = createOrganizationSchema();
  const breadcrumb = createBreadcrumbSchema([
    { name: "Home", url: envUrl() },
    { name: "Editors", url: `${envUrl()}/editors` },
    { name: editorName, url: pageUrl },
  ]);

  // Create Person schema for the editor
  const personImage = editorHeadshot?.src
    ? `https:${editorHeadshot.src}`
    : undefined;
  const person = createPersonSchema({
    name: editorName,
    description: descriptionText,
    jobTitle: editorTitle,
    url: pageUrl,
    worksFor: publisher,
    image: personImage,
  });

  // Create VideoObject schemas for each work item
  const videoObjects = editorsWork
    .filter((work) => work?.workVideoUrl)
    .map((work) => {
      if (!work) {
        return null;
      }

      const workUrl = `${envUrl()}/work/${work.workSlug}`;
      const workDescription = work.workDescription
        ? documentToPlainTextString(work.workDescription)
        : "";
      const workTitle = `${work.workClient} - ${work.workTitle}`;

      return createVideoObjectSchema({
        name: workTitle,
        description: workDescription,
        contentUrl: work.workVideoUrl,
        embedUrl: work.workVideoUrl,
        uploadDate: work.publishDate,
        datePublished: work.publishDate,
        dateModified: work.updatedAt,
        publisher,
        creator: person,
        url: workUrl,
      });
    })
    .filter((video): video is NonNullable<typeof video> => video !== null);

  // Create ItemList for the videos
  const videoList =
    videoObjects.length > 0
      ? createVideoListSchema({
          name: `Editorial Credits by ${editorName}`,
          description: `A collection of videos edited by ${editorName}`,
          items: videoObjects,
        })
      : null;

  const webPage = createWebPageSchema({
    url: pageUrl,
    name: editorName,
    description: descriptionText,
    datePublished: publishDate,
    dateModified: updatedAt,
    breadcrumb,
    publisher,
  });

  // Build the schema graph with all entities
  const schemas: Thing[] = [webPage, person, ...videoObjects];

  if (videoList) {
    schemas.push(videoList);
  }

  const schemaGraph = createSchemaGraph(schemas);

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Next.js requires this
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <EditorsEntryPage editorEntry={editorEntry} editorsWork={editorsWork} />
    </>
  );
}

export default EditorEntry;
