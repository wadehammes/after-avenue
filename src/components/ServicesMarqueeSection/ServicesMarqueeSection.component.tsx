import { Section } from "src/components/Section/Section.component";
import { ServicesMarquee } from "src/components/ServicesMarquee/ServicesMarquee.component";
import styles from "src/components/ServicesMarqueeSection/ServicesMarqueeSection.module.css";

export const ServicesMarqueeSection = () => {
  return (
    <Section>
      <div className={styles.marqueeContainer}>
        <ServicesMarquee />
        <ServicesMarquee reverse />
      </div>
    </Section>
  );
};
