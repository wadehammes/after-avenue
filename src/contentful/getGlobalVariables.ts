import { contentfulClient } from "src/contentful/client";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import {
  isTypeGlobalVariables,
  type TypeGlobalVariablesFields,
  type TypeGlobalVariablesSkeleton,
  type TypeGlobalVariablesWithoutUnresolvableLinksResponse,
} from "src/contentful/types";

export interface GlobalVariables {
  id: string;
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

const _globalVariablesTypeValidation: ContentfulTypeCheck<
  GlobalVariables,
  TypeGlobalVariablesFields,
  "id"
> = true;

type GlobalVariablesEntry = TypeGlobalVariablesWithoutUnresolvableLinksResponse;

export function parseContentfulGlobalVariables(
  globalVariablesEntry?: GlobalVariablesEntry,
): GlobalVariables | null {
  if (!globalVariablesEntry || !isTypeGlobalVariables(globalVariablesEntry)) {
    return null;
  }

  return {
    id: globalVariablesEntry.sys.id,
    address: globalVariablesEntry.fields.address,
    addressLine2: globalVariablesEntry.fields.addressLine2,
    companyName: globalVariablesEntry.fields.companyName,
    contactFooterButtonText:
      globalVariablesEntry.fields.contactFooterButtonText,
    contactFooterTitle: globalVariablesEntry.fields.contactFooterTitle,
    contactFormMarketingConsentText:
      globalVariablesEntry.fields.contactFormMarketingConsentText,
    contactFormSuccessMessage:
      globalVariablesEntry.fields.contactFormSuccessMessage,
    email: globalVariablesEntry.fields.email,
    featuredWorkButtonText: globalVariablesEntry.fields.featuredWorkButtonText,
    footerCopyrightText: globalVariablesEntry.fields.footerCopyrightText,
    instagramUrl: globalVariablesEntry.fields.instagramUrl,
    linkedInUrl: globalVariablesEntry.fields.linkedInUrl,
    phoneNumber: globalVariablesEntry.fields.phoneNumber,
    services: globalVariablesEntry.fields.services,
    twitterUrl: globalVariablesEntry.fields.twitterUrl,
  };
}

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
        content_type: "globalVariables",
        "fields.id": "global-variables",
        include: 10,
        limit: 1000,
      },
    );

  return parseContentfulGlobalVariables(globalVariables.items[0]);
}
