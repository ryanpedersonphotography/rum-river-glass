import React from "react";
import styles from "./styles/Section.module.css";
import { cx } from "./_cx";
import { Box } from "./Box";

type Props = {
  padY?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export function Section({ padY, className, style, children }: Props) {
  return (
    <Box
      as="section"
      className={cx(styles.section, className)}
      style={{
        ...(padY ? { ["--section-padY" as any]: padY } : null),
        ...style,
      }}
    >
      {children}
    </Box>
  );
}
