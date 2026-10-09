"use client";

import { Field } from "@base-ui/react/field";
import clsx from "clsx";
import type { ReactNode } from "react";
import type { FieldError } from "react-hook-form";
import fieldStyles from "src/styles/formFieldShared.module.css";
import { FieldErrorMessage } from "src/ui/Field/FieldErrorMessage.component";

interface FormFieldLayoutProps {
  control: ReactNode;
  errorMessage?: ReactNode;
  fieldRootClassName?: string;
  hasError?: FieldError;
  label?: ReactNode;
  name?: string;
}

export const FormFieldLayout = (props: FormFieldLayoutProps) => {
  const { control, errorMessage, fieldRootClassName, hasError, label, name } =
    props;

  return (
    <Field.Root
      className={clsx(fieldStyles.fieldsetWrapper, fieldRootClassName)}
      invalid={Boolean(hasError)}
      name={name}
    >
      {label ? (
        <Field.Label className={fieldStyles.label}>{label}</Field.Label>
      ) : null}
      <div className={fieldStyles.controlWrapper}>
        {control}
        <FieldErrorMessage
          className={fieldStyles.errorMessage}
          errorMessage={errorMessage}
          hasError={hasError}
        />
      </div>
    </Field.Root>
  );
};
