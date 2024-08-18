import classNames from "classnames";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { ReactNode } from "react";
import { AriaLinkOptions } from "react-aria";
import styles from "src/components/StyledButton/StyledButton.module.css";

interface StyledButtonLinkProps extends Omit<AriaLinkOptions, "href"> {
  children: ReactNode;
  href: Url;
  inverted?: boolean;
  color?: "light" | "dark";
  variant: "contained" | "outlined";
}

export const StyledButtonLink = (props: StyledButtonLinkProps) => {
  const { children, color = "light", inverted, variant, ...restProps } = props;

  return (
    <Link
      {...restProps}
      className={classNames(styles.styledButton, {
        [styles.contained]: variant === "contained",
        [styles.inverted]: inverted,
        [styles.light]: color === "light",
        [styles.dark]: color === "dark",
      })}
    >
      {children}
    </Link>
  );
};

export default StyledButtonLink;
