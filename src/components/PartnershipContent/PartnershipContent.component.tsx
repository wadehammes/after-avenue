import parse from "html-react-parser";
import styles from "src/components/PartnershipContent/PartnershipContent.module.css";
import { StyledButtonLink } from "src/components/StyledButton/StyledButtonLink.component";
import type { ComponentSlide } from "src/contentful/parseComponentSlide";

interface PartnershipContentProps {
  slideFields: ComponentSlide;
  isEditorsPagePublished?: boolean;
}

export const PartnershipContent = (props: PartnershipContentProps) => {
  const { slideFields, isEditorsPagePublished = false } = props;
  const partnershipCopy = slideFields?.slideCopy ?? "";

  return (
    <div className="container column">
      <div className={styles.partnershipCopy}>
        {parse(partnershipCopy)}
        {isEditorsPagePublished ? (
          <div
            className="buttonContainer"
            style={{
              textAlign: "left",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <StyledButtonLink href="/editors" variant="outlined" color="dark">
              Meet our Editors
            </StyledButtonLink>
          </div>
        ) : null}
      </div>
    </div>
  );
};
