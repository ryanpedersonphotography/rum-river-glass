import React from "react";
import styles from "./styles/Container.module.css";
import { cx } from "./_cx";
import { Box } from "./Box";

type Size = "sm" | "md" | "lg";

const sizeToVar: Record<Size, string> = {
  sm: "var(--container-sm)",
  md: "var(--container-md)",
  lg: "var(--container-lg)",
};

type Props = {
  size?: Size;
  pad?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export function Container({ size = "lg", pad, className, style, children }: Props) {
  return (
    <Box
      className={cx(styles.container, className)}
      style={{
        ["--container-size" as any]: sizeToVar[size],
        ...(pad ? { ["--container-pad" as any]: pad } : null),
        ...style,
      }}
    >
      {children}
    </Box>
  );
}
