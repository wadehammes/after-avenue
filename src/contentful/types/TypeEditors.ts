import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeWorkSkeleton } from "./TypeWork";

export interface TypeEditorsFields {
  entryTitle?: EntryFieldTypes.Symbol;
  editorName: EntryFieldTypes.Symbol;
  editorSlug: EntryFieldTypes.Symbol;
  editorTitle?: EntryFieldTypes.Symbol;
  editorBio?: EntryFieldTypes.RichText;
  editorHeadshot?: EntryFieldTypes.AssetLink;
  editorHeadshotHover?: EntryFieldTypes.AssetLink;
  featuredWork?: EntryFieldTypes.EntryLink<TypeWorkSkeleton>;
  contactFooterTitle?: EntryFieldTypes.Symbol;
  contactFooterButtonText?: EntryFieldTypes.Symbol;
  priority?: EntryFieldTypes.Boolean;
  metaDescription: EntryFieldTypes.Text;
  showOnEditorsPage?: EntryFieldTypes.Boolean;
}

export type TypeEditorsSkeleton = EntrySkeletonType<
  TypeEditorsFields,
  "editors"
>;
export type TypeEditors<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeEditorsSkeleton, Modifiers, Locales>;
