import classNames from "classnames";
import type { Ref } from "react";
import type { AriaButtonProps } from "react-aria";
import styles from "src/components/StyledButton/StyledButton.module.css";
import { Button } from "src/ui/Button/Button.component";

interface StyledButtonProps extends AriaButtonProps {
  color?: "light" | "dark";
  fullWidth?: boolean;
  ref?: Ref<HTMLButtonElement>;
  size?: "small" | "medium" | "large";
  variant?: "contained" | "outlined";
}

export const StyledButton = (props: StyledButtonProps) => {
  const {
    fullWidth,
    ref,
    variant = "outlined",
    color = "dark",
    size = "medium",
    ...buttonProps
  } = props;

  return (
    <Button
      ref={ref}
      {...buttonProps}
      className={classNames(styles.styledButton, {
        [styles.contained]: variant === "contained",
        [styles.dark]: color === "dark",
        [styles.fullWidth]: fullWidth,
        [styles.light]: color === "light",
        [styles.outlined]: variant === "outlined",
        [styles.small]: size === "small",
        [styles.large]: size === "large",
      })}
    />
  );
};
