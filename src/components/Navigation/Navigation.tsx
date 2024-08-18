"use client";

import classNames from "classnames";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import styles from "src/components/Navigation/Navigation.module.css";
import { StyledButtonLink } from "src/components/StyledButton/StyledButtonLink.component";

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  const listenScrollEvent = useCallback(() => {
    if (window.scrollY < 50) {
      return setScrolled(false);
    } else {
      return setScrolled(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);

    listenScrollEvent();

    return () => window.removeEventListener("scroll", listenScrollEvent);
  }, [listenScrollEvent]);

  return (
    <nav
      className={classNames(styles.navigation, { [styles.scrolled]: scrolled })}
    >
      <div className="container">
        <Link
          href="/"
          className={styles.logo}
          title="After Avenue"
          aria-label="After Avenue"
        >
          After Avenue
        </Link>
        <ul className={styles.navItemList}></ul>
        <StyledButtonLink variant="outlined" href="/contact">
          Contact Us
        </StyledButtonLink>
      </div>
    </nav>
  );
};
