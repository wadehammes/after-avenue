import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypePageSkeleton } from "./TypePage";

export interface TypeComponentSlideFields {
  entryTitle?: EntryFieldTypes.Symbol;
  backgroundMedia?: EntryFieldTypes.AssetLink;
  headline?: EntryFieldTypes.Symbol;
  subheadline?: EntryFieldTypes.Symbol;
  slideCopy?: EntryFieldTypes.Text;
  ctaText?: EntryFieldTypes.Symbol;
  pageCta?: EntryFieldTypes.EntryLink<TypePageSkeleton>;
  pageHash?: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
}

export type TypeComponentSlideSkeleton = EntrySkeletonType<
  TypeComponentSlideFields,
  "componentSlide"
>;
export type TypeComponentSlide<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeComponentSlideSkeleton, Modifiers, Locales>;
