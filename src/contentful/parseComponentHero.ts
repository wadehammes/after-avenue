import type { Entry } from "contentful";
import { TypeComponentHeroSkeleton } from "src/contentful/types";

// Our simplified version of an hero entry.
// We don't need all the data that Contentful gives us.
export interface ComponentHero {
  entryTitle?: string;
  title?: string;
  subtitle?: string;
  animatedTitle?: boolean;
  titleSize?: "Large" | "Regular";
}

export type ComponentHeroEntry =
  | Entry<TypeComponentHeroSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

// A function to transform a Contentful hero component
export function parseComponentHero(
  entry: ComponentHeroEntry,
): ComponentHero | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
    return null;
  }

  return {
    entryTitle: entry.fields.entryTitle,
    title: entry.fields.title,
    subtitle: entry.fields.subtitle,
    animatedTitle: entry.fields.animatedTitle,
    titleSize: entry.fields.titleSize,
  };
}
