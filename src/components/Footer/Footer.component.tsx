"use client";

import classNames from "classnames";
import Link from "next/link";
import styles from "src/components/Footer/Footer.module.css";
import { useGlobalVariables } from "src/context/globalContext.context";
import AfterAvenueBrandmark from "src/icons/AfterAvenueBrandmark.svg";
import Instagram from "src/icons/Instagram.icon.svg";
import LinkedIn from "src/icons/LinkedIn.svg";
import Twitter from "src/icons/Twitter.icon.svg";

export const Footer = () => {
  const globalVariables = useGlobalVariables();

  const { instagramUrl, linkedInUrl, twitterUrl } = globalVariables;

  return (
    <footer id="footer" className={classNames(styles.footer)}>
      <div className="container column">
        <div className={styles.footerContainer}>
          <span className={styles.copyright} style={{ order: 1 }}>
            &copy; {new Date().getFullYear()} After Avenue
          </span>
          <div className={styles.item} style={{ order: 2 }}>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </div>
          <div className={classNames(styles.item, styles.logo)}>
            <Link href="#top">
              <AfterAvenueBrandmark />
            </Link>
          </div>
          <div className={styles.item} style={{ order: 4 }}>
            <Link href="/contact">Contact Us</Link>
          </div>
          <div className={styles.socialList} style={{ order: 5 }}>
            <a href={linkedInUrl} rel="noopener noreferrer" title="LinkedIn">
              <LinkedIn className={styles.socialIcon} />
            </a>
            <a href={instagramUrl} rel="noopener noreferrer" title="Instagram">
              <Instagram className={styles.socialIcon} />
            </a>
            <a href={twitterUrl} rel="noopener noreferrer" title="Twitter">
              <Twitter className={styles.twitterIcon} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
