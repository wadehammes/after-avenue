import { Ref, forwardRef } from "react";
import { AriaButtonProps, useButton, useObjectRef } from "react-aria";
import styles from "src/ui/Button/Button.module.css";

interface ButtonProps extends AriaButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Button = forwardRef(
  (props: ButtonProps, ref: Ref<HTMLButtonElement>) => {
    const { className, style } = props;
    const buttonRef = useObjectRef(ref);
    const { buttonProps } = useButton(props, buttonRef);

    return (
      <button
        {...buttonProps}
        className={className ? className : styles.button}
        style={style}
      >
        {props.children}
      </button>
    );
  },
);
