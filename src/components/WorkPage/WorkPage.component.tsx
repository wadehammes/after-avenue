import { ContactFooter } from "src/components/ContactFooter/ContactFooter.component";
import { WorkCard } from "src/components/WorkCard/WorkCard.component";
import styles from "src/components/WorkPage/WorkPage.module.css";
import type { Page } from "src/contentful/getPages";
import type { Work } from "src/contentful/getWork";
import { WorkCategory } from "src/contentful/getWorkCategories";

interface WorkPageProps {
  allWork: Work[];
  allWorkCategories: WorkCategory[];
  pageFields: Page;
}

export const WorkPage = (props: WorkPageProps) => {
  const { pageFields, allWork } = props;
  const {
    contactFooterButtonText,
    contactFooterTitle,
    pageSubtitle,
    pageDisplayTitle,
    pageTitle,
  } = pageFields;

  return (
    <div className="container column">
      <div className="page-container">
        <header className="page-header">
          {pageDisplayTitle ? (
            <h1 className="page-title">{pageDisplayTitle}</h1>
          ) : (
            <h1 className="hidden-title">{pageTitle}</h1>
          )}
          {pageSubtitle ? <p className="subtitle">{pageSubtitle}</p> : null}
        </header>
        <div className={styles.workList}>
          {allWork.map((work) => (
            <WorkCard
              key={work.workSlug}
              work={work}
              title={work.workClient}
              subtitle={work.workTitle}
              autoPlay={false}
            />
          ))}
        </div>
        <ContactFooter
          title={
            contactFooterTitle || "In pursuit of <span>what's next?</span>"
          }
          buttonText={contactFooterButtonText || "Work With Us"}
        />
      </div>
    </div>
  );
};
