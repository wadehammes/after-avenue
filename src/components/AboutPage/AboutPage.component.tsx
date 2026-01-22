import styles from "src/components/AboutPage/AboutPage.module.css";
import { ContactFooter } from "src/components/ContactFooter/ContactFooter.component";
import { SectionRenderer } from "src/components/SectionRenderer/SectionRenderer.component";
import type { Page } from "src/contentful/getPages";
import AfterAvenueBrandmark from "src/icons/AfterAvenueBrandmark.svg";

interface AboutPageProps {
  isEditorsPagePublished?: boolean;
  pageFields: Page;
}

export const AboutPage = (props: AboutPageProps) => {
  const { isEditorsPagePublished = false, pageFields } = props;
  const { contactFooterButtonText, contactFooterTitle, sections } = pageFields;

  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <>
      <SectionRenderer
        sections={sections}
        isEditorsPagePublished={isEditorsPagePublished}
      />
      <div className={styles.afterAvenueBrandmark}>
        <AfterAvenueBrandmark />
      </div>
      <ContactFooter
        title={contactFooterTitle || "Let's <span>get after it.</span>"}
        buttonText={contactFooterButtonText || "Contact Us Today"}
      />
    </>
  );
};
