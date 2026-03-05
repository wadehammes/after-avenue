import {
  contentfulEditorSlugKey,
  contentfulEditorsAllKey,
  contentfulEditorsMainPageKey,
  contentfulGlobalVariablesKey,
  contentfulNavigationKey,
  contentfulPageKey,
  contentfulPagesKey,
  contentfulWorkAllKey,
  contentfulWorkCategoriesKey,
  contentfulWorkCategoryKey,
  contentfulWorkCategorySlugKey,
  contentfulWorkEditorKey,
  contentfulWorkFeaturedKey,
  contentfulWorkRandomKey,
  contentfulWorkSlugKey,
} from "src/contentful/cacheKeys";

describe("cacheKeys", () => {
  describe("contentfulPagesKey", () => {
    it("returns key with preview false", () => {
      expect(contentfulPagesKey(false)).toEqual([
        "contentful",
        "pages",
        "false",
      ]);
    });
    it("returns key with preview true", () => {
      expect(contentfulPagesKey(true)).toEqual(["contentful", "pages", "true"]);
    });
  });

  describe("contentfulPageKey", () => {
    it("returns key with slug and preview", () => {
      expect(contentfulPageKey("about", false)).toEqual([
        "contentful",
        "page",
        "about",
        "false",
      ]);
    });
  });

  describe("contentfulNavigationKey", () => {
    it("returns key with id and preview", () => {
      expect(contentfulNavigationKey("nav-1", true)).toEqual([
        "contentful",
        "navigation",
        "nav-1",
        "true",
      ]);
    });
  });

  describe("contentfulGlobalVariablesKey", () => {
    it("returns key with preview", () => {
      expect(contentfulGlobalVariablesKey(false)).toEqual([
        "contentful",
        "globalVariables",
        "false",
      ]);
    });
  });

  describe("contentfulWorkAllKey", () => {
    it("returns key with preview", () => {
      expect(contentfulWorkAllKey(true)).toEqual([
        "contentful",
        "work",
        "all",
        "true",
      ]);
    });
  });

  describe("contentfulWorkCategoryKey", () => {
    it("returns key with category and preview", () => {
      expect(contentfulWorkCategoryKey("commercial", false)).toEqual([
        "contentful",
        "work",
        "category",
        "commercial",
        "false",
      ]);
    });
  });

  describe("contentfulWorkEditorKey", () => {
    it("returns key with editorSlug and preview", () => {
      expect(contentfulWorkEditorKey("jane-doe", true)).toEqual([
        "contentful",
        "work",
        "editor",
        "jane-doe",
        "true",
      ]);
    });
  });

  describe("contentfulWorkFeaturedKey", () => {
    it("returns key with preview", () => {
      expect(contentfulWorkFeaturedKey(false)).toEqual([
        "contentful",
        "work",
        "featured",
        "false",
      ]);
    });
  });

  describe("contentfulWorkRandomKey", () => {
    it("returns key with preview", () => {
      expect(contentfulWorkRandomKey(true)).toEqual([
        "contentful",
        "work",
        "random",
        "true",
      ]);
    });
  });

  describe("contentfulWorkSlugKey", () => {
    it("returns key with slug and preview", () => {
      expect(contentfulWorkSlugKey("my-project", false)).toEqual([
        "contentful",
        "work",
        "slug",
        "my-project",
        "false",
      ]);
    });
  });

  describe("contentfulWorkCategoriesKey", () => {
    it("returns key with preview", () => {
      expect(contentfulWorkCategoriesKey(true)).toEqual([
        "contentful",
        "workCategories",
        "true",
      ]);
    });
  });

  describe("contentfulWorkCategorySlugKey", () => {
    it("returns key with slug and preview", () => {
      expect(contentfulWorkCategorySlugKey("documentary", false)).toEqual([
        "contentful",
        "workCategory",
        "documentary",
        "false",
      ]);
    });
  });

  describe("contentfulEditorsAllKey", () => {
    it("returns key with preview", () => {
      expect(contentfulEditorsAllKey(false)).toEqual([
        "contentful",
        "editors",
        "all",
        "false",
      ]);
    });
  });

  describe("contentfulEditorSlugKey", () => {
    it("returns key with slug and preview", () => {
      expect(contentfulEditorSlugKey("john-smith", true)).toEqual([
        "contentful",
        "editor",
        "john-smith",
        "true",
      ]);
    });
  });

  describe("contentfulEditorsMainPageKey", () => {
    it("returns key with preview", () => {
      expect(contentfulEditorsMainPageKey(false)).toEqual([
        "contentful",
        "editors",
        "mainPage",
        "false",
      ]);
    });
  });
});
