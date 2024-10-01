import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeGlobalVariablesFields {
  entryTitle?: EntryFieldTypes.Symbol;
  id?: EntryFieldTypes.Symbol;
  companyName?: EntryFieldTypes.Symbol;
  address?: EntryFieldTypes.Symbol;
  addressLine2?: EntryFieldTypes.Symbol;
  phoneNumber?: EntryFieldTypes.Symbol;
  email?: EntryFieldTypes.Symbol;
  featuredWorkButtonText?: EntryFieldTypes.Symbol;
  instagramUrl?: EntryFieldTypes.Symbol;
  linkedInUrl?: EntryFieldTypes.Symbol;
  twitterUrl?: EntryFieldTypes.Symbol;
  contactFormMarketingConsentText?: EntryFieldTypes.Symbol;
  contactFormSuccessMessage?: EntryFieldTypes.Symbol;
  contactFooterTitle?: EntryFieldTypes.Symbol;
  contactFooterButtonText?: EntryFieldTypes.Symbol;
  services?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  footerCopyrightText?: EntryFieldTypes.Symbol;
}

export type TypeGlobalVariablesSkeleton = EntrySkeletonType<
  TypeGlobalVariablesFields,
  "globalVariables"
>;
export type TypeGlobalVariables<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeGlobalVariablesSkeleton, Modifiers, Locales>;
