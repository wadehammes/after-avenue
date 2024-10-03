import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import {
  type Page,
  parseContentfulPageForNavigation,
} from "src/contentful/getPages";
import type { TypeNavigationSkeleton } from "src/contentful/types";

type NavigationEntry = Entry<
  TypeNavigationSkeleton,
  "WITHOUT_UNRESOLVABLE_LINKS",
  string
>;

// Our simplified version of our Navigation.
// We don't need all the data that Contentful gives us.
export interface NavigationType {
  navigationItems: Partial<Page | null>[];
}

// A function to transform a Contentful case study
// into our own Case Study object.
export function parseContentfulNavigation(
  navigationEntry?: NavigationEntry,
): NavigationType | null {
  if (!navigationEntry) {
    return null;
  }

  return {
    navigationItems: navigationEntry.fields.navigationItems.map((page) =>
      parseContentfulPageForNavigation(page),
    ),
  };
}

// A function to fetch our navigation by its ID.
// Optionally uses the Contentful content preview.
interface FetchNavigationOptions {
  id: string;
  preview: boolean;
}

export async function fetchNavigation({
  id,
  preview,
}: FetchNavigationOptions): Promise<NavigationType | null> {
  const contentful = contentfulClient({ preview });

  const NavigationResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeNavigationSkeleton>(
      {
        content_type: "navigation",
        "fields.id": id,
        include: 10,
      },
    );

  return parseContentfulNavigation(NavigationResult.items[0]);
}
