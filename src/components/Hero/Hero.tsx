import classNames from "classnames";
import styles from "src/components/Hero/Hero.module.css";
import { StyledButtonLink } from "src/components/StyledButton/StyledButtonLink.component";

interface HeroProps {
  h1: string;
  subtitle?: string;
  buttonProps?: {
    label: string;
    href: string;
  };
  reducedHeight?: boolean;
}

export const Hero = (props: HeroProps) => {
  const { h1, subtitle, buttonProps, reducedHeight } = props;

  return (
    <div
      className={classNames("hero", styles.hero, {
        [styles.reducedHeight]: reducedHeight,
      })}
    >
      <div className="container column">
        <header className="page-header">
          {h1 ? <h1>{h1}</h1> : null}
          {subtitle ? (
            <p className={classNames("subtitle", styles.heroSubtitle)}>
              {subtitle}
            </p>
          ) : null}
          {buttonProps ? (
            <div className={styles.buttonContainer}>
              <StyledButtonLink
                href={buttonProps.href}
                variant="contained"
                color="dark"
              >
                {buttonProps.label}
              </StyledButtonLink>
            </div>
          ) : null}
        </header>
      </div>
    </div>
  );
};
