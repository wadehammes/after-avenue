import classNames from "classnames";
import type { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import styles from "src/components/StyledButton/StyledButton.module.css";

interface StyledButtonLinkProps
  extends Omit<ComponentProps<typeof Link>, "className" | "href"> {
  children: ReactNode;
  color?: "light" | "dark";
  href: Url;
  size?: "small" | "medium" | "large";
  variant: "contained" | "outlined";
}

export const StyledButtonLink = (props: StyledButtonLinkProps) => {
  const {
    children,
    color = "light",
    size = "medium",
    variant,
    ...restProps
  } = props;

  return (
    <Link
      {...restProps}
      className={classNames(styles.styledButton, {
        [styles.light]: color === "light",
        [styles.contained]: variant === "contained",
        [styles.outlined]: variant === "outlined",
        [styles.dark]: color === "dark",
        [styles.small]: size === "small",
        [styles.large]: size === "large",
      })}
    >
      {children}
    </Link>
  );
};
