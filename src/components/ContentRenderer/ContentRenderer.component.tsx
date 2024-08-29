import { CopyBlock } from "src/components/CopyBlock/CopyBlock.component";
import { Content } from "src/contentful/parseSections";

interface ContentRendererProps {
  content: Content;
}

export const ContentRenderer = (props: ContentRendererProps) => {
  const { content } = props;

  if (!content) {
    return null;
  }

  const contentType = content.sys.contentType.sys.id;

  switch (contentType) {
    case "componentCopyBlock":
      return <CopyBlock copy={content.fields.copy} />;
    default:
      return null;
  }
};
