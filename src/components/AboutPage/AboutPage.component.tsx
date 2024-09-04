import styles from "src/components/AboutPage/AboutPage.module.css";
import { SectionRenderer } from "src/components/SectionRenderer/SectionRenderer.component";
import { Page } from "src/contentful/getPages";
interface AboutPageProps {
  pageFields: Page;
}

export const AboutPage = (props: AboutPageProps) => {
  const { pageFields } = props;
  const { sections } = pageFields;

  return (
    <>
      <section className="container column">
        <header className={styles.aboutPageHeader}>
          <h1>We are a full-service post-production company</h1>
        </header>
      </section>

      <SectionRenderer sections={sections} />
    </>
  );
};
