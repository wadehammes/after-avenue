import parse from "html-react-parser";
import { HTMLAttributes } from "react";
import { SectionRenderer } from "src/components/SectionRenderer/SectionRenderer.component";
import { Page } from "src/contentful/getPages";

interface PageComponentProps extends HTMLAttributes<HTMLDivElement> {
  fields: Page;
}

export const PageComponent = (props: PageComponentProps) => {
  const { fields, children } = props;

  const { sections, pageDisplayTitle } = fields;

  return (
    <>
      {pageDisplayTitle ? (
        <header className="page-header">
          <h1>{parse(pageDisplayTitle)}</h1>
        </header>
      ) : null}
      {children}
      <SectionRenderer sections={sections} />
    </>
  );
};

export default PageComponent;
