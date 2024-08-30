"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MobileNavigationDrawer } from "src/components/Navigation/MobileNavigationDrawer.component";
import styles from "src/components/Navigation/Navigation.module.css";
import type { Page } from "src/contentful/getPages";
import AfterAvenueLogo from "src/icons/AfterAvenue.svg";
import Menu from "src/icons/Menu.svg";

interface NavigationProps {
  navigationItems: Partial<Page | null>[];
}

export const Navigation = (props: NavigationProps) => {
  const { navigationItems } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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

  useEffect(() => {
    const closeMenu = () => setIsOpen(false);

    window.addEventListener("resize", closeMenu);

    return () => {
      window.removeEventListener("resize", closeMenu);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <nav
      id="top"
      className={classNames(styles.navigation, {
        [styles.scrolled]: scrolled,
        [styles.noBackground]: pathname.includes("editors"),
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
          <div className={styles.navContainer}>
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
            </ul>
            <button
              type="button"
              className={styles.mobileNavToggle}
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className={styles.menu} />
            </button>
          </div>
        ) : null}
      </div>
      <MobileNavigationDrawer
        navigationItems={navigationItems}
        visible={isOpen}
        closeMenu={() => setIsOpen(false)}
      />
    </nav>
  );
};
