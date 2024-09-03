import type { Entry } from "contentful";
import {
  ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import { TypeComponentLogoTickerSkeleton } from "src/contentful/types";

// Our simplified version of an hero entry.
// We don't need all the data that Contentful gives us.
export interface ComponentLogoTicker {
  logos: (ContentfulAsset | null)[];
}

export type ComponentLogoTickerEntry =
  | Entry<TypeComponentLogoTickerSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

// A function to transform a Contentful hero component
export function parseComponentLogoTicker(
  entry: ComponentLogoTickerEntry,
): ComponentLogoTicker | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
    return null;
  }

  return {
    logos: entry.fields.logos.map(parseContentfulAsset),
  };
}
