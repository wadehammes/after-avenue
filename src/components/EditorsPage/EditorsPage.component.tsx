import { EditorsCard } from "src/components/EditorsCard/EditorsCard.component";
import styles from "src/components/EditorsPage/EditorsPage.module.css";
import { Editor } from "src/contentful/getEditors";
import { Page } from "src/contentful/getPages";

interface EditorsPageProps {
  pageFields: Page;
  editors: Editor[];
}

export const EditorsPage = (props: EditorsPageProps) => {
  const { editors, pageFields } = props;
  const { pageTitle, pageDescription } = pageFields;

  return (
    <div className="container column">
      <header className="page-header">
        <h1>{pageTitle}</h1>
        {pageDescription ? <p className="subtitle">{pageDescription}</p> : null}
      </header>
      <div className={styles.editorsList}>
        {editors.map((editor) => (
          <EditorsCard key={editor.editorSlug} editor={editor} />
        ))}
      </div>
    </div>
  );
};
