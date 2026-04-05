import { ContentCard } from "src/components/ContentCard/ContentCard.component";
import { ConversationBubbleContent } from "src/components/ConversationBubbleContent/ConversationBubbleContent.component";
import { CopyBlock } from "src/components/CopyBlock/CopyBlock.component";
import { FeaturedBrands } from "src/components/FeaturedBrands/FeaturedBrands.component";
import { HeroSlide } from "src/components/HeroSlide/HeroSlide.component";
import { PartnershipContent } from "src/components/PartnershipContent/PartnershipContent.component";
import { ServicesMarqueeSection } from "src/components/ServicesMarqueeSection/ServicesMarqueeSection.component";
import { Slide } from "src/components/Slide/Slide.component";
import { parseComponentCopyBlock } from "src/contentful/parseComponentCopyBlock";
import { parseContentfulComponentModules } from "src/contentful/parseComponentModules";
import { parseContentfulComponentSlide } from "src/contentful/parseComponentSlide";
import { parseContentfulContentCard } from "src/contentful/parseContentCard";
import type { Content } from "src/contentful/parseSections";
import {
  isTypeComponentContentCard,
  isTypeComponentCopyBlock,
  isTypeComponentModules,
  isTypeComponentSlide,
} from "src/contentful/types";

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

  if (isTypeComponentContentCard(content)) {
    const parsedCard = parseContentfulContentCard(content);

    if (!parsedCard) {
      return null;
    }

    return <ContentCard card={parsedCard} />;
  }

  if (isTypeComponentCopyBlock(content)) {
    const parsed = parseComponentCopyBlock(content);

    if (!parsed) {
      return null;
    }

    return <CopyBlock copy={parsed.copy} textAlign={parsed.textAlign} />;
  }

  if (isTypeComponentModules(content)) {
    const parsed = parseContentfulComponentModules(content);

    if (!parsed) {
      return null;
    }

    if (parsed.module === "Featured Brands Marquee") {
      return <FeaturedBrands />;
    }

    if (parsed.module === "Services Marquee") {
      return <ServicesMarqueeSection />;
    }

    return null;
  }

  if (isTypeComponentSlide(content)) {
    const parsedEntry = parseContentfulComponentSlide(content);

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

  return null;
};
