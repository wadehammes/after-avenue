import styles from "src/components/FeaturedBrands/FeaturedBrands.module.css";
import { featuredBrands } from "src/components/FeaturedBrands/featuredBrands";

export const FeaturedBrands = () => {
  return (
    <div className={styles.featuredBrands}>
      {featuredBrands.map((brand) => {
        const { name, icon: Icon, maxWidth = "100%" } = brand;
        return (
          <div key={name}>
            <Icon style={{ width: maxWidth }} />
          </div>
        );
      })}
    </div>
  );
};
