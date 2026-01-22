import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeEditorsSkeleton } from "./TypeEditors";

export interface TypeComponentContentCardFields {
  entryTitle?: EntryFieldTypes.Symbol;
  image?: EntryFieldTypes.AssetLink;
  imageStyle?: EntryFieldTypes.Symbol<"Circle" | "Regular">;
  copy: EntryFieldTypes.RichText;
  copyAlignment?: EntryFieldTypes.Symbol<"Center" | "Left" | "Right">;
  style?: EntryFieldTypes.Symbol<"Card" | "No Style">;
  editorCta?: EntryFieldTypes.EntryLink<TypeEditorsSkeleton>;
  externalCta?: EntryFieldTypes.Symbol;
}

export type TypeComponentContentCardSkeleton = EntrySkeletonType<
  TypeComponentContentCardFields,
  "componentContentCard"
>;
export type TypeComponentContentCard<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeComponentContentCardSkeleton, Modifiers, Locales>;
