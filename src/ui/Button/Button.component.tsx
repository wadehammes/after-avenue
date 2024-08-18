import { Ref, forwardRef } from "react";
import { AriaButtonProps, useButton, useObjectRef } from "react-aria";
import styles from "src/ui/Button/Button.module.css";

interface ButtonProps extends AriaButtonProps {
  className?: string;
}

export const Button = forwardRef(
  (props: ButtonProps, ref: Ref<HTMLButtonElement>) => {
    const { className } = props;
    const buttonRef = useObjectRef(ref);
    const { buttonProps } = useButton(props, buttonRef);

    return (
      <button
        {...buttonProps}
        className={className ? className : styles.button}
      >
        {props.children}
      </button>
    );
  },
);
