import classnames from "classnames";
import { type Ref, forwardRef } from "react";
import {
  type AriaTextFieldProps,
  useObjectRef,
  useTextField,
} from "react-aria";
import styles from "src/ui/TextField/TextField.module.css";

interface TextFieldProps extends AriaTextFieldProps<HTMLTextAreaElement> {
  className?: string;
}

export const TextArea = forwardRef(
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
        <label {...labelProps} htmlFor={inputProps.name}>
          {label}
        </label>
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