import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import {
  type EditorType,
  parseContentfulEditorForCta,
} from "src/contentful/getEditors";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import type {
  TypeComponentContentCardFields,
  TypeComponentContentCardSkeleton,
} from "src/contentful/types";
import type { Alignment } from "src/interfaces/common.interfaces";

export type ContentCardStyleType = ExtractSymbolType<
  NonNullable<TypeComponentContentCardFields["style"]>
>;
export type ContentCardImageStyleType = ExtractSymbolType<
  NonNullable<TypeComponentContentCardFields["imageStyle"]>
>;

export interface ContentCard {
  image?: ContentfulAsset | null;
  copy: Document | null;
  copyAlignment?: Alignment;
  style?: ContentCardStyleType;
  imageStyle?: ContentCardImageStyleType;
  editorCta?: Partial<EditorType> | null;
  externalCta?: string | null;
}

const _contentCardTypeValidation: ContentfulTypeCheck<
  ContentCard,
  TypeComponentContentCardFields
> = true;

export type ContentCardEntry =
  | Entry<
      TypeComponentContentCardSkeleton,
      "WITHOUT_UNRESOLVABLE_LINKS",
      string
    >
  | undefined;

export function parseContentfulContentCard(
  entry: ContentCardEntry,
): ContentCard | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
    return null;
  }

  return {
    image: parseContentfulAsset(entry.fields.image),
    copy: entry.fields.copy,
    copyAlignment: entry.fields.copyAlignment as Alignment,
    style: entry.fields.style as ContentCardStyleType,
    imageStyle: entry.fields.imageStyle as ContentCardImageStyleType,
    editorCta: parseContentfulEditorForCta(entry.fields.editorCta),
    externalCta: entry.fields.externalCta,
  };
}
