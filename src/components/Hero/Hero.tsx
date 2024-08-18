import classNames from "classnames";
import parse from "html-react-parser";
import styles from "src/components/Hero/Hero.module.css";
import LeafButtonLink from "src/components/StyledButton/StyledButtonLink.component";

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
      <div className="container centered">
        <header className="page-header">
          {h1 ? <h1>{parse(h1)}</h1> : null}
          {subtitle ? (
            <p className={classNames("subtitle", styles.heroSubtitle)}>
              {parse(subtitle)}
            </p>
          ) : null}
          {buttonProps ? (
            <div className={styles.buttonContainer}>
              <LeafButtonLink href={buttonProps.href} variant="contained">
                {buttonProps.label}
              </LeafButtonLink>
            </div>
          ) : null}
        </header>
      </div>
    </div>
  );
};
