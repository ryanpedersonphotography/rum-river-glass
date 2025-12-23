import React from "react";
import styles from "./styles/Stack.module.css";
import { cx } from "./_cx";
import { Box } from "./Box";

type Props = {
  gap?: string;         // e.g. "var(--space-6)" or "24px"
  align?: "stretch" | "flex-start" | "center" | "flex-end";
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export function Stack({ gap, align, className, style, children }: Props) {
  return (
    <Box
      className={cx(styles.stack, className)}
      style={{
        ...(gap ? { ["--stack-gap" as any]: gap } : null),
        ...(align ? { ["--stack-align" as any]: align } : null),
        ...style,
      }}
    >
      {children}
    </Box>
  );
}
