import { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import { TypeComponentCopyBlockSkeleton } from "src/contentful/types";

// Our simplified version of an copy block entry.
// We don't need all the data that Contentful gives us.
export interface ComponentCopyBlock {
  copy: Document | null;
  textAlign?: "left" | "center" | "right";
}

export type ComponentCopyBlockEntry =
  | Entry<TypeComponentCopyBlockSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

// A function to transform a Contentful copy block entry
export function parseComponentCopyBlock(
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
    textAlign: entry.fields.textAlign,
  };
}
