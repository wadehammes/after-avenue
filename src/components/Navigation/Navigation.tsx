"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styles from "src/components/Navigation/Navigation.module.css";
import { StyledButtonLink } from "src/components/StyledButton/StyledButtonLink.component";
import type { Page } from "src/contentful/getPages";
import AfterAvenueLogo from "src/icons/AfterAvenue.svg";

interface NavigationProps {
  navigationItems: Partial<Page | null>[];
}

export const Navigation = (props: NavigationProps) => {
  const { navigationItems } = props;

  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);

  const listenScrollEvent = useCallback(() => {
    if (window.scrollY < 50) {
      return setScrolled(false);
    }

    return setScrolled(true);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);

    listenScrollEvent();

    return () => window.removeEventListener("scroll", listenScrollEvent);
  }, [listenScrollEvent]);

  return (
    <nav
      id="top"
      className={classNames(styles.navigation, {
        [styles.scrolled]: scrolled,
      })}
    >
      <div className="container">
        <Link
          href="/"
          className={styles.logo}
          title="After Avenue"
          aria-label="After Avenue"
        >
          <AfterAvenueLogo />
        </Link>
        {navigationItems.length > 0 ? (
          <ul className={styles.navItemList}>
            {navigationItems.map((page) =>
              page?.pageSlug ? (
                <li key={page.pageSlug}>
                  <Link
                    href={`/${page.pageSlug}`}
                    className={classNames(styles.navItem, {
                      [styles.active]: pathname.includes(page.pageSlug),
                    })}
                    title={page.pageTitle}
                    aria-label={page.pageTitle}
                  >
                    {page.pageTitle}
                  </Link>
                </li>
              ) : null,
            )}
            <li>
              <Link
                href="/contact"
                className={styles.navItem}
                title="Contact Us"
                aria-label="Contact Us"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        ) : null}
      </div>
    </nav>
  );
};
