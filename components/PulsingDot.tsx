"use client";

import { motion } from "motion/react";

export default function PulsingDot({ color = "rgb(2, 255, 39)" }: { color?: string }) {
  return (
    <span style={{ position: "relative", width: 9, height: 9, display: "inline-block" }}>
      {/* Ripple ring */}
      <motion.span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: 999,
          background: color,
          width: 7,
          height: 7,
        }}
        animate={{ width: [9, 18, 18], height: [9, 18, 18], opacity: [1, 0, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: [0.44, 0, 0.56, 1] }}
      />
      {/* Solid dot */}
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 7,
          height: 7,
          borderRadius: 999,
          background: color,
        }}
      />
    </span>
  );
}
