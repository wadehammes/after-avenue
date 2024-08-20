import Link from "next/link";
import styles from "src/components/Navigation/Navigation.module.css";
import { Page } from "src/contentful/getPages";
import AfterAvenueBrandmark from "src/icons/AfterAvenueBrandmark.svg";
import Close from "src/icons/Close.svg";

interface MobileNavigationDrawerProps {
  navigationItems: Partial<Page | null>[];
  visible: boolean;
  closeMenu?: () => void;
}

export const MobileNavigationDrawer = (props: MobileNavigationDrawerProps) => {
  const { navigationItems, visible, closeMenu } = props;

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.mobileNav}>
      <button className={styles.closeButton} type="button" onClick={closeMenu}>
        <Close className={styles.close} />
      </button>
      <Link href="/" onClick={closeMenu} className={styles.mobileNavLogo}>
        <AfterAvenueBrandmark />
      </Link>
      <div className={styles.mobileNavList}>
        {navigationItems.map((page) => {
          if (!page) {
            return null;
          }

          return (
            <Link
              href={`/${page.pageSlug}`}
              key={page.pageSlug}
              onClick={closeMenu}
            >
              {page.pageTitle}
            </Link>
          );
        })}
      </div>

      <a
        className={styles.navLink}
        href="mailto:hello@afteravenue.com"
        title="Email"
        aria-label="Email"
      >
        hello@afteravenue.com
      </a>
      <a
        className={styles.navLink}
        href="tel:(770) 289-0063"
        title="Call Us"
        aria-label="Call Us"
      >
        (770) 289-0063
      </a>
    </div>
  );
};
