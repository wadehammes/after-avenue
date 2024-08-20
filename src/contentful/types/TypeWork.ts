import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeEditorsSkeleton } from "./TypeEditors";
import type { TypeWorkCategorySkeleton } from "./TypeWorkCategory";

export interface TypeWorkFields {
  entryTitle?: EntryFieldTypes.Symbol;
  workProjectDate?: EntryFieldTypes.Date;
  workTitle: EntryFieldTypes.Symbol;
  workSlug: EntryFieldTypes.Symbol;
  workClient?: EntryFieldTypes.Symbol;
  workVideoUrl: EntryFieldTypes.Symbol;
  workDescription?: EntryFieldTypes.RichText;
  workCredits?: EntryFieldTypes.RichText;
  workCategories?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeWorkCategorySkeleton>
  >;
  workSeriesCategory?: EntryFieldTypes.EntryLink<TypeWorkCategorySkeleton>;
  workEditors?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeEditorsSkeleton>
  >;
  featuredOnHomePage?: EntryFieldTypes.Boolean;
}

export type TypeWorkSkeleton = EntrySkeletonType<TypeWorkFields, "work">;
export type TypeWork<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeWorkSkeleton, Modifiers, Locales>;
