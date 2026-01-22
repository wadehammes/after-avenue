import classNames from "classnames";
import parse from "html-react-parser";
import styles from "src/components/ConversationBubbleContent/ConversationBubbleContent.module.css";
import type { ComponentSlide } from "src/contentful/parseComponentSlide";

interface ConversationBubbleContentProps {
  slideFields: ComponentSlide;
}

export const ConversationBubbleContent = (
  props: ConversationBubbleContentProps,
) => {
  const { slideFields } = props;
  const conversation = slideFields?.slideCopy ?? "";

  return (
    <div className="container column">
      <div className={classNames(styles.conversationBubble, "speechBubble")}>
        {parse(conversation)}
      </div>
    </div>
  );
};
