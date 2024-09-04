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
  const { pageDisplayTitle, pageSubtitle } = pageFields;

  return (
    <>
      <section className={styles.featuredWorkContainer}>
        {featuredWork.map((work) => (
          <FeaturedWork fields={work} key={work.workSlug} />
        ))}
        <div className={styles.buttonContainer}>
          <StyledButtonLink href="/work" variant="contained" color="dark">
            Show Me More
          </StyledButtonLink>
        </div>
      </section>
      <section className={styles.homeSection}>
        <div className="container column">
          <header className="section-header">
            <h1>{pageDisplayTitle}</h1>
            <p>{pageSubtitle}</p>
          </header>
          <FeaturedBrands />
        </div>
      </section>
    </>
  );
};
