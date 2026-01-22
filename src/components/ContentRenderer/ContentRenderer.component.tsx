import { ContentCard } from "src/components/ContentCard/ContentCard.component";
import { ConversationBubbleContent } from "src/components/ConversationBubbleContent/ConversationBubbleContent.component";
import { CopyBlock } from "src/components/CopyBlock/CopyBlock.component";
import { FeaturedBrands } from "src/components/FeaturedBrands/FeaturedBrands.component";
import { HeroSlide } from "src/components/HeroSlide/HeroSlide.component";
import { PartnershipContent } from "src/components/PartnershipContent/PartnershipContent.component";
import { ServicesMarqueeSection } from "src/components/ServicesMarqueeSection/ServicesMarqueeSection.component";
import { Slide } from "src/components/Slide/Slide.component";
import type { ComponentCopyBlock } from "src/contentful/parseComponentCopyBlock";
import type { ComponentModules } from "src/contentful/parseComponentModules";
import {
  type ComponentSlideEntry,
  parseContentfulComponentSlide,
} from "src/contentful/parseComponentSlide";
import {
  type ContentCardEntry,
  parseContentfulContentCard,
} from "src/contentful/parseContentCard";
import type { Content } from "src/contentful/parseSections";

interface ContentRendererProps {
  content: Content;
  index: number;
  isEditorsPagePublished?: boolean;
}

export const ContentRenderer = ({
  content,
  index,
  isEditorsPagePublished = false,
}: ContentRendererProps) => {
  if (!content) {
    return null;
  }

  const contentType = content.sys.contentType.sys.id;

  switch (contentType) {
    case "componentContentCard": {
      const entry = content as ContentCardEntry;
      const parsedCard = parseContentfulContentCard(entry);

      if (!parsedCard) {
        return null;
      }

      return <ContentCard card={parsedCard} />;
    }
    case "componentCopyBlock": {
      const fields = content.fields as ComponentCopyBlock;

      return <CopyBlock copy={fields.copy} textAlign={fields.textAlign} />;
    }
    case "componentModules": {
      const fields = content.fields as ComponentModules;

      if (fields.module === "Featured Brands Marquee") {
        return <FeaturedBrands />;
      }

      if (fields.module === "Services Marquee") {
        return <ServicesMarqueeSection />;
      }

      return null;
    }
    case "componentSlide": {
      const entry = content as ComponentSlideEntry;
      const parsedEntry = parseContentfulComponentSlide(entry);

      if (!parsedEntry) {
        return null;
      }

      if (parsedEntry.slideType === "Hero") {
        return <HeroSlide fields={parsedEntry} index={index} />;
      }

      if (parsedEntry.slideType === "Conversation Bubble") {
        return (
          <Slide fields={parsedEntry} index={index}>
            <ConversationBubbleContent slideFields={parsedEntry} />
          </Slide>
        );
      }

      if (
        parsedEntry.slideType === "Regular" &&
        parsedEntry.slideCopy &&
        !parsedEntry.headline &&
        !parsedEntry.backgroundMedia
      ) {
        return (
          <Slide fields={parsedEntry} index={index}>
            <PartnershipContent
              slideFields={parsedEntry}
              isEditorsPagePublished={isEditorsPagePublished}
            />
          </Slide>
        );
      }

      return <Slide fields={parsedEntry} index={index} />;
    }
    default:
      return null;
  }
};
