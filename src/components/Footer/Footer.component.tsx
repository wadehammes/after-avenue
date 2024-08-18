import styles from "src/components/Footer/Footer.module.css";
import Instagram from "src/icons/Instagram.icon.svg";
import Twitter from "src/icons/Twitter.icon.svg";

export const Footer = () => (
  <footer id="footer" className={styles.footer}>
    <div className="container centered">
      &copy; {new Date().getFullYear()} After Avenue
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
