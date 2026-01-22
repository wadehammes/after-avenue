import type { Entry } from "contentful";
import type { TypeComponentModulesSkeleton } from "src/contentful/types";

export type Module = "Featured Brands Marquee" | "Services Marquee" | undefined;

// Our simplified version of a module entry.
// We don't need all the data that Contentful gives us.
export interface ComponentModules {
  module: Module;
}

export type ComponentModulesEntry =
  | Entry<TypeComponentModulesSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

// A function to transform a Contentful component modules component
export function parseContentfulComponentModules(
  entry: ComponentModulesEntry,
): ComponentModules | null {
  if (!entry) {
    return null;
  }

  return {
    module: entry.fields.module as Module,
  };
}
