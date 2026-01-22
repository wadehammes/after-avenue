import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import {
  type Editor,
  parseContentfulEditorForCta,
} from "src/contentful/getEditors";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import type { TypeComponentContentCardSkeleton } from "src/contentful/types";
import type { Alignment } from "src/interfaces/common.interfaces";

export type ContentCardStyle = "Card" | "No Style";
export type ContentCardImageStyle = "Circle" | "Regular";

// Our simplified version of a content card entry.
// We don't need all the data that Contentful gives us.
export interface ContentCard {
  image?: ContentfulAsset | null;
  copy: Document | null;
  copyAlignment?: Alignment;
  style?: ContentCardStyle;
  imageStyle?: ContentCardImageStyle;
  editorCta?: Partial<Editor> | null;
  externalCta?: string | null;
}

export type ContentCardEntry =
  | Entry<
      TypeComponentContentCardSkeleton,
      "WITHOUT_UNRESOLVABLE_LINKS",
      string
    >
  | undefined;

// A function to transform a Contentful content card component
export function parseContentfulContentCard(
  entry: ContentCardEntry,
): ContentCard | null {
  if (!entry) {
    return null;
  }

  return {
    image: parseContentfulAsset(entry.fields.image),
    copy: entry.fields.copy,
    copyAlignment: entry.fields.copyAlignment as Alignment,
    style: entry.fields.style as ContentCardStyle,
    imageStyle: entry.fields.imageStyle as ContentCardImageStyle,
    editorCta: parseContentfulEditorForCta(entry.fields.editorCta),
    externalCta: entry.fields.externalCta,
  };
}
