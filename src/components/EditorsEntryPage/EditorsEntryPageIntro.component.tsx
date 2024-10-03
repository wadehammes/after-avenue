"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "src/components/EditorsEntryPage/EditorsEntryPage.module.css";
import type { Editor } from "src/contentful/getEditors";
import { RichText } from "src/contentful/richText";
import { createImageUrl } from "src/utils/helpers";

interface EditorsEntryPageIntroProps {
  editorEntry: Editor;
}

export const EditorsEntryPageIntro = (props: EditorsEntryPageIntroProps) => {
  const { editorEntry } = props;
  const [editorHeadshot, setEditorHeadshot] = useState<string>(
    createImageUrl(editorEntry.editorHeadshot?.src ?? ""),
  );

  return (
    <div
      className={styles.editorsEntryPageIntro}
      onMouseEnter={() =>
        setEditorHeadshot(
          createImageUrl(
            editorEntry.editorHeadshotHover?.src ??
              editorEntry.editorHeadshot?.src ??
              "",
          ),
        )
      }
      onMouseLeave={() =>
        setEditorHeadshot(createImageUrl(editorEntry.editorHeadshot?.src ?? ""))
      }
    >
      <div className={styles.editorsEntryPageIntroImage}>
        {editorEntry.editorHeadshot ? (
          <Image
            src={editorHeadshot}
            alt={editorEntry.editorName}
            width={editorEntry.editorHeadshot?.width}
            height={editorEntry.editorHeadshot?.height}
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
