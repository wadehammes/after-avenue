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
  backgroundOpacity?: EntryFieldTypes.Number;
  backgroundColor?: EntryFieldTypes.Symbol<
    "Black" | "Transparent" | "White" | "Yellow"
  >;
  headline?: EntryFieldTypes.Symbol;
  subheadline?: EntryFieldTypes.Symbol;
  pageCta?: EntryFieldTypes.EntryLink<TypePageSkeleton>;
}

export type TypeComponentSlideSkeleton = EntrySkeletonType<
  TypeComponentSlideFields,
  "componentSlide"
>;
export type TypeComponentSlide<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeComponentSlideSkeleton, Modifiers, Locales>;