import classnames from "classnames";
import { type Ref, forwardRef } from "react";
import type { AriaTextFieldProps } from "react-aria";
import { useObjectRef, useTextField } from "react-aria";
import type { FieldError } from "react-hook-form";
import styles from "src/components/StyledInput/StyledInput.module.css";

interface StyledTextAreaProps extends AriaTextFieldProps<HTMLTextAreaElement> {
  hasError?: FieldError;
}

export const StyledTextArea = forwardRef(
  (props: StyledTextAreaProps, ref: Ref<HTMLTextAreaElement>) => {
    const { label, hasError } = props;
    const inputRef = useObjectRef(ref);
    const { labelProps, inputProps } = useTextField(
      { ...props, inputElementType: "textarea" },
      inputRef,
    );
    const { id, ...restInputProps } = inputProps;

    return (
      <div className={styles.fieldsetWrapper}>
        {label ? (
          <label className={styles.label} {...labelProps} htmlFor={id}>
            {label}
          </label>
        ) : null}
        <div
          className={classnames(styles.inputWrapper, {
            [styles.inputHasError]: hasError,
          })}
        >
          <textarea
            {...restInputProps}
            id={id}
            className={classnames(styles.input, styles.textarea, {
              [styles.hasError]: Boolean(hasError),
            })}
            ref={inputRef}
            data-1p-ignore
          />
        </div>
      </div>
    );
  },
);

export default StyledTextArea;
