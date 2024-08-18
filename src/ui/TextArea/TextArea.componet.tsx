import classnames from "classnames";
import { Ref, forwardRef } from "react";
import type { AriaTextFieldProps } from "react-aria";
import { useObjectRef, useTextField } from "react-aria";
import styles from "src/ui/TextField/TextField.module.css";

interface TextFieldProps extends AriaTextFieldProps {
  className?: string;
}

export const TextField = forwardRef(
  (props: TextFieldProps, ref: Ref<HTMLTextAreaElement>) => {
    const { label, className } = props;
    const inputRef = useObjectRef(ref);
    const { labelProps, inputProps } = useTextField(
      {
        ...props,
        inputElementType: "textarea",
      },
      inputRef,
    );

    return (
      <fieldset className={styles.fieldset}>
        <label {...labelProps}>{label}</label>
        <textarea
          {...inputProps}
          className={classnames(className, styles.input)}
          ref={inputRef}
          data-1p-ignore
        />
      </fieldset>
    );
  },
);
