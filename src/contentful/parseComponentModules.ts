import type { Entry } from "contentful";
import type { ExtractSymbolType } from "src/contentful/helpers";
import type {
  TypeComponentModulesFields,
  TypeComponentModulesSkeleton,
} from "src/contentful/types";

export type ModuleType = ExtractSymbolType<
  NonNullable<TypeComponentModulesFields["module"]>
>;

export interface ComponentModules {
  module: ModuleType;
}

export type ComponentModulesEntry =
  | Entry<TypeComponentModulesSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseContentfulComponentModules(
  entry: ComponentModulesEntry,
): ComponentModules | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
    return null;
  }

  return {
    module: entry.fields.module as ModuleType,
  };
}
