import { FeaturedBrands } from "src/components/FeaturedBrands/FeaturedBrands.component";
import { FeaturedWork } from "src/components/FeaturedWork/FeaturedWork.component";
import styles from "src/components/HomePage/HomePage.module.css";
import StyledButtonLink from "src/components/StyledButton/StyledButtonLink.component";
import type { Work } from "src/contentful/getWork";

interface HomePageProps {
  featuredWork: Work[];
}

export const HomePage = (props: HomePageProps) => {
  const { featuredWork } = props;

  return (
    <>
      <div className={styles.featuredWorkContainer}>
        {featuredWork.map((work) => (
          <FeaturedWork fields={work} key={work.workSlug} />
        ))}
        <div className={styles.buttonContainer}>
          <StyledButtonLink href="/work" variant="contained" color="dark">
            View All Work
          </StyledButtonLink>
        </div>
      </div>
      <div className={styles.homeSection}>
        <div className="container column">
          <header className="section-header">
            <h1>An award-winning full-service post production company.</h1>
            <p>Telling stories that move people.</p>
          </header>
          <FeaturedBrands />
        </div>
      </div>
    </>
  );
};
