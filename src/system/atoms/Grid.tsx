import React from "react";
import styles from "./styles/Grid.module.css";
import { cx } from "./_cx";
import { Box } from "./Box";

type Props = {
  gap?: string;
  cols?: string; // e.g. "repeat(3, minmax(0, 1fr))" or responsive via style
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export function Grid({ gap, cols, className, style, children }: Props) {
  return (
    <Box
      className={cx(styles.grid, className)}
      style={{
        ...(gap ? { ["--grid-gap" as any]: gap } : null),
        ...(cols ? { ["--grid-cols" as any]: cols } : null),
        ...style,
      }}
    >
      {children}
    </Box>
  );
}
