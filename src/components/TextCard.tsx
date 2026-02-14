import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import type { ReactNode } from "react";

interface TextCardProps {
  title: string;
  subtitle?: string;
  body: string;
  icon?: ReactNode;
  className?: string;
}

export function TextCard({ title, subtitle, body, icon, className }: TextCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      className={clsx("text-card", className)}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="text-card-header">
        {icon ? <span className="text-card-icon">{icon}</span> : null}
        <div>
          <h3>{title}</h3>
          {subtitle ? <p className="text-card-subtitle">{subtitle}</p> : null}
        </div>
      </header>
      <p className="text-card-body">{body}</p>
    </motion.article>
  );
}
