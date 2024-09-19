import styles from "src/components/FeaturedBrands/FeaturedBrands.module.css";
import { featuredBrands } from "src/components/FeaturedBrands/featuredBrands";
import { Marquee } from "src/components/Marquee/Marquee.component";

export const FeaturedBrands = () => {
  return (
    <div className={styles.featuredBrandsContainer}>
      <Marquee items={featuredBrands} />
    </div>
  );
};
