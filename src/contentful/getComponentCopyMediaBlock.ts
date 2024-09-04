import { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import {
  ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import { TypeComponentCopyMediaBlockSkeleton } from "src/contentful/types";

// Our simplified version of an hero entry.
// We don't need all the data that Contentful gives us.
export interface ComponentCopyMediaBlock {
  copy?: Document;
  media?: ContentfulAsset[];
  copyPlacement?: "Left" | "Right";
}

export type ComponentCopyMediaBlockEntry =
  | Entry<
      TypeComponentCopyMediaBlockSkeleton,
      "WITHOUT_UNRESOLVABLE_LINKS",
      string
    >
  | undefined;

// A function to transform a Contentful hero component
export function parseContentfulComponent(
  entry: ComponentCopyMediaBlockEntry,
): ComponentCopyMediaBlock | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
    return null;
  }

  return {
    copy: entry.fields.copy,
    media:
      entry?.fields?.media
        ?.map((asset) => asset && parseContentfulAsset(asset))
        .filter((asset): asset is ContentfulAsset => asset !== null) ?? [],
    copyPlacement: entry.fields.copyPlacement,
  };
}
