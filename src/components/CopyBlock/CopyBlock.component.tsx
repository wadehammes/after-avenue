import { Document } from "@contentful/rich-text-types";
import styles from "src/components/CopyBlock/CopyBlock.module.css";
import { RichText } from "src/contentful/richText";

interface CopyBlockProps {
  copy: Document | null;
}

export const CopyBlock = (props: CopyBlockProps) => {
  const { copy } = props;

  if (!copy) {
    return null;
  }

  return (
    <div className={styles.copyBlock}>
      <RichText document={copy} />
    </div>
  );
};
