"use client";

import parse from "html-react-parser";
import Link from "next/link";
import { ContactForm } from "src/components/ContactForm/ContactForm.component";
import styles from "src/components/ContactPage/ContactPage.module.css";
import { Page } from "src/contentful/getPages";
import { useGlobalVariables } from "src/context/globalContext.context";

interface ContactPageProps {
  pageFields: Page;
}

export const ContactPage = (props: ContactPageProps) => {
  const { pageFields } = props;
  const { pageTitle, pageDisplayTitle, pageSubtitle } = pageFields;

  const globalVariables = useGlobalVariables();

  return (
    <div className="container column">
      <header className="page-header">
        <h1>{parse(pageDisplayTitle ?? pageTitle)}</h1>
        {pageSubtitle ? <p className="subtitle">{pageSubtitle}</p> : null}
      </header>
      <div className={styles.contactPageContainer}>
        <div className={styles.contactAddressContainer}>
          <div className={styles.contactAddress}>
            <p>{globalVariables.companyName}</p>
            {globalVariables.address ? <p>{globalVariables.address}</p> : null}
            {globalVariables.addressLine2 ? (
              <p>{globalVariables.addressLine2}</p>
            ) : null}
          </div>
          <Link href={`mailto:${globalVariables.email}`}>
            {globalVariables.email}
          </Link>
          <Link href={`tel:${globalVariables.phoneNumber}`}>
            {globalVariables.phoneNumber}
          </Link>
        </div>
        <ContactForm />
      </div>
    </div>
  );
};
