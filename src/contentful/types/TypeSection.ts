import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeComponentContentCardSkeleton } from "./TypeComponentContentCard";
import type { TypeComponentCopyBlockSkeleton } from "./TypeComponentCopyBlock";
import type { TypeComponentModulesSkeleton } from "./TypeComponentModules";
import type { TypeComponentSlideSkeleton } from "./TypeComponentSlide";

export interface TypeSectionFields {
  entryTitle?: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  sectionHeader?: EntryFieldTypes.RichText;
  sectionHeaderAlignment?: EntryFieldTypes.Symbol<"Center" | "Left" | "Right">;
  sectionBackgroundColor?: EntryFieldTypes.Symbol<
    "Black" | "System Color" | "White" | "Yellow"
  >;
  sectionPadding?: EntryFieldTypes.Symbol<"None" | "Regular">;
  content: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeComponentContentCardSkeleton
      | TypeComponentCopyBlockSkeleton
      | TypeComponentModulesSkeleton
      | TypeComponentSlideSkeleton
    >
  >;
  contentLayout?: EntryFieldTypes.Symbol<
    | "Four Column"
    | "Full Width"
    | "Single Column"
    | "Three Column"
    | "Two Column"
  >;
}

export type TypeSectionSkeleton = EntrySkeletonType<
  TypeSectionFields,
  "section"
>;
export type TypeSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeSectionSkeleton, Modifiers, Locales>;
