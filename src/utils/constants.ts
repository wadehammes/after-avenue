export const NAVIGATION_ID = "navigation-global";

export const HOME_PAGE_SLUG = "home";
export const WORK_SLUG = "work";
export const EDITORS_PAGE_SLUG = "editors";
const CONTACT_PAGE_SLUG = "contact";
export const TEST_PAGE_SLUG = "test-page";

export const EXCLUDED_PAGE_SLUGS_FROM_BUILD = [
  CONTACT_PAGE_SLUG,
  EDITORS_PAGE_SLUG,
  HOME_PAGE_SLUG,
  WORK_SLUG,
];

/** `useInView` margin for lazy video mount and scroll entrance near the viewport. */
export const VIDEO_IN_VIEW_ROOT_MARGIN = "150px 0px";

/** Mount embeds ~one viewport ahead so Vimeo can load before scroll-in. */
export const VIDEO_MOUNT_ROOT_MARGIN = "80% 0px";
