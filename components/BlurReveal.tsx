"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface BlurRevealProps {
  children: string;
  className?: string;
  delay?: number;
  /** ms between each word */
  stagger?: number;
  as?: "p" | "span" | "li" | "h3" | "h4";
}

export function BlurReveal({
  children,
  className,
  delay = 0,
  stagger = 0.045,
  as: Tag = "p",
}: BlurRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });

  const words = children.split(" ");

  return (
    // @ts-expect-error — polymorphic ref typing
    <Tag ref={ref} className={className} aria-label={children}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 14, filter: "blur(8px)" }
          }
          transition={{
            duration: 0.5,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block", marginRight: "0.28em", willChange: "transform, opacity, filter" }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
