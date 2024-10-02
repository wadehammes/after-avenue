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
  workTitle: EntryFieldTypes.Symbol;
  workSlug: EntryFieldTypes.Symbol;
  workClient?: EntryFieldTypes.Symbol;
  workVideoUrl: EntryFieldTypes.Symbol;
  workDescription?: EntryFieldTypes.RichText;
  workDate?: EntryFieldTypes.Date;
  workCredits?: EntryFieldTypes.RichText;
  workCategories?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeWorkCategorySkeleton>
  >;
  workSeriesCategory?: EntryFieldTypes.EntryLink<TypeWorkCategorySkeleton>;
  workEditors?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeEditorsSkeleton>
  >;
  contactFooterTitle?: EntryFieldTypes.Symbol;
  contactFooterButtonText?: EntryFieldTypes.Symbol;
  featuredOnHomePage?: EntryFieldTypes.Boolean;
  featuredHomePriority?: EntryFieldTypes.Integer;
  hideFromWorkFeeds?: EntryFieldTypes.Boolean;
}

export type TypeWorkSkeleton = EntrySkeletonType<TypeWorkFields, "work">;
export type TypeWork<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeWorkSkeleton, Modifiers, Locales>;
