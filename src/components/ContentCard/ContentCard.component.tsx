import classNames from "classnames";
import styles from "src/components/ContentCard/ContentCard.module.css";
import { Media } from "src/components/Media/Media.component";
import { StyledButtonLink } from "src/components/StyledButton/StyledButtonLink.component";
import type { ContentCard as ContentCardType } from "src/contentful/parseContentCard";
import { RichText } from "src/contentful/richText";
import { alignmentToTextAlign } from "src/utils/styleHelpers";

interface ContentCardProps {
  card: ContentCardType;
}

export const ContentCard = ({ card }: ContentCardProps) => {
  const {
    image,
    copy,
    copyAlignment,
    style,
    imageStyle,
    editorCta,
    externalCta,
  } = card;

  const ctaHref = editorCta?.editorSlug
    ? `/editors/${editorCta.editorSlug}`
    : externalCta || null;

  const ctaText = editorCta?.editorName ? "View portfolio" : "Learn More";

  return (
    <div
      className={classNames(styles.contentCard, {
        [styles.cardStyle]: style === "Card",
        [styles.noStyle]: style === "No Style",
      })}
    >
      {image && (
        <div
          className={classNames(styles.imageContainer, {
            [styles.circleImage]: imageStyle === "Circle",
            [styles.regularImage]: imageStyle === "Regular",
          })}
        >
          <Media media={image} />
        </div>
      )}
      {copy && (
        <div
          className={styles.copyContainer}
          style={{ textAlign: alignmentToTextAlign(copyAlignment) }}
        >
          <RichText document={copy} />
        </div>
      )}
      {ctaHref && (
        <div className={styles.ctaContainer}>
          <StyledButtonLink href={ctaHref} variant="outlined" color="dark">
            {ctaText}
          </StyledButtonLink>
        </div>
      )}
    </div>
  );
};
