import NextLink from "next/link";
import React from "react";
import styles from "./styles/Link.module.css";
import { cx } from "./_cx";

type Props = React.ComponentProps<typeof NextLink> & { className?: string };

export function Link({ className, ...props }: Props) {
  return <NextLink className={cx(styles.link, className)} {...props} />;
}
