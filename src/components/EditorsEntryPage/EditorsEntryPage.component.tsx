import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import Script from "next/script";
import { WebPage } from "schema-dts";
import { ContactFooter } from "src/components/ContactFooter/ContactFooter.component";
import styles from "src/components/EditorsEntryPage/EditorsEntryPage.module.css";
import { EditorsEntryPageIntro } from "src/components/EditorsEntryPage/EditorsEntryPageIntro.component";
import { WorkCard } from "src/components/WorkCard/WorkCard.component";
import { Editor } from "src/contentful/getEditors";
import { Work } from "src/contentful/getWork";

interface EditorsEntryPageProps {
  editorEntry: Editor;
  editorsWork: Work[];
}

export const EditorsEntryPage = (props: EditorsEntryPageProps) => {
  const { editorEntry, editorsWork } = props;

  const { editorName, editorBio, publishDate, updatedAt } = editorEntry;

  const jsonLd: WebPage = {
    "@type": "WebPage",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
        },
        {
          "@type": "ListItem",
          position: 1,
          name: "Editors",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: editorName,
        },
      ],
    },
    name: editorName,
    description: editorBio ? documentToPlainTextString(editorBio) : "",
    datePublished: publishDate,
    dateModified: updatedAt,
    publisher: {
      "@type": "Organization",
      name: "After Avenue",
    },
  };

  return (
    <div className={styles.editorsEntryPage}>
      <Script
        id="editorsSchema"
        type="application/ld+json"
        strategy="beforeInteractive"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container column">
        <EditorsEntryPageIntro editorEntry={editorEntry} />
        {editorsWork.length > 0 ? (
          <div className={styles.editorsCredits}>
            <h3>Editorial Credits</h3>
            <ul className={styles.editorsCreditsList}>
              {editorsWork.map((work) => {
                if (!work) {
                  return null;
                }

                return (
                  <li key={work.workSlug}>
                    <WorkCard
                      work={work}
                      title={work.workTitle}
                      subtitle={work.workClient}
                      autoPlay={false}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
      <ContactFooter />
    </div>
  );
};
