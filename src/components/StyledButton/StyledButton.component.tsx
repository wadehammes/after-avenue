import classNames from "classnames";
import type { Ref } from "react";
import { forwardRef } from "react";
import type { AriaButtonProps } from "react-aria";
import styles from "src/components/StyledButton/StyledButton.module.css";
import { Button } from "src/ui/Button/Button.component";

interface StyledButtonProps extends AriaButtonProps {
	className?: string;
	fullWidth?: boolean;
}

export const StyledButton = forwardRef(
	(props: StyledButtonProps, ref: Ref<HTMLButtonElement>) => {
		const { className, fullWidth } = props;
		return (
			<Button
				ref={ref}
				{...props}
				className={classNames(className, styles.styledButton, {
					[styles.fullWidth]: fullWidth,
				})}
			/>
		);
	},
);

export default StyledButton;
