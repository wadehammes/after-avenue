import { CopyBlock } from "src/components/CopyBlock/CopyBlock.component";
import { Slide } from "src/components/Slide/Slide.component";
import type { ComponentCopyBlock } from "src/contentful/parseComponentCopyBlock";
import {
  type ComponentSlideEntry,
  parseContentfulComponentSlide,
} from "src/contentful/parseComponentSlide";
import type { Content } from "src/contentful/parseSections";

interface ContentRendererProps {
  content: Content;
  index: number;
}

export const ContentRenderer = (props: ContentRendererProps) => {
  const { content, index } = props;

  if (!content) {
    return null;
  }

  const contentType = content.sys.contentType.sys.id;

  switch (contentType) {
    case "componentCopyBlock": {
      const fields = content.fields as ComponentCopyBlock;

      return <CopyBlock copy={fields.copy} textAlign={fields.textAlign} />;
    }
    case "componentSlide": {
      const entry = content as ComponentSlideEntry;

      if (!entry) {
        return null;
      }

      const parsedEntry = parseContentfulComponentSlide(entry);

      return <Slide fields={parsedEntry} index={index} />;
    }
    default:
      return null;
  }
};
