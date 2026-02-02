import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import type {
  TypeComponentCopyBlockFields,
  TypeComponentCopyBlockSkeleton,
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
  | Entry<TypeComponentCopyBlockSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseComponentCopyBlock(
  entry: ComponentCopyBlockEntry,
): ComponentCopyBlock | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
    return null;
  }

  return {
    copy: entry.fields.copy,
    textAlign: entry.fields.textAlign,
  };
}
