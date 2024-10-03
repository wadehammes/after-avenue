import classNames from "classnames";
import type { ReactNode } from "react";
import styles from "src/components/Marquee/Marquee.module.css";

export interface MarqueeItem {
  content: ReactNode;
  maxWidth?: string;
  name: string;
}

interface MarqueeProps {
  items: MarqueeItem[];
  reverse?: boolean;
}

export const Marquee = (props: MarqueeProps) => {
  const { items, reverse } = props;

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={classNames(styles.marquee, { [styles.reverse]: reverse })}>
      <ul className={styles.marqueeContent}>
        {items.map((item) => (
          <li
            key={item.name}
            style={{ ["--max-width" as string]: item.maxWidth }}
          >
            {item.content}
          </li>
        ))}
      </ul>
      <ul className={styles.marqueeContent} aria-hidden="true">
        {items.map((item) => (
          <li
            key={item.name}
            style={{ ["--max-width" as string]: item.maxWidth }}
          >
            {item.content}
          </li>
        ))}
      </ul>
      <ul className={styles.marqueeContent} aria-hidden="true">
        {items.map((item) => (
          <li
            key={item.name}
            style={{ ["--max-width" as string]: item.maxWidth }}
          >
            {item.content}
          </li>
        ))}
      </ul>
    </div>
  );
};
