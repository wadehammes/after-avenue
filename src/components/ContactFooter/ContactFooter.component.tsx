"use client";

import classNames from "classnames";
import parse from "html-react-parser";
import { useInView } from "react-intersection-observer";
import styles from "src/components/ContactFooter/ContactFooter.module.css";
import StyledButtonLink from "src/components/StyledButton/StyledButtonLink.component";
import { useGlobalVariables } from "src/context/globalContext.context";

interface ContactFooterProps {
  buttonText?: string;
  title?: string;
}

export const ContactFooter = (props: ContactFooterProps) => {
  const { buttonText, title } = props;
  const { inView, ref } = useInView({
    threshold: 0.75,
  });

  const globalVariables = useGlobalVariables();

  const { contactFooterButtonText, contactFooterTitle } = globalVariables;

  if (!contactFooterButtonText || !contactFooterTitle) {
    return null;
  }

  const heading =
    title ||
    contactFooterTitle ||
    "We're the last stop before your story begins.";
  const button = buttonText || contactFooterButtonText || "Contact Us";

  return (
    <section
      ref={ref}
      className={classNames(styles.contactFooter, { [styles.inView]: inView })}
    >
      <div className="section-header">
        <h2>{parse(heading)}</h2>
        <div className="buttonContainer">
          <StyledButtonLink href="/contact" variant="outlined" color="dark">
            {button}
          </StyledButtonLink>
        </div>
      </div>
    </section>
  );
};
