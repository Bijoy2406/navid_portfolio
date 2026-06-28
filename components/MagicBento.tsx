"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { resolveImage } from "@/lib/resolve-image";
import { extractVideoThumbnail } from "@/lib/extract-video-thumbnail";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";

/* ─── constants ─────────────────────────────────────────────────── */
const DEFAULT_PARTICLE_COUNT = 10;
const DEFAULT_SPOTLIGHT_RADIUS = 280;
// Gold: 255, 184, 0
const DEFAULT_GLOW_COLOR = "255, 184, 0";
const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1024;

/* ─── types ─────────────────────────────────────────────────────── */
export interface BentoProject {
  title: string;
  description: string;
  href: string;
  image: string;
}

/* ─── helpers ───────────────────────────────────────────────────── */
const createParticle = (x: number, y: number, color: string) => {
  const el = document.createElement("div");
  el.style.cssText = `
    position:absolute;width:3px;height:3px;border-radius:50%;
    background:rgba(${color},1);box-shadow:0 0 5px rgba(${color},0.7);
    pointer-events:none;z-index:100;left:${x}px;top:${y}px;
  `;
  return el;
};

const spotlightValues = (r: number) => ({ proximity: r * 0.5, fadeDistance: r * 0.75 });

const setCardGlow = (card: HTMLElement, mx: number, my: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--glow-x", `${((mx - rect.left) / rect.width) * 100}%`);
  card.style.setProperty("--glow-y", `${((my - rect.top) / rect.height) * 100}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

/* ─── breakpoint hooks ──────────────────────────────────────────── */
const useMobile = () => {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return m;
};

const useTablet = () => {
  const [t, setT] = useState(false);
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setT(w > MOBILE_BREAKPOINT && w <= TABLET_BREAKPOINT);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return t;
};

/* ─── ParticleCard ──────────────────────────────────────────────── */
interface ParticleCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disableAnimations?: boolean;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const ParticleCard = ({
  children,
  className = "",
  style,
  disableAnimations = false,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
}: ParticleCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHovered = useRef(false);
  const memoParticles = useRef<HTMLElement[]>([]);
  const initialized = useRef(false);
  const magnetAnim = useRef<gsap.core.Tween | null>(null);

  const initParticles = useCallback(() => {
    if (initialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoParticles.current = Array.from({ length: particleCount }, () =>
      createParticle(Math.random() * width, Math.random() * height, glowColor)
    );
    initialized.current = true;
  }, [particleCount, glowColor]);

  const clearParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetAnim.current?.kill();
    particlesRef.current.forEach((p) => {
      gsap.to(p, {
        scale: 0, opacity: 0, duration: 0.3, ease: "back.in(1.7)",
        onComplete: () => p.parentNode?.removeChild(p),
      });
    });
    particlesRef.current = [];
  }, []);

  const spawnParticles = useCallback(() => {
    if (!cardRef.current || !isHovered.current) return;
    if (!initialized.current) initParticles();
    memoParticles.current.forEach((p, i) => {
      const id = setTimeout(() => {
        if (!isHovered.current || !cardRef.current) return;
        const clone = p.cloneNode(true) as HTMLElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);
        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
        gsap.to(clone, { x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 80, rotation: Math.random() * 360, duration: 2 + Math.random() * 2, ease: "none", repeat: -1, yoyo: true });
        gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: "power2.inOut", repeat: -1, yoyo: true });
      }, i * 100);
      timeoutsRef.current.push(id);
    });
  }, [initParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const el = cardRef.current;

    const onEnter = () => {
      isHovered.current = true;
      spawnParticles();
      if (enableTilt) gsap.to(el, { rotateX: 5, rotateY: 5, duration: 0.3, ease: "power2.out", transformPerspective: 1000 });
    };

    const onLeave = () => {
      isHovered.current = false;
      clearParticles();
      if (enableTilt) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: "power2.out" });
      if (enableMagnetism) gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
    };

    const onMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      if (enableTilt) gsap.to(el, { rotateX: ((y - cy) / cy) * -10, rotateY: ((x - cx) / cx) * 10, duration: 0.1, ease: "power2.out", transformPerspective: 1000 });
      if (enableMagnetism) { magnetAnim.current = gsap.to(el, { x: (x - cx) * 0.04, y: (y - cy) * 0.04, duration: 0.3, ease: "power2.out" }); }
    };

    const onClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const d = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height));
      const ripple = document.createElement("div");
      ripple.style.cssText = `position:absolute;width:${d * 2}px;height:${d * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(${glowColor},0.35) 0%,rgba(${glowColor},0.15) 35%,transparent 70%);left:${x - d}px;top:${y - d}px;pointer-events:none;z-index:1000;`;
      el.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.7, ease: "power2.out", onComplete: () => ripple.remove() });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("click", onClick);
    return () => {
      isHovered.current = false;
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("click", onClick);
      clearParticles();
    };
  }, [spawnParticles, clearParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div ref={cardRef} className={className} style={{ ...style, position: "relative", overflow: "hidden" }}>
      {children}
    </div>
  );
};

/* ─── GlobalSpotlight ───────────────────────────────────────────── */
interface SpotlightProps {
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}

const GlobalSpotlight = ({ gridRef, disableAnimations = false, spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS, glowColor = DEFAULT_GLOW_COLOR }: SpotlightProps) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current) return;

    const spot = document.createElement("div");
    spot.style.cssText = `
      position:fixed;width:700px;height:700px;border-radius:50%;pointer-events:none;
      background:radial-gradient(circle,
        rgba(${glowColor},0.12) 0%,rgba(${glowColor},0.06) 20%,
        rgba(${glowColor},0.03) 35%,rgba(${glowColor},0.01) 55%,transparent 70%);
      z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;
    `;
    document.body.appendChild(spot);
    spotlightRef.current = spot;

    const { proximity, fadeDistance } = spotlightValues(spotlightRadius);

    const onMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;
      const section = gridRef.current.closest(".mb-bento-section") as HTMLElement | null;
      const rect = section?.getBoundingClientRect();
      const inside = rect
        ? e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
        : false;

      const cards = gridRef.current.querySelectorAll<HTMLElement>(".mb-card");

      if (!inside) {
        gsap.to(spot, { opacity: 0, duration: 0.3, ease: "power2.out" });
        cards.forEach((c) => c.style.setProperty("--glow-intensity", "0"));
        return;
      }

      let minDist = Infinity;
      cards.forEach((card) => {
        const cr = card.getBoundingClientRect();
        const cx = cr.left + cr.width / 2, cy = cr.top + cr.height / 2;
        const dist = Math.max(0, Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(cr.width, cr.height) / 2);
        minDist = Math.min(minDist, dist);
        const gi = dist <= proximity ? 1 : dist <= fadeDistance ? (fadeDistance - dist) / (fadeDistance - proximity) : 0;
        setCardGlow(card, e.clientX, e.clientY, gi, spotlightRadius);
      });

      gsap.to(spot, { left: e.clientX, top: e.clientY, duration: 0.1, ease: "power2.out" });
      const targetOp = minDist <= proximity ? 0.9 : minDist <= fadeDistance ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.9 : 0;
      gsap.to(spot, { opacity: targetOp, duration: targetOp > 0 ? 0.2 : 0.4, ease: "power2.out" });
    };

    const onLeave = () => {
      gridRef.current?.querySelectorAll<HTMLElement>(".mb-card").forEach((c) => c.style.setProperty("--glow-intensity", "0"));
      if (spotlightRef.current) gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      spot.parentNode?.removeChild(spot);
    };
  }, [gridRef, disableAnimations, spotlightRadius, glowColor]);

  return null;
};

/* ─── HoverCursor ────────────────────────────────────────────────── */
function HoverCursor({ label, containerRef, mode = "label" }: { label: string; containerRef: React.RefObject<HTMLDivElement | null>; mode?: "label" | "arrow" }) {
  const [visible, setVisible] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 400, damping: 35 });
  const sy = useSpring(my, { stiffness: 400, damping: 35 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mx.set(e.clientX - rect.left);
      my.set(e.clientY - rect.top);
    };
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [containerRef, mx, my]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cursor"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            x: sx,
            y: sy,
            translateX: mode === "label" ? "-50%" : "0%",
            translateY: mode === "label" ? "-50%" : "0%",
            pointerEvents: "none",
            zIndex: 50,
          }}
        >
          {mode === "label" ? (
            <div style={{
              background: "#FFB800",
              color: "#1A1A1A",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.04em",
              padding: "8px 16px",
              borderRadius: 999,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 16px rgba(255,184,0,0.35)",
            }}>
              {label}
            </div>
          ) : (
            <svg width="50" height="20" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2L24 14L14.5 16.5L9.5 28L2 2Z" fill="#FFB800"  strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── BentoCard ──────────────────────────────────────────────────── */
interface BentoCardProps {
  project: BentoProject;
  spanTwo: boolean;
  disableAnimations: boolean;
  particleCount: number;
  glowColor: string;
  enableTilt: boolean;
  clickEffect: boolean;
  enableMagnetism: boolean;
}

function BentoCard({ project, spanTwo, disableAnimations, particleCount, glowColor, enableTilt, clickEffect, enableMagnetism }: BentoCardProps) {
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoThumbnail = extractVideoThumbnail(project.href);
  const imageUrl = project.image ? resolveImage(project.image) : (videoThumbnail || "");

  return (
    <ParticleCard
      className="mb-card"
      style={{
        gridColumn: spanTwo ? "span 2" : "span 1",
        backgroundColor: "#0d0d0d",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.06)",
      } as React.CSSProperties}
      disableAnimations={disableAnimations}
      particleCount={particleCount}
      glowColor={glowColor}
      enableTilt={enableTilt}
      clickEffect={clickEffect}
      enableMagnetism={enableMagnetism}
    >
      <div className="mb-border-glow" style={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", zIndex: 1 }} />
      <a href={project.href} target="_blank" rel="noopener noreferrer" style={{ display: "block", height: "100%", textDecoration: "none" }}>
        <div
          ref={imgRef}
          data-custom-cursor
          style={{ position: "relative", aspectRatio: spanTwo ? "16/7" : "4/3", overflow: "hidden", borderRadius: "16px 16px 0 0", cursor: "none", background: project.image === "behance" ? "bg-black" : undefined }}
          className={project.image === "behance" ? "bg-black flex items-center justify-center" : ""}
        >
          {project.image === "behance" ? (
            <span className="text-white font-bold text-6xl tracking-tighter">Bē</span>
          ) : (
            <>
              <Image src={imageUrl} alt={project.title} fill className="object-cover" style={{ transition: "transform 0.7s ease" }} referrerPolicy="no-referrer" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.8) 0%, transparent 55%)" }} />
            </>
          )}
          <HoverCursor label="View Project" containerRef={imgRef} mode="label" />
        </div>
        <div ref={textRef} data-custom-cursor style={{ padding: "14px 16px 16px", position: "relative", cursor: "none" }}>
          <HoverCursor label="View Project" containerRef={textRef} mode="arrow" />
          <h5 style={{ fontWeight: 700, color: "#fff", fontSize: "1rem", marginBottom: 4, lineHeight: 1.3 }}>{project.title}</h5>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{project.description}</p>
        </div>
      </a>
    </ParticleCard>
  );
}

/* ─── MagicBentoGrid ─────────────────────────────────────────────── */
interface MagicBentoGridProps {
  projects: BentoProject[];
  glowColor?: string;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

export function MagicBentoGrid({
  projects,
  glowColor = DEFAULT_GLOW_COLOR,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  clickEffect = true,
  enableMagnetism = true,
}: MagicBentoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();
  const isTablet = useTablet();
  const isBento = !isMobile; // tablet + desktop both get bento
  const noAnim = isMobile;
  const spanFirst = projects && projects.length >= 3;

  // Tablet uses 2-col grid; desktop uses 3-col
  const cols = isTablet ? 2 : 3;
  const maxW = isTablet ? "480px" : "640px";

  return (
    <div className="mb-bento-section">
      <GlobalSpotlight gridRef={gridRef} disableAnimations={noAnim} spotlightRadius={spotlightRadius} glowColor={glowColor} />

      {/* Tablet + Desktop: bento grid */}
      {isBento && (
        <div
          ref={gridRef}
          style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "12px", maxWidth: maxW }}
        >
          {projects.map((project, idx) => (
            <BentoCard
              key={idx}
              project={project}
              spanTwo={idx === 0 && spanFirst && cols === 3}
              disableAnimations={false}
              particleCount={particleCount}
              glowColor={glowColor}
              enableTilt={enableTilt}
              clickEffect={clickEffect}
              enableMagnetism={enableMagnetism}
            />
          ))}
        </div>
      )}

      {/* Mobile: full-width stacked cards */}
      {isMobile && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {projects.map((project, idx) => {
            // Mirror BentoCard: fall back to a video thumbnail, treat "behance"
            // as a text badge, and never pass an empty src to next/image.
            const imageUrl = project.image ? resolveImage(project.image) : (extractVideoThumbnail(project.href) || "");
            return (
            <a
              key={idx}
              href={project.href}
              style={{
                display: "block",
                backgroundColor: "#0d0d0d",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.06)",
                overflow: "hidden",
                textDecoration: "none",
              }}
            >
              {/* full-width image */}
              <div style={{ position: "relative", aspectRatio: "16/9", width: "100%" }}>
                {project.image === "behance" ? (
                  <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="text-white font-bold text-5xl tracking-tighter">Bē</span>
                  </div>
                ) : imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div style={{ position: "absolute", inset: 0, background: "#1a1a1a" }} />
                )}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.6) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", top: 12, right: 12 }}>
                  <ArrowUpRight style={{ width: 20, height: 20, color: "white", filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.8))" }} />
                </div>
              </div>
              {/* text below */}
              <div style={{ padding: "14px 16px 16px" }}>
                <h5 style={{ fontWeight: 700, color: "#fff", fontSize: "1rem", marginBottom: 4, lineHeight: 1.3 }}>{project.title}</h5>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", lineHeight: 1.5 }}>{project.description}</p>
              </div>
            </a>
            );
          })}
        </div>
      )}

      <style>{`
        .mb-card {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
          --glow-radius: ${spotlightRadius}px;
          --glow-color: ${glowColor};
          transition: transform 0.2s ease;
        }
        .mb-card:hover { transform: translateY(-2px); }
        .mb-border-glow {
          background: radial-gradient(
            var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(var(--glow-color), calc(var(--glow-intensity) * 0.55)),
            transparent 65%
          );
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          padding: 1px;
        }
        @media (prefers-reduced-motion: reduce) {
          .mb-card { transition: none !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}
