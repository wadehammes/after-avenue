import { ContactForm } from "src/components/ContactForm/ContactForm.component";
import styles from "src/components/ContactPage/ContactPage.module.css";
import { Page } from "src/contentful/getPages";

interface ContactPageProps {
  pageFields: Page;
}

export const ContactPage = (props: ContactPageProps) => {
  const { pageFields } = props;
  const { pageTitle, pageDisplayTitle, pageDescription } = pageFields;

  return (
    <div className="container column">
      <header className="page-header">
        <h1>{pageDisplayTitle ?? pageTitle}</h1>
        <p className="subtitle">{pageDescription}</p>
      </header>
      <div className={styles.contactPageContainer}>
        <ContactForm />
      </div>
    </div>
  );
};
