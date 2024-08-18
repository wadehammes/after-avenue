import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeEditorsFields {
  entryTitle?: EntryFieldTypes.Symbol;
  editorName: EntryFieldTypes.Symbol;
  editorSlug: EntryFieldTypes.Symbol;
  editorBio?: EntryFieldTypes.RichText;
  editorHeadshot?: EntryFieldTypes.AssetLink;
}

export type TypeEditorsSkeleton = EntrySkeletonType<
  TypeEditorsFields,
  "editors"
>;
export type TypeEditors<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeEditorsSkeleton, Modifiers, Locales>;
