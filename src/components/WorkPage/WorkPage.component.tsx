import { WebPage } from "schema-dts";
import { ContactFooter } from "src/components/ContactFooter/ContactFooter.component";
import PageComponent from "src/components/Page/Page.component";
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
  const { contactFooterButtonText, contactFooterTitle } = pageFields;

  const jsonLd: WebPage = {
    "@type": "WebPage",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 0,
          name: "Home",
        },
        {
          "@type": "ListItem",
          position: 1,
          name: "Work",
        },
      ],
    },
    description: pageFields.pageDescription,
    datePublished: pageFields.publishDate,
    dateModified: pageFields.updatedAt,
    name: "Work",
    publisher: {
      "@type": "Organization",
      name: "After Avenue",
    },
  };

  return (
    <PageComponent fields={pageFields}>
      <script
        id="workSchema"
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ul className={styles.workList}>
        {allWork.map((work) => (
          <li key={work.workSlug} aria-label={work.workClient}>
            <WorkCard
              work={work}
              title={work.workClient}
              subtitle={work.workTitle}
              autoPlay={false}
              controls
            />
          </li>
        ))}
      </ul>
      <ContactFooter
        title={contactFooterTitle || "In pursuit of <span>what's next?</span>"}
        buttonText={contactFooterButtonText || "Work With Us"}
      />
    </PageComponent>
  );
};
