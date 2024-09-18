import styles from "src/components/EditorsEntryPage/EditorsEntryPage.module.css";
import { EditorsEntryPageIntro } from "src/components/EditorsEntryPage/EditorsEntryPageIntro.component";
import StyledButtonLink from "src/components/StyledButton/StyledButtonLink.component";
import { WorkCard } from "src/components/WorkCard/WorkCard.component";
import { Editor } from "src/contentful/getEditors";
import { Work } from "src/contentful/getWork";

interface EditorsEntryPageProps {
  editorEntry: Editor;
  editorsWork: Work[];
}

export const EditorsEntryPage = (props: EditorsEntryPageProps) => {
  const { editorEntry, editorsWork } = props;

  return (
    <div className={styles.editorsEntryPage}>
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
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
      <div className={styles.editorsEntryPageFooter}>
        <h2>We're the last stop before your story begins.</h2>
        <StyledButtonLink href="/contact" variant="contained" color="dark">
          Contact Us Today
        </StyledButtonLink>
      </div>
    </div>
  );
};
