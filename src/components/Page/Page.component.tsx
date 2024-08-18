import styles from "src/components/Page/Page.module.css";
import { Page } from "src/contentful/getPages";

interface PageComponentProps {
  fields: Page;
}

export const PageComponent = (props: PageComponentProps) => {
  const { fields } = props;

  return (
    <main className={styles.page}>
      <div>
        <h1>{fields.pageTitle}</h1>
      </div>
    </main>
  );
};

export default PageComponent;
