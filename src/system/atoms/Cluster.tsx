import React from "react";
import styles from "./styles/Cluster.module.css";
import { cx } from "./_cx";
import { Box } from "./Box";

type Props = {
  gap?: string;
  align?: "stretch" | "flex-start" | "center" | "flex-end";
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export function Cluster({ gap, align, justify, className, style, children }: Props) {
  return (
    <Box
      className={cx(styles.cluster, className)}
      style={{
        ...(gap ? { ["--cluster-gap" as any]: gap } : null),
        ...(align ? { ["--cluster-align" as any]: align } : null),
        ...(justify ? { ["--cluster-justify" as any]: justify } : null),
        ...style,
      }}
    >
      {children}
    </Box>
  );
}
