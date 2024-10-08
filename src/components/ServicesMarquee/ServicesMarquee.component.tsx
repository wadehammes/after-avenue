"use client";

import { Marquee } from "src/components/Marquee/Marquee.component";
import styles from "src/components/ServicesMarquee/ServicesMarquee.module.css";
import { useGlobalVariables } from "src/context/globalContext.context";

interface ServicesMarqueeProps {
  reverse?: boolean;
}

export const ServicesMarquee = (props: ServicesMarqueeProps) => {
  const { reverse } = props;
  const { services } = useGlobalVariables();

  if (!services || services.length === 0) {
    return null;
  }

  const serviceMarqueeItems = services.map((service) => ({
    content: <div className={styles.serviceMarqueeItem}>{service}</div>,
    name: service,
  }));

  return <Marquee items={serviceMarqueeItems} reverse={reverse} />;
};
