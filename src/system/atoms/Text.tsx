import React from "react";
import styles from "./styles/Text.module.css";
import { cx } from "./_cx";
import { Box } from "./Box";

type Tone = "default" | "muted";
type Kind = "body" | "title";

type Props = {
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3";
  tone?: Tone;
  kind?: Kind;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export function Text({
  as = "p",
  tone = "default",
  kind = "body",
  className,
  style,
  children,
}: Props) {
  return (
    <Box
      as={as}
      className={cx(
        styles.text,
        kind === "title" && styles.title,
        tone === "muted" && styles.muted,
        className
      )}
      style={style}
    >
      {children}
    </Box>
  );
}
