import React from "react";
import styles from "./styles/VisuallyHidden.module.css";
import { cx } from "./_cx";

export function VisuallyHidden({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx(styles.vh, className)} {...props} />;
}
