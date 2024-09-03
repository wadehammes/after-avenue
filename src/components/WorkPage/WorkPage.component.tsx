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

  const { pageDescription, pageDisplayTitle, pageTitle } = pageFields;

  return (
    <div className="container column">
      <div className="page-container">
        <header className="page-header">
          <h1 className="page-title">{pageDisplayTitle ?? pageTitle}</h1>
          {pageDescription ? (
            <p className="subtitle">{pageDescription}</p>
          ) : null}
        </header>
        <div className={styles.workList}>
          {allWork.map((work) => (
            <WorkCard
              key={work.workSlug}
              work={work}
              title={work.workClient}
              subtitle={work.workTitle}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
