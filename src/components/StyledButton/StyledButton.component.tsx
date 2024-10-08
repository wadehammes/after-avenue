import classNames from "classnames";
import type { Ref } from "react";
import { forwardRef } from "react";
import type { AriaButtonProps } from "react-aria";
import styles from "src/components/StyledButton/StyledButton.module.css";
import { Button } from "src/ui/Button/Button.component";

interface StyledButtonProps extends AriaButtonProps {
  fullWidth?: boolean;
  variant?: "contained" | "outlined";
  color?: "light" | "dark";
  size?: "small" | "medium" | "large";
}

export const StyledButton = forwardRef(
  (props: StyledButtonProps, ref: Ref<HTMLButtonElement>) => {
    const {
      fullWidth,
      variant = "outlined",
      color = "dark",
      size = "medium",
    } = props;
    return (
      <Button
        ref={ref}
        {...props}
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
  },
);

export default StyledButton;
