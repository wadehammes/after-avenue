import classNames from "classnames";
import { Ref, forwardRef } from "react";
import { AriaButtonProps } from "react-aria";
import styles from "src/components/StyledButton/StyledButton.module.css";
import { Button } from "src/ui/Button/Button.component";

interface StyledButtonProps extends AriaButtonProps {
  fullWidth?: boolean;
}

export const StyledButton = forwardRef(
  (props: StyledButtonProps, ref: Ref<HTMLButtonElement>) => {
    const { fullWidth } = props;
    return (
      <Button
        ref={ref}
        {...props}
        className={classNames(styles.styledButton, {
          [styles.fullWidth]: fullWidth,
        })}
      />
    );
  },
);

export default StyledButton;
