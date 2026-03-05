export const CACHE_TAG_CONTENTFUL_PAGES = "contentful-pages";
export const CACHE_TAG_CONTENTFUL_PAGE = "contentful-page";
export const CACHE_TAG_CONTENTFUL_NAVIGATION = "contentful-navigation";
export const CACHE_TAG_CONTENTFUL_GLOBAL_VARIABLES =
  "contentful-globalVariables";
export const CACHE_TAG_CONTENTFUL_WORK_ALL = "contentful-work-all";
export const CACHE_TAG_CONTENTFUL_WORK_CATEGORY = "contentful-work-category";
export const CACHE_TAG_CONTENTFUL_WORK_EDITOR = "contentful-work-editor";
export const CACHE_TAG_CONTENTFUL_WORK_FEATURED = "contentful-work-featured";
export const CACHE_TAG_CONTENTFUL_WORK_RANDOM = "contentful-work-random";
export const CACHE_TAG_CONTENTFUL_WORK_SLUG = "contentful-work-slug";
export const CACHE_TAG_CONTENTFUL_WORK_CATEGORIES = "contentful-workCategories";
export const CACHE_TAG_CONTENTFUL_WORK_CATEGORY_SLUG =
  "contentful-workCategory";
export const CACHE_TAG_CONTENTFUL_EDITORS_ALL = "contentful-editors-all";
export const CACHE_TAG_CONTENTFUL_EDITOR_SLUG = "contentful-editor";
export const CACHE_TAG_CONTENTFUL_EDITORS_MAIN_PAGE =
  "contentful-editors-mainPage";

export function contentfulPagesKey(preview: boolean): string[] {
  return ["contentful", "pages", String(preview)];
}

export function contentfulPageKey(slug: string, preview: boolean): string[] {
  return ["contentful", "page", slug, String(preview)];
}

export function contentfulNavigationKey(
  id: string,
  preview: boolean,
): string[] {
  return ["contentful", "navigation", id, String(preview)];
}

export function contentfulGlobalVariablesKey(preview: boolean): string[] {
  return ["contentful", "globalVariables", String(preview)];
}

export function contentfulWorkAllKey(preview: boolean): string[] {
  return ["contentful", "work", "all", String(preview)];
}

export function contentfulWorkCategoryKey(
  category: string,
  preview: boolean,
): string[] {
  return ["contentful", "work", "category", category, String(preview)];
}

export function contentfulWorkEditorKey(
  editorSlug: string,
  preview: boolean,
): string[] {
  return ["contentful", "work", "editor", editorSlug, String(preview)];
}

export function contentfulWorkFeaturedKey(preview: boolean): string[] {
  return ["contentful", "work", "featured", String(preview)];
}

export function contentfulWorkRandomKey(preview: boolean): string[] {
  return ["contentful", "work", "random", String(preview)];
}

export function contentfulWorkSlugKey(
  slug: string,
  preview: boolean,
): string[] {
  return ["contentful", "work", "slug", slug, String(preview)];
}

export function contentfulWorkCategoriesKey(preview: boolean): string[] {
  return ["contentful", "workCategories", String(preview)];
}

export function contentfulWorkCategorySlugKey(
  slug: string,
  preview: boolean,
): string[] {
  return ["contentful", "workCategory", slug, String(preview)];
}

export function contentfulEditorsAllKey(preview: boolean): string[] {
  return ["contentful", "editors", "all", String(preview)];
}

export function contentfulEditorSlugKey(
  slug: string,
  preview: boolean,
): string[] {
  return ["contentful", "editor", slug, String(preview)];
}

export function contentfulEditorsMainPageKey(preview: boolean): string[] {
  return ["contentful", "editors", "mainPage", String(preview)];
}
