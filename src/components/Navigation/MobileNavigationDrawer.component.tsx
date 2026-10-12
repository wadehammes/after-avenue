"use client";

import { Dialog } from "@base-ui/react/dialog";
import Link from "next/link";
import styles from "src/components/Navigation/Navigation.module.css";
import type { Page } from "src/contentful/getPages";
import { useGlobalVariables } from "src/context/globalContext.context";
import AfterAvenueBrandmark from "src/icons/AfterAvenueBrandmark.svg";
import Close from "src/icons/Close.svg";

interface MobileNavigationDrawerProps {
  closeMenu?: () => void;
  navigationItems: Partial<Page | null>[];
}

export const MobileNavigationDrawer = (props: MobileNavigationDrawerProps) => {
  const { navigationItems, closeMenu } = props;
  const { email, phoneNumber } = useGlobalVariables();

  return (
    <>
      <Dialog.Title className="hidden-title">Site navigation</Dialog.Title>
      <Dialog.Close
        aria-label="Close menu"
        className={styles.closeButton}
        type="button"
      >
        <Close className={styles.close} />
      </Dialog.Close>
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

      <Link
        className={styles.navLink}
        href={`mailto:${email}`}
        title="Email"
        aria-label="Email"
      >
        {email}
      </Link>
      <Link
        className={styles.navLink}
        href={`tel:${phoneNumber}`}
        title="Call Us"
        aria-label="Call Us"
      >
        {phoneNumber}
      </Link>
    </>
  );
};
