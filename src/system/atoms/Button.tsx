import React from "react";
import styles from "./styles/Button.module.css";
import { cx } from "./_cx";

type Variant = "default" | "primary";
type Size = "md" | "sm";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ variant = "default", size = "md", className, ...rest }: Props) {
  return (
    <button
      className={cx(
        styles.button,
        variant === "primary" && styles.primary,
        size === "sm" && styles.small,
        className
      )}
      {...rest}
    />
  );
}
