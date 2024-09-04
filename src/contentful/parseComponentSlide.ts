import type { Entry } from "contentful";
import {
  Page,
  parseContentfulPageForNavigation,
} from "src/contentful/getPages";
import {
  ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import { TypeComponentSlideSkeleton } from "src/contentful/types";

// Our simplified version of an slide entry.
// We don't need all the data that Contentful gives us.
export interface ComponentSlide {
  id: string;
  backgroundMedia?: ContentfulAsset | null;
  backgroundOpacity?: number;
  backgroundColor?: string;
  headline?: string;
  subheadline?: string;
  pageCta?: Partial<Page> | null;
}

export type ComponentSlideEntry =
  | Entry<TypeComponentSlideSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

// A function to transform a Contentful slide component
export function parseContentfulComponentSlide(
  entry: ComponentSlideEntry,
): ComponentSlide | null {
  if (!entry) {
    return null;
  }

  return {
    id: entry.sys.id,
    backgroundMedia: parseContentfulAsset(entry.fields.backgroundMedia),
    backgroundColor: entry.fields.backgroundColor,
    backgroundOpacity: entry.fields.backgroundOpacity,
    headline: entry.fields.headline,
    subheadline: entry.fields.subheadline,
    pageCta: parseContentfulPageForNavigation(entry.fields.pageCta),
  };
}
