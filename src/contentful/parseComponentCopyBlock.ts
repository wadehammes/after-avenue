import type { Document } from "@contentful/rich-text-types";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import {
  isTypeComponentCopyBlock,
  type TypeComponentCopyBlockFields,
  type TypeComponentCopyBlockWithoutUnresolvableLinksResponse,
} from "src/contentful/types";

type CopyBlockTextAlignType = ExtractSymbolType<
  NonNullable<TypeComponentCopyBlockFields["textAlign"]>
>;

export interface ComponentCopyBlock {
  copy: Document | null;
  textAlign?: CopyBlockTextAlignType;
}

const _componentCopyBlockTypeValidation: ContentfulTypeCheck<
  ComponentCopyBlock,
  TypeComponentCopyBlockFields
> = true;

export type ComponentCopyBlockEntry =
  | TypeComponentCopyBlockWithoutUnresolvableLinksResponse
  | undefined;

export function parseComponentCopyBlock(
  entry?: ComponentCopyBlockEntry,
): ComponentCopyBlock | null {
  if (!entry || !isTypeComponentCopyBlock(entry)) {
    return null;
  }

  return {
    copy: entry.fields.copy,
    textAlign: entry.fields.textAlign,
  };
}
