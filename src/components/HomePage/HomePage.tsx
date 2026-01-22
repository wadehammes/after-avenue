"use client";

import classNames from "classnames";
import parse from "html-react-parser";
import { FeaturedBrands } from "src/components/FeaturedBrands/FeaturedBrands.component";
import { FeaturedWork } from "src/components/FeaturedWork/FeaturedWork.component";
import styles from "src/components/HomePage/HomePage.module.css";
import StyledButtonLink from "src/components/StyledButton/StyledButtonLink.component";
import type { Page } from "src/contentful/getPages";
import type { Work } from "src/contentful/getWork";

interface HomePageProps {
  featuredWork: Work[];
  pageFields: Page;
}

export const HomePage = (props: HomePageProps) => {
  const { featuredWork, pageFields } = props;
  const {
    pageDisplayTitle,
    pageTitle,
    contactFooterTitle,
    contactFooterButtonText,
  } = pageFields;

  const title = `After Avenue | ${pageTitle}`;

  return (
    <>
      <section className={styles.homeTitleSection}>
        <div className="container column">
          {pageDisplayTitle ? (
            <header className="section-header">
              <h1 className="hidden-title">{title}</h1>
              <h2 className={classNames(styles.homeMainTitle, styles.animated)}>
                {parse(pageDisplayTitle)}
              </h2>
            </header>
          ) : null}
        </div>
      </section>
      <section className={styles.featuredWorkContainer}>
        <div className="container column">
          {featuredWork.map((work) => (
            <FeaturedWork fields={work} key={work.workSlug} />
          ))}
        </div>

        <div className="buttonContainer">
          <StyledButtonLink href="/work" variant="outlined" color="dark">
            Discover More
          </StyledButtonLink>
        </div>
      </section>
      <section>
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
