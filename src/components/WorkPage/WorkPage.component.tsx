import React from "react";
import { WorkCard } from "src/components/WorkCard/WorkCard.component";
import styles from "src/components/WorkPage/WorkPage.module.css";
import type { Page } from "src/contentful/getPages";
import type { Work } from "src/contentful/getWork";

interface WorkPageProps {
  pageFields: Page;
  allWork: Work[];
}

export const WorkPage = (props: WorkPageProps) => {
  const { pageFields, allWork } = props;

  return (
    <div className="container column">
      <div className="page-container">
        <header className="page-header">
          <h1 className="page-title">{pageFields.pageTitle}</h1>
          <p className="subtitle">{pageFields.pageDescription}</p>
        </header>
        <div className={styles.workList}>
          {allWork.map((work) => (
            <WorkCard key={work.workSlug} work={work} />
          ))}
        </div>
      </div>
    </div>
  );
};
