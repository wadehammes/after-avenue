import classNames from "classnames";
import parse from "html-react-parser";
import styles from "src/components/AboutPage/AboutPage.module.css";
import { ContactFooter } from "src/components/ContactFooter/ContactFooter.component";
import { ContentRenderer } from "src/components/ContentRenderer/ContentRenderer.component";
import { Section } from "src/components/Section/Section.component";
import { ServicesMarquee } from "src/components/ServicesMarquee/ServicesMarquee.component";
import StyledButtonLink from "src/components/StyledButton/StyledButtonLink.component";
import { Page } from "src/contentful/getPages";
import {
  ComponentSlideEntry,
  parseContentfulComponentSlide,
} from "src/contentful/parseComponentSlide";
import AfterAvenueBrandmark from "src/icons/AfterAvenueBrandmark.svg";

interface AboutPageProps {
  pageFields: Page;
}

export const AboutPage = (props: AboutPageProps) => {
  const { pageFields } = props;
  const { contactFooterButtonText, contactFooterTitle, sections } = pageFields;

  if (!sections || sections.length === 0) {
    return null;
  }

  const heroSection = sections.find((section) =>
    section ? section.slug === "about-hero" : null,
  );
  const collaborateSection = sections.find((section) =>
    section ? section.slug === "about-collaboration" : null,
  );
  const partnershipSection = sections.find((section) =>
    section ? section.slug === "about-partnerships" : null,
  );

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
      <div id="about-collaboration" />
      {collaborateSlideFields ? (
        <Section
          section={collaborateSection}
          sectionHeaderAlignment="center"
          style={{ paddingBottom: "8rem" }}
        >
          <div className="container column">
            <div
              className={classNames(styles.aboutConversation, "speechBubble")}
            >
              {parse(conversation)}
            </div>
          </div>
        </Section>
      ) : null}
      <Section>
        <div className={styles.marqueeContainer}>
          <ServicesMarquee />
          <ServicesMarquee reverse />
        </div>
      </Section>
      {partnershipSlideFields ? (
        <Section
          section={partnershipSection}
          sectionHeaderAlignment="left"
          className={styles.partnershipSection}
        >
          <div className="container column">
            <div className={styles.partnershipCopy}>
              {parse(partnershipCopy)}
              <div
                className="buttonContainer"
                style={{
                  textAlign: "left",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <StyledButtonLink
                  href="/editors"
                  variant="outlined"
                  color="light"
                >
                  Meet our Editors
                </StyledButtonLink>
              </div>
            </div>
          </div>
        </Section>
      ) : null}
      <div className={styles.afterAvenueBrandmark}>
        <AfterAvenueBrandmark />
      </div>
      <ContactFooter
        title={contactFooterTitle || "Let's <span>get after it.</span>"}
        buttonText={contactFooterButtonText || "Contact Us Today"}
      />
    </>
  );
};
