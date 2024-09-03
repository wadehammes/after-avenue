import classNames from "classnames";
import parse from "html-react-parser";
import { ContentRenderer } from "src/components/ContentRenderer/ContentRenderer.component";
import styles from "src/components/Page/Page.module.css";
import { Section } from "src/components/Section/Section.component";
import { Page } from "src/contentful/getPages";

interface PageComponentProps {
  fields: Page;
}

export const PageComponent = (props: PageComponentProps) => {
  const { fields } = props;

  const { pageTitle, sections, pageDisplayTitle } = fields;

  return (
    <article className={classNames(styles.page, "container")}>
      <header className="page-header">
        <h1>{parse(pageDisplayTitle ?? pageTitle)}</h1>
      </header>
      {sections.map((section) => {
        if (!section) {
          return null;
        }

        return (
          <Section key={section.id}>
            {section.content.map((content) => {
              if (!content) {
                return null;
              }

              return <ContentRenderer key={content.sys.id} content={content} />;
            })}
          </Section>
        );
      })}
    </article>
  );
};

export default PageComponent;
