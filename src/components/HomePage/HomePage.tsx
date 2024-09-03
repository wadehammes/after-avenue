import { ContentRenderer } from "src/components/ContentRenderer/ContentRenderer.component";
import { FeaturedBrands } from "src/components/FeaturedBrands/FeaturedBrands.component";
import { FeaturedWork } from "src/components/FeaturedWork/FeaturedWork.component";
import styles from "src/components/HomePage/HomePage.module.css";
import { Section } from "src/components/Section/Section.component";
import StyledButtonLink from "src/components/StyledButton/StyledButtonLink.component";
import type { Work } from "src/contentful/getWork";
import { SectionType } from "src/contentful/parseSections";

interface HomePageProps {
  featuredWork: Work[];
  sections: (SectionType | null)[];
}

export const HomePage = (props: HomePageProps) => {
  const { featuredWork, sections } = props;

  return (
    <>
      <section className={styles.featuredWorkContainer}>
        {featuredWork.map((work) => (
          <FeaturedWork fields={work} key={work.workSlug} />
        ))}
        <div className={styles.buttonContainer}>
          <StyledButtonLink href="/work" variant="contained" color="dark">
            View All Work
          </StyledButtonLink>
        </div>
      </section>
      <section className={styles.homeSection}>
        <div className="container column">
          <header className="section-header">
            <h1>An award-winning full-service post production company.</h1>
            <p>Telling stories that move people.</p>
          </header>
          <FeaturedBrands />
        </div>
      </section>
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
    </>
  );
};
