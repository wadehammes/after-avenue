import type { Ref } from "react";
import { type AriaButtonProps, useButton, useObjectRef } from "react-aria";
import styles from "src/ui/Button/Button.module.css";

interface ButtonProps extends AriaButtonProps {
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
}

export const Button = (props: ButtonProps) => {
  const { className, ref, style, ...buttonAriaProps } = props;
  const buttonRef = useObjectRef(ref);
  const { buttonProps } = useButton(buttonAriaProps, buttonRef);

  return (
    <button
      {...buttonProps}
      className={className ? className : styles.button}
      style={style}
    >
      {props.children}
    </button>
  );
};
