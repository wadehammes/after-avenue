import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeSectionSkeleton } from "./TypeSection";

export interface TypePageFields {
  entryTitle?: EntryFieldTypes.Symbol;
  pageTitle: EntryFieldTypes.Symbol;
  pageDisplayTitle?: EntryFieldTypes.Symbol;
  pageSubtitle?: EntryFieldTypes.Symbol;
  pageSlug: EntryFieldTypes.Symbol;
  pageDescription?: EntryFieldTypes.Text;
  sections?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeSectionSkeleton>
  >;
  socialImage?: EntryFieldTypes.AssetLink;
  enableIndexing?: EntryFieldTypes.Boolean;
  metaDescription: EntryFieldTypes.Text;
}

export type TypePageSkeleton = EntrySkeletonType<TypePageFields, "page">;
export type TypePage<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypePageSkeleton, Modifiers, Locales>;
