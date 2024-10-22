import Link from "next/link";
import styles from "src/components/Navigation/Navigation.module.css";
import type { Page } from "src/contentful/getPages";
import { useGlobalVariables } from "src/context/globalContext.context";
import AfterAvenueBrandmark from "src/icons/AfterAvenueBrandmark.svg";
import Close from "src/icons/Close.svg";

interface MobileNavigationDrawerProps {
  navigationItems: Partial<Page | null>[];
  visible: boolean;
  closeMenu?: () => void;
}

export const MobileNavigationDrawer = (props: MobileNavigationDrawerProps) => {
  const { navigationItems, visible, closeMenu } = props;
  const { email, phoneNumber } = useGlobalVariables();

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.mobileNav}>
      <button className={styles.closeButton} type="button" onClick={closeMenu}>
        <Close className={styles.close} />
      </button>
      <Link href="/" onClick={closeMenu} className={styles.mobileNavLogo}>
        <AfterAvenueBrandmark className={styles.mobileSvg} />
      </Link>
      <nav className={styles.mobileNavList}>
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
      </nav>

      <a
        className={styles.navLink}
        href={`mailto:${email}`}
        title="Email"
        aria-label="Email"
      >
        {email}
      </a>
      <a
        className={styles.navLink}
        href="{`tel:${phoneNumber}`}"
        title="Call Us"
        aria-label="Call Us"
      >
        {phoneNumber}
      </a>
    </div>
  );
};
