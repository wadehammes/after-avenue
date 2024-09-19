import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { EditorsEntryPage } from "src/components/EditorsEntryPage/EditorsEntryPage.component";
import type { Editor } from "src/contentful/getEditors";
import { fetchAllEditors, fetchEditorBySlug } from "src/contentful/getEditors";
import { fetchWorkByEditor } from "src/contentful/getWork";
import { outputSitemap } from "src/lib/generateSitemap";
import type { SitemapItem } from "src/lib/generateSitemap";
import {
  EXCLUDED_PAGE_SLUGS_FROM_BUILD,
  TEST_PAGE_SLUG,
} from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

interface EditorParams {
  slug: string;
}

interface EditorsProps {
  params: EditorParams;
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
      .map((editor: Editor) => {
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
  const editorEntry = await fetchEditorBySlug({
    slug: params.slug,
    preview: draftMode().isEnabled,
  });

  if (!editorEntry) {
    return notFound();
  }

  return {
    metadataBase: new URL(`${envUrl()}/editors/${editorEntry.editorSlug}`),
    alternates: {
      canonical: "/",
    },
    title: `${editorEntry.editorName} | After Avenue`,
    robots:
      process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
  };
}

// The actual EditorEntry component.
async function EditorEntry({ params }: EditorsProps) {
  // Fetch a single editor entry by slug,
  // using the content preview if draft mode is enabled:
  const editorEntry = await fetchEditorBySlug({
    slug: params.slug,
    preview: draftMode().isEnabled,
  });

  if (!editorEntry) {
    // If a work entry can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  const editorsWork = await fetchWorkByEditor({
    editorSlug: editorEntry.editorSlug,
    preview: draftMode().isEnabled,
  });

  return (
    <EditorsEntryPage editorEntry={editorEntry} editorsWork={editorsWork} />
  );
}

export default EditorEntry;
