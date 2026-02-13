import type { ExtractSymbolType } from "src/contentful/helpers";
import {
  isTypeComponentModules,
  type TypeComponentModulesFields,
  type TypeComponentModulesWithoutUnresolvableLinksResponse,
} from "src/contentful/types";

export type ModuleType = ExtractSymbolType<
  NonNullable<TypeComponentModulesFields["module"]>
>;

export interface ComponentModules {
  module: ModuleType;
}

export type ComponentModulesEntry =
  | TypeComponentModulesWithoutUnresolvableLinksResponse
  | undefined;

export function parseContentfulComponentModules(
  entry?: ComponentModulesEntry,
): ComponentModules | null {
  if (!entry || !isTypeComponentModules(entry)) {
    return null;
  }

  return {
    module: entry.fields.module as ModuleType,
  };
}
