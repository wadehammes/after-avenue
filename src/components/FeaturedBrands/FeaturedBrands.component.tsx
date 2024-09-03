import styles from "src/components/FeaturedBrands/FeaturedBrands.module.css";
import { featuredBrands } from "src/components/FeaturedBrands/featuredBrands";

export const FeaturedBrands = () => {
  return (
    <div className={styles.featuredBrandsContainer}>
      <div className={styles.featuredBrands}>
        {[...featuredBrands, ...featuredBrands, ...featuredBrands].map(
          (brand, index) => {
            const { name, icon: Icon, maxWidth = "100%" } = brand;
            return (
              <div key={`${name}-${index}`} className={styles.brandItem}>
                <Icon style={{ width: maxWidth, height: "auto" }} />
              </div>
            );
          },
        )}
      </div>
    </div>
  );
};
