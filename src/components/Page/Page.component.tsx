import parse from "html-react-parser";
import type { HTMLAttributes } from "react";
import { SectionRenderer } from "src/components/SectionRenderer/SectionRenderer.component";
import type { Page } from "src/contentful/getPages";

interface PageComponentProps extends HTMLAttributes<HTMLDivElement> {
  fields: Page;
}

export const PageComponent = (props: PageComponentProps) => {
  const { fields, children } = props;

  const { sections, pageDisplayTitle, pageSubtitle, pageTitle } = fields;

  return (
    <div className="container column">
      <div className="page-container">
        {pageDisplayTitle ? (
          <header className="page-header">
            <h1 className="page-title">{parse(pageDisplayTitle)}</h1>
            {pageSubtitle ? (
              <p className="subtitle">{parse(pageSubtitle)}</p>
            ) : null}
          </header>
        ) : (
          <h1 className="hidden-title">{pageTitle}</h1>
        )}
        {children}
        <SectionRenderer sections={sections} />
      </div>
    </div>
  );
};
