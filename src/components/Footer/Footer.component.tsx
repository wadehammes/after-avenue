import classNames from "classnames";
import styles from "src/components/Footer/Footer.module.css";
import AfterAvenueBrandmark from "src/icons/AfterAvenueBrandmark.svg";
import Instagram from "src/icons/Instagram.icon.svg";
import Twitter from "src/icons/Twitter.icon.svg";

export const Footer = () => (
  <footer id="footer" className={classNames(styles.footer)}>
    <div className={styles.footerContainer}>
      <span className={styles.copyright}>
        <AfterAvenueBrandmark />
        &copy; {new Date().getFullYear()} After Avenue
      </span>
      <div className={styles.email}>
        <a href="mailto:hello@afteravenue.com" title="Email" aria-label="Email">
          hello@afteravenue.com
        </a>
      </div>
      <div className={styles.socialList}>
        <a
          href="https://instagram.com/afteravenue"
          rel="noopener noreferrer"
          title="Instagram"
        >
          <Instagram className={styles.socialIcon} />
        </a>
        <a
          href="https://twitter.com/afteravenue"
          rel="noopener noreferrer"
          title="Twitter"
        >
          <Twitter className={styles.twitterIcon} />
        </a>
      </div>
    </div>
  </footer>
);
