import clsx from "clsx";
import { CSSProperties, ReactNode } from "react";

export function Card({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-border/80 bg-surface shadow-[0_1px_2px_rgba(11,31,42,0.04)] transition-smooth",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
