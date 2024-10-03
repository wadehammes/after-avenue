import type { Document } from "@contentful/rich-text-types";
import styles from "src/components/CopyBlock/CopyBlock.module.css";
import { RichText } from "src/contentful/richText";

interface CopyBlockProps {
  copy: Document | null;
  textAlign?: "left" | "center" | "right";
}

export const CopyBlock = (props: CopyBlockProps) => {
  const { copy, textAlign } = props;

  if (!copy) {
    return null;
  }

  return (
    <div className={styles.copyBlock} style={{ textAlign }}>
      <div className="container column">
        <RichText document={copy} />
      </div>
    </div>
  );
};
