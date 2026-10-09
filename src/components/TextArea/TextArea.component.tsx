"use client";

import { Field } from "@base-ui/react/field";
import clsx from "clsx";
import type { ComponentProps, Ref } from "react";
import type { FieldError } from "react-hook-form";
import styles from "src/components/Input/Input.module.css";
import { useStableFieldId } from "src/hooks/useStableFieldId";
import { FormFieldLayout } from "src/ui/Field/FormFieldLayout.component";

interface TextAreaProps
  extends Omit<ComponentProps<typeof Field.Control>, "className" | "render"> {
  errorMessage?: React.ReactNode;
  hasError?: FieldError;
  label?: React.ReactNode;
  ref?: Ref<HTMLTextAreaElement>;
}

export const TextArea = (props: TextAreaProps) => {
  const {
    errorMessage,
    hasError,
    label,
    name,
    id: idProp,
    ref,
    ...restProps
  } = props;
  const stableId = useStableFieldId("textarea", idProp, name);

  return (
    <FormFieldLayout
      errorMessage={errorMessage}
      fieldRootClassName={styles.fieldRoot}
      hasError={hasError}
      label={label}
      name={name}
      control={
        <div
          className={clsx(styles.inputWrapper, {
            [styles.inputHasError]: Boolean(hasError),
          })}
        >
          <Field.Control
            {...restProps}
            id={stableId}
            name={name}
            ref={ref}
            render={(controlProps) => (
              <textarea
                {...controlProps}
                className={clsx(styles.input, styles.textarea, {
                  [styles.hasError]: Boolean(hasError),
                })}
                data-1p-ignore
              />
            )}
          />
        </div>
      }
    />
  );
};
