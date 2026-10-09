"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";
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

  const setOpen = useEffectEvent((open: boolean) => {
    setIsOpen(open);
    document.body.style.overflow = open ? "hidden" : "auto";
  });

  const onScroll = useEffectEvent(() => {
    setScrolled(window.scrollY >= 50);
  });

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });

    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useEffectEvent(() => {
    setOpen(false);
  });

  useEffect(() => {
    window.addEventListener("resize", closeMenu);

    return () => {
      window.removeEventListener("resize", closeMenu);
    };
  }, []);

  return (
    <nav
      id="top"
      className={classNames(styles.navigation, {
        [styles.scrolled]: scrolled,
        [styles.noBackground]:
          pathname.includes("editors") || pathname.includes("about"),
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
              onClick={() => setOpen(!isOpen)}
              aria-label="Toggle mobile navigation"
            >
              <Menu className={styles.menu} />
            </button>
          </div>
        ) : null}
      </div>
      <MobileNavigationDrawer
        navigationItems={navigationItems}
        visible={isOpen}
        closeMenu={closeMenu}
      />
    </nav>
  );
};
