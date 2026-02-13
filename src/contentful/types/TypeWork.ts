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

export function isTypeWork<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeWork<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "work";
}

export type TypeWorkWithoutLinkResolutionResponse =
  TypeWork<"WITHOUT_LINK_RESOLUTION">;
export type TypeWorkWithoutUnresolvableLinksResponse =
  TypeWork<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeWorkWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeWork<"WITH_ALL_LOCALES", Locales>;
export type TypeWorkWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeWork<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeWorkWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeWork<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
