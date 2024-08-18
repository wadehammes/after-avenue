import classNames from "classnames";
import type { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import type { ReactNode } from "react";
import type { AriaLinkOptions } from "react-aria";
import styles from "src/components/StyledButton/StyledButton.module.css";

interface StyledButtonLinkProps extends Omit<AriaLinkOptions, "href"> {
	children: ReactNode;
	color?: "light" | "dark";
	href: Url;
	inverted?: boolean;
	size?: "small" | "medium" | "large";
	variant: "contained" | "outlined";
}

export const StyledButtonLink = (props: StyledButtonLinkProps) => {
	const {
		children,
		color = "light",
		inverted,
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
				[styles.inverted]: inverted,
				[styles.dark]: color === "dark",
				[styles.small]: size === "small",
				[styles.medium]: size === "medium",
				[styles.large]: size === "large",
			})}
		>
			{children}
		</Link>
	);
};

export default StyledButtonLink;
