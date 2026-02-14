import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import type { PropsWithChildren } from "react";

interface SectionFrameProps extends PropsWithChildren {
  id: string;
  className?: string;
  innerClassName?: string;
}

export function SectionFrame({ id, className, innerClassName, children }: SectionFrameProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={clsx("section-frame", className)}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 36 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={clsx("section-inner", innerClassName)}>{children}</div>
    </motion.section>
  );
}
