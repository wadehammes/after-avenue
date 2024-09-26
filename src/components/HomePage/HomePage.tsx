import parse from "html-react-parser";
import Script from "next/script";
import { WebPage } from "schema-dts";
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
  const {
    pageDisplayTitle,
    contactFooterTitle,
    contactFooterButtonText,
    pageDescription,
    publishDate,
    updatedAt,
  } = pageFields;

  const jsonLd: WebPage = {
    "@type": "WebPage",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 0,
          name: "Home",
        },
      ],
    },
    name: "After Avenue",
    description: pageDescription,
    datePublished: publishDate,
    dateModified: updatedAt,
    publisher: {
      "@type": "Organization",
      name: "After Avenue",
    },
  };

  return (
    <>
      <section className={styles.featuredWorkContainer}>
        <Script
          id="homeSchema"
          type="application/ld+json"
          strategy="beforeInteractive"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ul className={styles.workList}>
          {featuredWork.map((work) => (
            <li key={work.workSlug} aria-label={work.workClient}>
              <FeaturedWork fields={work} />
            </li>
          ))}
        </ul>

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
