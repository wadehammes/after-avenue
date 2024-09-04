"use client";

import classNames from "classnames";
import Image from "next/image";
import styles from "src/components/LogoTicker/LogoTicker.module.css";
import { ContentfulAsset } from "src/contentful/parseContentfulAsset";

interface LogoTickerProps {
  logos: (ContentfulAsset | null)[];
}

export const LogoTicker = (props: LogoTickerProps) => {
  const { logos } = props;

  return (
    <div className={classNames(styles.logoTicker, "container")}>
      {logos.map((logo) =>
        logo ? (
          <div key={logo.alt}>
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={100}
              height={100}
            />
          </div>
        ) : null,
      )}
    </div>
  );
};
