import { ContentRenderer } from "src/components/ContentRenderer/ContentRenderer.component";
import { Section } from "src/components/Section/Section.component";
import type { SectionType } from "src/contentful/parseSections";

interface SectionRendererProps {
  sections: (SectionType | null)[];
  noPadding?: boolean;
  isEditorsPagePublished?: boolean;
}

export const SectionRenderer = ({
  sections,
  noPadding,
  isEditorsPagePublished = false,
  ...rest
}: SectionRendererProps) => {
  if (sections.length === 0) {
    return null;
  }

  return sections
    .filter((section): section is SectionType => section !== null)
    .map((section, index) => (
      <Section
        key={section.id}
        section={section}
        noPadding={noPadding}
        sectionHeaderAlignment={section.sectionHeaderAlignment}
        {...rest}
      >
        {section.content
          .filter(
            (content): content is NonNullable<typeof content> =>
              content !== null,
          )
          .map((content) => (
            <ContentRenderer
              key={content.sys.id}
              content={content}
              index={index}
              isEditorsPagePublished={isEditorsPagePublished}
            />
          ))}
      </Section>
    ));
};
