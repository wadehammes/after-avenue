import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeEditorsSkeleton } from "./TypeEditors";

export interface TypeWorkFields {
  entryTitle?: EntryFieldTypes.Symbol;
  workTitle: EntryFieldTypes.Symbol;
  workSlug: EntryFieldTypes.Symbol;
  workClient?: EntryFieldTypes.Symbol;
  workVideoUrl: EntryFieldTypes.Symbol;
  workDescription?: EntryFieldTypes.RichText;
  workEditors?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeEditorsSkeleton>
  >;
  workSocialImage?: EntryFieldTypes.AssetLink;
  featuredOnHomePage?: EntryFieldTypes.Boolean;
  workShortClip?: EntryFieldTypes.AssetLink;
}

export type TypeWorkSkeleton = EntrySkeletonType<TypeWorkFields, "work">;
export type TypeWork<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeWorkSkeleton, Modifiers, Locales>;
