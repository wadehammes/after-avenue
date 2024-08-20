import Image from "next/image";
import styles from "src/components/EditorsEntryPage/EditorsEntryPage.module.css";
import { Editor } from "src/contentful/getEditors";
import { createImageUrl } from "src/utils/helpers";

interface EditorsEntryPageIntroProps {
  editorEntry: Editor;
}

export const EditorsEntryPageIntro = (props: EditorsEntryPageIntroProps) => {
  const { editorEntry } = props;

  return (
    <div className={styles.editorsEntryPageIntro}>
      <div className={styles.editorsEntryPageIntroImage}>
        <Image
          src={createImageUrl(editorEntry.editorHeadshot?.src ?? "")}
          alt={editorEntry.editorName}
          width={editorEntry.editorHeadshot?.width}
          height={editorEntry.editorHeadshot?.height}
        />
      </div>
      <h1>{editorEntry.editorName}</h1>
      {editorEntry.editorTitle ? <p>{editorEntry.editorTitle}</p> : null}
    </div>
  );
};
