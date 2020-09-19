import { Button, ButtonProps } from "@chakra-ui/core";
import React from "react";

export const CustomRadio = React.forwardRef<
  ButtonProps,
  ButtonProps & {
    isChecked?: boolean;
    value?: string;
    children: React.ReactNode;
  }
>((props, ref) => {
  const { isChecked, isDisabled, value, children, ...rest } = props;
  return (
    <>
      <Button
        variantColor={isChecked ? "blue" : "gray"}
        size="sm"
        aria-checked={isChecked}
        role="radio"
        isDisabled={isDisabled}
        ref={ref}
        mb={2}
        {...rest}
      >
        {children}
      </Button>
    </>
  );
});
