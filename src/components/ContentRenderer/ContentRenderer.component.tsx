import { CopyBlock } from "src/components/CopyBlock/CopyBlock.component";
import { LogoTicker } from "src/components/LogoTicker/LogoTicker.component";
import { ComponentCopyBlock } from "src/contentful/parseComponentCopyBlock";
import { ComponentLogoTickerEntry } from "src/contentful/parseComponentLogoTicker";
import { parseContentfulAsset } from "src/contentful/parseContentfulAsset";
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
    case "componentCopyBlock": {
      const fields = content.fields as ComponentCopyBlock;

      return <CopyBlock copy={fields.copy} textAlign={fields.textAlign} />;
    }
    case "componentLogoTicker": {
      const entry = content.fields as ComponentLogoTickerEntry;

      if (!entry) {
        return null;
      }

      const parsedLogos = entry.fields?.logos?.map(parseContentfulAsset) ?? [];

      return <LogoTicker logos={parsedLogos} />;
    }
    default:
      return null;
  }
};
