import React from "react";
import styles from "./styles/Surface.module.css";
import { cx } from "./_cx";
import { Box } from "./Box";

type Tone = "plain" | "elevated";

type Props = {
  tone?: Tone;
  pad?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export function Surface({ tone = "plain", pad, className, style, children }: Props) {
  const vars =
    tone === "elevated"
      ? { ["--surface-shadow" as any]: "var(--shadow-1)" }
      : null;

  return (
    <Box
      className={cx(styles.surface, className)}
      style={{
        ...(pad ? { ["--surface-pad" as any]: pad } : null),
        ...(vars ?? null),
        ...style,
      }}
    >
      {children}
    </Box>
  );
}
