import { ContentRenderer } from "src/components/ContentRenderer/ContentRenderer.component";
import { Section } from "src/components/Section/Section.component";
import { SectionType } from "src/contentful/parseSections";

interface SectionRendererProps {
  sections: (SectionType | null)[];
}

export const SectionRenderer = (props: SectionRendererProps) => {
  const { sections } = props;

  if (sections.length === 0) {
    return null;
  }

  return sections.map((section) => {
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
  });
};
