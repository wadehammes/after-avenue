import parse from "html-react-parser";
import styles from "src/components/AboutPage/AboutPage.module.css";
import { ContactFooter } from "src/components/ContactFooter/ContactFooter.component";
import { ContentRenderer } from "src/components/ContentRenderer/ContentRenderer.component";
import { Section } from "src/components/Section/Section.component";
import StyledButtonLink from "src/components/StyledButton/StyledButtonLink.component";
import { Page } from "src/contentful/getPages";
import {
  ComponentSlideEntry,
  parseContentfulComponentSlide,
} from "src/contentful/parseComponentSlide";

interface AboutPageProps {
  pageFields: Page;
}

export const AboutPage = (props: AboutPageProps) => {
  const { pageFields } = props;
  const { contactFooterButtonText, contactFooterTitle, sections } = pageFields;

  if (!sections || sections.length === 0) {
    return null;
  }

  const heroSection = sections[0];
  const collaborateSection = sections[1];
  const partnershipSection = sections[2];

  const collaborateSlide = collaborateSection?.content[0]
    ? collaborateSection.content[0]
    : null;

  const partnershipSlide = partnershipSection?.content[0]
    ? partnershipSection.content[0]
    : null;

  const collaborateSlideFields = collaborateSlide
    ? parseContentfulComponentSlide(collaborateSlide as ComponentSlideEntry)
    : null;

  const partnershipSlideFields = partnershipSlide
    ? parseContentfulComponentSlide(partnershipSlide as ComponentSlideEntry)
    : null;

  const conversation = collaborateSlideFields?.slideCopy ?? "";

  const partnershipCopy = partnershipSlideFields?.slideCopy ?? "";

  return (
    <>
      {heroSection?.content ? (
        <Section noPadding>
          {heroSection.content.map((content, index) =>
            content ? (
              <ContentRenderer
                key={content.sys.id}
                content={content}
                index={index}
              />
            ) : null,
          )}
        </Section>
      ) : null}
      {collaborateSlideFields ? (
        <Section section={collaborateSection} sectionHeaderAlignment="center">
          <div className="container column">
            <div className={styles.aboutConversation}>
              {parse(conversation)}
            </div>
          </div>
        </Section>
      ) : null}
      {partnershipSlideFields ? (
        <Section section={partnershipSection} sectionHeaderAlignment="center">
          <div className="container column">
            <div className={styles.aboutConversation}>
              {parse(partnershipCopy)}
            </div>
            <div className="buttonContainer">
              <StyledButtonLink href="/editors" variant="outlined" color="dark">
                Meet Our Editors
              </StyledButtonLink>
            </div>
          </div>
        </Section>
      ) : null}
      <ContactFooter
        title={contactFooterTitle || "Let's <span>get after it.</span>"}
        buttonText={contactFooterButtonText || "Contact Us Today"}
      />
    </>
  );
};
