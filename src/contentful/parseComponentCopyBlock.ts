import { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import { TypeComponentCopyBlockSkeleton } from "src/contentful/types";

// Our simplified version of an image asset.
// We don't need all the data that Contentful gives us.
export interface ComponentCopyBlock {
  copy: Document | null;
}

export type ComponentCopyBlockEntry =
  | Entry<TypeComponentCopyBlockSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

// A function to transform a Contentful image asset
// into our own ContentfulAsset object.
export function parseContentfulComponentCopyBlock(
  entry: ComponentCopyBlockEntry,
): ComponentCopyBlock | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
    return null;
  }

  return {
    copy: entry.fields.copy,
  };
}
