import React from "react";
import styles from "./styles/Box.module.css";
import { cx } from "./_cx";

type Props<T extends keyof React.JSX.IntrinsicElements> = {
  as?: T;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
} & Omit<React.JSX.IntrinsicElements[T], "as" | "className" | "style" | "children">;

export function Box<T extends keyof React.JSX.IntrinsicElements = "div">({
  as,
  className,
  style,
  children,
  ...rest
}: Props<T>) {
  const Comp = (as ?? "div") as any;
  return (
    <Comp className={cx(styles.box, className)} style={style} {...rest}>
      {children}
    </Comp>
  );
}
