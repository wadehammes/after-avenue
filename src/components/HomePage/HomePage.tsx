import parse from "html-react-parser";
import { FeaturedBrands } from "src/components/FeaturedBrands/FeaturedBrands.component";
import { FeaturedWork } from "src/components/FeaturedWork/FeaturedWork.component";
import styles from "src/components/HomePage/HomePage.module.css";
import StyledButtonLink from "src/components/StyledButton/StyledButtonLink.component";
import { Page } from "src/contentful/getPages";
import type { Work } from "src/contentful/getWork";

interface HomePageProps {
  featuredWork: Work[];
  pageFields: Page;
}

export const HomePage = (props: HomePageProps) => {
  const { featuredWork, pageFields } = props;
  const { pageDisplayTitle, contactFooterTitle, contactFooterButtonText } =
    pageFields;

  return (
    <>
      <section className={styles.featuredWorkContainer}>
        {featuredWork.map((work) => (
          <FeaturedWork fields={work} key={work.workSlug} />
        ))}

        <div className="buttonContainer">
          <StyledButtonLink href="/work" variant="outlined" color="dark">
            Discover More
          </StyledButtonLink>
        </div>
      </section>
      <section className={styles.homeSection}>
        <div className="container column">
          {pageDisplayTitle ? (
            <header className="section-header">
              <h1>{parse(pageDisplayTitle)}</h1>
            </header>
          ) : null}
        </div>
        <FeaturedBrands />
      </section>
      <section>
        <div className="container column">
          <div className="buttonContainer">
            <p>{contactFooterTitle}</p>
            <StyledButtonLink href="/contact" variant="outlined" color="dark">
              {contactFooterButtonText}
            </StyledButtonLink>
          </div>
        </div>
      </section>
    </>
  );
};
