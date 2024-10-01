import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import type { TypeGlobalVariablesSkeleton } from "src/contentful/types";

export interface GlobalVariables {
  address?: string;
  addressLine2?: string;
  companyName?: string;
  contactFooterButtonText?: string;
  contactFooterTitle?: string;
  contactFormMarketingConsentText?: string;
  contactFormSuccessMessage?: string;
  email?: string;
  featuredWorkButtonText?: string;
  footerCopyrightText?: string;
  instagramUrl?: string;
  linkedInUrl?: string;
  phoneNumber?: string;
  services?: string[];
  twitterUrl?: string;
}

type GlobalVariablesEntry = Entry<
  TypeGlobalVariablesSkeleton,
  "WITHOUT_UNRESOLVABLE_LINKS",
  string
>;

export function parseContentfulGlobalVariables(
  globalVariables: GlobalVariablesEntry,
): GlobalVariables | null {
  if (!globalVariables) {
    return null;
  }

  return {
    address: globalVariables.fields.address,
    addressLine2: globalVariables.fields.addressLine2,
    companyName: globalVariables.fields.companyName,
    contactFooterButtonText: globalVariables.fields.contactFooterButtonText,
    contactFooterTitle: globalVariables.fields.contactFooterTitle,
    contactFormMarketingConsentText:
      globalVariables.fields.contactFormMarketingConsentText,
    contactFormSuccessMessage: globalVariables.fields.contactFormSuccessMessage,
    email: globalVariables.fields.email,
    featuredWorkButtonText: globalVariables.fields.featuredWorkButtonText,
    footerCopyrightText: globalVariables.fields.footerCopyrightText,
    instagramUrl: globalVariables.fields.instagramUrl,
    linkedInUrl: globalVariables.fields.linkedInUrl,
    phoneNumber: globalVariables.fields.phoneNumber,
    services: globalVariables.fields.services,
    twitterUrl: globalVariables.fields.twitterUrl,
  };
}

// A function to fetch global variables.
// Optionally uses the Contentful content preview.
interface FetchGlobalVariables {
  preview: boolean;
}

export async function fetchGlobalVariables({
  preview,
}: FetchGlobalVariables): Promise<GlobalVariables | null> {
  const contentful = contentfulClient({ preview });

  const globalVariables =
    await contentful.withoutUnresolvableLinks.getEntries<TypeGlobalVariablesSkeleton>(
      {
        // biome-ignore lint/style/useNamingConvention: Contentful standards
        content_type: "globalVariables",
        "fields.id": "global-variables",
        include: 10,
        limit: 1000,
      },
    );

  return parseContentfulGlobalVariables(globalVariables.items[0]);
}
