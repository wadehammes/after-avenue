"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps, Ref } from "react";

export type ButtonProps = ComponentProps<typeof BaseButton> & {
  ref?: Ref<HTMLButtonElement>;
};

export const Button = (props: ButtonProps) => {
  const { className, ref, style, ...restProps } = props;

  return (
    <BaseButton {...restProps} className={className} ref={ref} style={style} />
  );
};
