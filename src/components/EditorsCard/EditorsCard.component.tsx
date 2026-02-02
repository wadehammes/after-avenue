"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "src/components/EditorsCard/EditorsCard.module.css";
import type { EditorType } from "src/contentful/getEditors";
import { createImageUrl } from "src/utils/helpers";

interface EditorsCardProps {
  editor: EditorType;
}

export const EditorsCard = (props: EditorsCardProps) => {
  const { editor } = props;
  const [src, setSrc] = useState(editor.editorHeadshot?.src ?? "");

  return (
    <Link
      href={`/editors/${editor.editorSlug}`}
      className={styles.editorsCard}
      onMouseEnter={() => setSrc(editor.editorHeadshotHover?.src ?? "")}
      onMouseLeave={() => setSrc(editor.editorHeadshot?.src ?? "")}
    >
      <div className="editorsCardImage">
        <Image
          className={styles.editorsCardImage}
          src={createImageUrl(src)}
          alt={editor.editorName}
          width={editor.editorHeadshot?.width}
          height={editor.editorHeadshot?.height}
          sizes="(max-width: 768px) 50vw, 25vw"
          loading="lazy"
        />
      </div>
      <div className={styles.editorsCardMeta}>
        <div className={styles.editorsCardTitle}>
          <h2>{editor.editorName}</h2>
          {editor.editorTitle ? <p>{editor.editorTitle}</p> : null}
        </div>
      </div>
    </Link>
  );
};
