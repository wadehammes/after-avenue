import Image from "next/image";
import styles from "src/components/EditorsEntryPage/EditorsEntryPage.module.css";
import type { Editor } from "src/contentful/getEditors";
import { RichText } from "src/contentful/richText";
import { createImageUrl } from "src/utils/helpers";

interface EditorsEntryPageIntroProps {
  editorEntry: Editor;
}

export const EditorsEntryPageIntro = (props: EditorsEntryPageIntroProps) => {
  const { editorEntry } = props;

  return (
    <div className={styles.editorsEntryPageIntro}>
      <div className={styles.editorsEntryPageIntroImage}>
        {editorEntry.editorHeadshot ? (
          <Image
            src={createImageUrl(editorEntry.editorHeadshot?.src ?? "")}
            alt={editorEntry.editorName}
            width={editorEntry.editorHeadshot?.width}
            height={editorEntry.editorHeadshot?.height}
            className={styles.editorHeadshot}
          />
        ) : null}
        {editorEntry.editorHeadshotHover ? (
          <Image
            src={createImageUrl(editorEntry.editorHeadshotHover?.src ?? "")}
            alt={editorEntry.editorName}
            width={editorEntry.editorHeadshotHover?.width}
            height={editorEntry.editorHeadshotHover?.height}
            className={styles.editorHeadshotHover}
          />
        ) : null}
      </div>
      <div className={styles.editorsEntryPageIntroContent}>
        <h1>{editorEntry.editorName}</h1>
        {editorEntry.editorTitle ? <p>{editorEntry.editorTitle}</p> : null}
        {editorEntry.editorBio ? (
          <div className={styles.editorsBio}>
            <RichText document={editorEntry.editorBio} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
