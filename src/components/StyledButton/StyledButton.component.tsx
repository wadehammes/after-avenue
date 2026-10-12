import classNames from "classnames";
import type { ComponentProps, Ref } from "react";
import styles from "src/components/StyledButton/StyledButton.module.css";
import { Button } from "src/ui/Button/Button.component";

type BaseStyledButtonProps = Omit<
  ComponentProps<typeof Button>,
  "className" | "disabled"
>;

interface StyledButtonProps extends BaseStyledButtonProps {
  color?: "light" | "dark";
  disabled?: boolean;
  fullWidth?: boolean;
  isDisabled?: boolean;
  ref?: Ref<HTMLButtonElement>;
  size?: "small" | "medium" | "large";
  variant?: "contained" | "outlined";
}

export const StyledButton = (props: StyledButtonProps) => {
  const {
    disabled,
    fullWidth,
    isDisabled,
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
      disabled={disabled ?? isDisabled}
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
