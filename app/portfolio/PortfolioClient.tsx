"use client";

import Image from "next/image";
import { Mail, Phone, MapPin, Linkedin, User, Briefcase, FileText, Zap, Link as LinkIcon, Instagram, Trophy } from "lucide-react";
import { MagicBentoGrid } from "@/components/MagicBento";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, useCallback } from "react";
import type { SiteContent } from "@/lib/content";
import { resolveImage } from "@/lib/resolve-image";
import PulsingDot from "@/components/PulsingDot";
import Loader from "@/components/LoadingScreen";
import { BlurReveal } from "@/components/BlurReveal";
import "./portfolio.css";

const LOADER_SESSION_KEY = "portfolio-loader-played";

function shouldPlayLoaderThisSession() {
  if (typeof window === "undefined") return false;

  try {
    return sessionStorage.getItem(LOADER_SESSION_KEY) !== "true";
  } catch {
    return true;
  }
}

function GlobalCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [onLink, setOnLink] = useState(false);
  // Only enable the custom cursor on devices with a fine pointer (mouse/trackpad).
  // Touch devices (mobile/tablet) have no hover cursor, so we skip it entirely.
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setHasFinePointer(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!hasFinePointer) return;
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const onLinkOrButton = !!el?.closest('a, button');
      const hasCustomCursor = !!el?.closest('[data-custom-cursor]');
      setOnLink(onLinkOrButton && !hasCustomCursor);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [hasFinePointer]);

  if (!hasFinePointer) return null;

  return (
    <AnimatePresence>
      {onLink && (
        <motion.div
          key="global-cursor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{ position: 'fixed', left: pos.x, top: pos.y, pointerEvents: 'none', zIndex: 99999 }}
        >
          <svg width="20" height="22" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L24 14L14.5 16.5L9.5 28L2 2Z" fill="#FFB800" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SocialLink({ href, label, children, background, border }: { href: string; label: string; children: React.ReactNode; background: string; border?: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="social-link">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="social-btn"
        style={{ background, border }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </a>
      {showTooltip && (
        <div className="social-tooltip">
          {label}
        </div>
      )}
    </div>
  );
}

function getActiveSection() {
  const sections = ["home", "summary", "experience", "skills", "achievements", "links"];
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) return "links";
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = document.getElementById(sections[i]);
    if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.4) {
      return sections[i];
    }
  }
  return "home";
}

function DownloadCVButton({ href }: { href: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="download-cv-btn"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontWeight: 600,
        fontSize: "14px",
        padding: "10px 28px",
        borderRadius: 100,
        overflow: "hidden",
        textDecoration: "none",
        color: "#1A1A1A",
        background: hovered ? "#fff" : "#FFB800",
        transition: "background 0.35s ease",
        whiteSpace: "nowrap",
        minWidth: 140,
      }}
    >
      {/* slide-in fill from top */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          background: "#fff",
          borderRadius: "inherit",
          transform: hovered ? "translateY(0%)" : "translateY(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 0,
        }}
      />

      {/* label — slides down and fades out */}
      <span
        style={{
          position: "relative",
          zIndex: 1,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          transform: hovered ? "translateY(140%)" : "translateY(0%)",
          opacity: hovered ? 0 : 1,
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
        }}
      >
        Download CV
      </span>

      {/* download icon — slides down from above */}
      <span
        style={{
          position: "absolute",
          zIndex: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transform: hovered ? "translateY(0%)" : "translateY(-140%)",
          opacity: hovered ? 1 : 0,
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1) 0.05s, opacity 0.25s ease 0.05s",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z"
            fill="#1A1A1A"
          />
        </svg>
      </span>
    </a>
  );
}

function LanguagesSection({ languages }: { languages: { name: string; level: number }[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const fillRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const fills = fillRefs.current;

    function animateBars() {
      fills.forEach((fill) => {
        if (!fill) return;
        const target = fill.dataset.target ?? "0";
        const delay = fill.dataset.delay ?? "0";
        setTimeout(() => {
          fill.style.width = target + "%";
        }, parseFloat(delay) * 1000);
      });
    }

    let hasAnimated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateBars();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const delays = [0.4, 0.5, 0.6];

  return (
    <section ref={sectionRef} className="section" id="languages">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="section-title section-title--sm"
      >
        Languages
      </motion.h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {languages.map((lang, idx) => (
          <div
            key={idx}
            style={{ display: "flex", flexDirection: "row", alignItems: "center", overflow: "hidden" }}
          >
            <span
              style={{
                width: "87px",
                flexShrink: 0,
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: "18px",
                lineHeight: "170%",
                color: "white",
              }}
            >
              {lang.name}
            </span>
            <div
              style={{
                position: "relative",
                width: "320px",
                height: "8px",
                borderRadius: "99px",
                background: "rgba(255, 184, 0, 0.2)",
                overflow: "hidden",
              }}
            >
              <div
                ref={(el) => { fillRefs.current[idx] = el; }}
                data-target={lang.level}
                data-delay={delays[idx] ?? 0.4 + idx * 0.1}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "0%",
                  borderRadius: "999px",
                  background: "rgb(255, 184, 0)",
                  transition: "width 1.2s cubic-bezier(0.37, 0, 0.63, 1)", /* impeccable-disable layout-transition — position:absolute fill bar, no reflow */
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AuroraGlow() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
    </div>
  );
}

function BlurRevealName({ text, start }: { text: string; start: boolean }) {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.04, delayChildren: 0.15 } },
  };
  const letter = {
    hidden: { y: 24, opacity: 0, filter: "blur(12px)" },
    show: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 120, damping: 16 },
    },
  };

  // Split into whole words so the browser can never break *inside* a word.
  // Each word is a nowrap inline-block unit; letters still animate individually.
  // Line counts are controlled per breakpoint via the .hero-name-word classes:
  //  - Mobile:  every word on its own line
  //  - Tablet (>=640px): earlier words inline, last word on its own line
  //  - Desktop (>=1024px): all inline (one line)
  const words = text.trim().split(/\s+/);
  const lastIdx = words.length - 1;

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate={start ? "show" : "hidden"}
      aria-label={text}
      className="hero-name"
    >
      {words.map((word, wi) => {
        const isLastWord = wi === lastIdx;
        const wordClass = isLastWord ? "hero-name-word--last" : "hero-name-word";

        return (
          <span key={wi} className={wordClass}>
            {word.split("").map((char, ci) => (
              <motion.span
                key={`${wi}-${ci}`}
                variants={letter}
                aria-hidden="true"
                className="hero-name-letter"
              >
                {char}
              </motion.span>
            ))}
            {!isLastWord && (
              <motion.span
                variants={letter}
                aria-hidden="true"
                className="hero-name-space"
              >
                {" "}
              </motion.span>
            )}
          </span>
        );
      })}
    </motion.h1>
  );
}

const ROTATING_ROLES = [
  "Aspiring Product Manager",
  "Public Relations",
  "Ambassador",
  "Freelance Content Creator",
];

function RotatingText({ texts, rotationInterval = 2500 }: { texts: string[]; rotationInterval?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % texts.length), rotationInterval);
    return () => clearInterval(id);
  }, [texts.length, rotationInterval]);

  return (
    <span className="rotating">
      <span className="sr-only">{texts[index]}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          aria-hidden={true}
          initial={{ y: "65%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-65%", opacity: 0, filter: "blur(6px)" }}
          transition={{
            y: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.38, ease: "easeOut" },
            filter: { duration: 0.4, ease: "easeOut" },
          }}
          className="rotating-item"
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function PortfolioClient({ content }: { content: SiteContent }) {
  const { hero, summary, experience, skills, languages, education, achievements, links } = content;

  const [showLoader, setShowLoader] = useState(shouldPlayLoaderThisSession);
  const loaderCompleteRef = useRef(false);
  const minimumLoaderTimeElapsedRef = useRef(false);
  const windowLoadedRef = useRef(!shouldPlayLoaderThisSession());
  const [isBlurred, setIsBlurred] = useState(false);
  const blurOverlayRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState("home");
  const scrollLockRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrollingToSection = useRef(false);

  const finishLoaderIfReady = useCallback(() => {
    setShowLoader((current) => {
      if (
        current &&
        loaderCompleteRef.current &&
        minimumLoaderTimeElapsedRef.current &&
        windowLoadedRef.current
      ) {
        return false;
      }

      return current;
    });
  }, []);

  useEffect(() => {
    if (!showLoader) return;

    try {
      sessionStorage.setItem(LOADER_SESSION_KEY, "true");
    } catch {
      // sessionStorage may be unavailable in private/restricted contexts.
    }

    const minimumTimer = window.setTimeout(() => {
      minimumLoaderTimeElapsedRef.current = true;
      finishLoaderIfReady();
    }, 5500);

    const markWindowLoaded = () => {
      windowLoadedRef.current = true;
      finishLoaderIfReady();
    };

    let readyStateTimer: number | undefined;

    if (document.readyState === "complete") {
      readyStateTimer = window.setTimeout(markWindowLoaded, 0);
    } else {
      window.addEventListener("load", markWindowLoaded, { once: true });
    }

    return () => {
      window.clearTimeout(minimumTimer);
      if (readyStateTimer !== undefined) window.clearTimeout(readyStateTimer);
      window.removeEventListener("load", markWindowLoaded);
    };
  }, [finishLoaderIfReady, showLoader]);

  const handleLoaderComplete = useCallback(() => {
    loaderCompleteRef.current = true;
    finishLoaderIfReady();
  }, [finishLoaderIfReady]);

  useEffect(() => {
    // Blur is derived from ABSOLUTE scroll position, not scroll direction.
    // Reading marker positions on every frame works identically whether the
    // user scrolls smoothly or jumps via an anchor link, so nav clicks and
    // scrolling stay in sync. The 50% viewport line is the trigger point,
    // matching the original `threshold: 0.5` design intent.
    //
    // Blur ON  : trigger line is at/past the Summary marker (#marker-section-2)
    // Blur OFF : Links section top enters the viewport
    //            — desktop/tablet only; on mobile there is no upper bound so
    //            content stays blurred to the end (per design spec).
    const computeState = () => {
      if (!isScrollingToSection.current) setActiveSection(getActiveSection());

      const blurStartLine = window.innerHeight * 0.9;
      const blurEndLine = window.innerHeight * 0.93;
      const marker2 = document.getElementById("marker-section-2");
      const linksSection = document.getElementById("links");
      // Blur ON once past hero (Summary marker crosses blurStartLine).
      // Blur OFF once Links section enters blurEndLine.
      const pastSummary = marker2
        ? marker2.getBoundingClientRect().top <= blurStartLine
        : false;

      const inLinksSection = linksSection
        ? linksSection.getBoundingClientRect().top <= blurEndLine
        : false;

      const shouldBlur = pastSummary && !inLinksSection;


      setIsBlurred(prev => (prev === shouldBlur ? prev : shouldBlur));
    };

    computeState();
    // Passive listeners; rAF-throttled so we read layout at most once per frame.
    let ticking = false;
    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        computeState();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (scrollLockRef.current) clearTimeout(scrollLockRef.current);
    };
  }, []);

  const cvHref =
    hero.cv_url === "#"
      ? "#"
      : hero.cv_url.startsWith("http")
        ? hero.cv_url
        : `https://${hero.cv_url}`;

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && <Loader onComplete={handleLoaderComplete} />}
      </AnimatePresence>
      <GlobalCursor />
      <div className="portfolio">

        {/* Background Image layer (fixed to viewport, blurs on scroll) */}
        <div className="bg-layer">
          <motion.div
            className="bg-image-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.4, ease: [0.44, 0, 0.56, 1] }}
          >
            <Image
              src={resolveImage(hero.background_image)}
              alt="Background Texture"
              fill
              priority
              className="bg-image"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Aurora gold glow — drifts behind hero, above image, below blur/shadows */}
          <AuroraGlow />

          {/* Animated Blur Overlay — transitions on #summary enter / #links enter */}
          <div
            ref={blurOverlayRef}
            className="blur-overlay"
            style={{
              backdropFilter: isBlurred ? "blur(40px)" : "blur(0px)",
              backgroundColor: isBlurred ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
              transition: "backdrop-filter 0.6s cubic-bezier(0.44,0,0.56,1), background-color 0.6s cubic-bezier(0.44,0,0.56,1)",
            }}
          />

          {/* Shadow overlays */}
          {/* Mobile: heavy left+bottom fade so text on left stays readable */}
          <div className="fade-left-mobile" />
          {/* Desktop: lighter left fade, image visible on right */}
          <div className="fade-left-desktop" />
          {/* Bottom fade on all screens */}
          <div className="fade-bottom" />
          {/* Top fade on all screens */}
          <div className="fade-top" />
        </div>

        <div className="content">

          {/* Header */}
          <header className="site-header" id="home">
            <div className="brand">
              <PulsingDot />
              <span className="brand-name">Portfolio</span>
            </div>
            <div className="cv-mobile">
              <DownloadCVButton href={cvHref} />
            </div>
          </header>

          {/* Hero */}
          <section className="hero">
            {/* On mobile: push role/name down so photo shows above */}
            <div className="hero-inner">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                {/* Role */}
                <h2 className="hero-role">
                  <RotatingText texts={ROTATING_ROLES} rotationInterval={1800} />
                </h2>
                {/* Name — mobile unchanged, tablet ~one line, desktop always one line */}
                <BlurRevealName text={hero.name} start={!showLoader} />

                {/* Contacts — styles live in portfolio.css (.contacts-grid / .contact-item) */}
                <div className="contacts-grid">

                  <a href={`mailto:${hero.email}`} className="contact-item">
                    <Mail strokeWidth={1.5} />
                    <span>{hero.email}</span>
                  </a>
                  <a href={`tel:${hero.phone}`} className="contact-item">
                    <Phone strokeWidth={1.5} />
                    <span>{hero.phone}</span>
                  </a>
                  <a href={hero.linkedin.startsWith("http") ? hero.linkedin : `https://${hero.linkedin}`} target="_blank" rel="noopener noreferrer" className="contact-item">
                    <Linkedin strokeWidth={1.5} />
                    <span>{hero.linkedin}</span>
                  </a>
                  <div className="contact-item">
                    <MapPin strokeWidth={1.5} />
                    <span>{hero.location}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* About Me */}
          <section className="section section--about" id="summary">
            <div id="marker-section-2" style={{ position: "absolute", top: 0, left: 0, width: 100, height: 100, opacity: 0, pointerEvents: "none", overflow: "hidden" }} />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="section-title"
            >
              About Me
            </motion.h2>

            <div className="about-body">
              {summary.paragraphs[0] && (
                <BlurReveal delay={0}>{summary.paragraphs[0]}</BlurReveal>
              )}
              {summary.paragraphs[1] && (
                <BlurReveal delay={0}>{summary.paragraphs[1]}</BlurReveal>
              )}

              <motion.blockquote
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="about-quote"
              >
                <BlurReveal as="span" delay={0.1} stagger={0.04}>{summary.blockquote}</BlurReveal>
              </motion.blockquote>

              {summary.paragraphs[2] && (
                <BlurReveal delay={0}>{summary.paragraphs[2]}</BlurReveal>
              )}
            </div>
          </section>

          {/* Work Experience */}
          <section className="section" id="experience">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="section-title space-lg"
            >
              Work Experience
            </motion.h2>

            <div>
              {experience.jobs.map((job, jobIdx) => {
                const isFirst = jobIdx === 0;
                const isLast = jobIdx === experience.jobs.length - 1;
                return (
                  <motion.div
                    key={jobIdx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "16px", width: "100%" }}
                  >
                    {/* Left timeline connector column — 9px wide */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "9px", flexShrink: 0, overflow: "hidden", alignSelf: "stretch" }}>
                      {isFirst ? (
                        /* First entry: 16px transparent spacer above dot */
                        <div style={{ width: "1px", height: "16px", background: "transparent", flexShrink: 0 }} />
                      ) : (
                        /* Middle/last entries: 12px gray line from above + 4px spacer */
                        <>
                          <div style={{ width: "1px", height: "12px", background: "rgba(153,153,153,0.5)", flexShrink: 0 }} />
                          <div style={{ width: "1px", height: "4px", background: "transparent", flexShrink: 0 }} />
                        </>
                      )}
                      {/* Yellow dot */}
                      <div style={{ width: "9px", height: "9px", borderRadius: "9999px", background: "rgb(255,184,0)", flexShrink: 0 }} />
                      {/* 4px spacer below dot */}
                      <div style={{ width: "1px", height: "4px", background: "transparent", flexShrink: 0 }} />
                      {/* Line down — grows to fill remaining entry height */}
                      <div style={{ width: "1px", flex: 1, background: "rgba(153,153,153,0.5)", flexShrink: 0 }} />
                      {isLast && (
                        /* Gradient fade at the very bottom of the last entry */
                        <div style={{ width: "1px", height: "120px", background: "linear-gradient(180deg, rgba(153,153,153,0.5) 0%, rgba(153,153,153,0) 100%)", flexShrink: 0 }} />
                      )}
                    </div>

                    {/* Right content column */}
                    <div style={{ flex: 1, paddingBottom: "80px" }}>
                      <div className="job-head">
                        <h3 className="job-title">{job.title}</h3>
                        <span className="job-period">{job.period}</span>
                      </div>
                      <div className="job-company">{job.company}</div>

                      <BlurReveal delay={0} className="job-desc">
                        {job.description}
                      </BlurReveal>

                      {job.projects && job.projects.length > 0 && (
                        <div className="job-projects">
                          <h4 className="job-projects-label">Selected Projects</h4>
                          <MagicBentoGrid projects={job.projects} />
                        </div>
                      )}

                      {job.bullets && job.bullets.length > 0 && (
                        <ul className="job-bullets">
                          {job.bullets.map((item, i) => (
                            <li key={i} className="job-bullet">
                              <span className="job-bullet-dash">—</span>
                              <BlurReveal as="span" delay={i * 0.06} stagger={0.03} className="lg-text-left">{item}</BlurReveal>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Skills & Tools */}
          <section className="section" id="skills">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="section-title space-md"
            >
              Skills & Tools
            </motion.h2>

            <ul className="skills-list">
              {skills.skills.map((skill, idx) => (
                <li key={idx} className="skill-item">
                  <div className="skill-dot" />
                  <BlurReveal as="span" delay={idx * 0.07} stagger={0.04}>{skill}</BlurReveal>
                </li>
              ))}
            </ul>

            <div className="tools-grid">
              {skills.tools.map((tool, idx) => (
                <div key={idx} className="tool-item">
                  {/* Fixed 64px-tall row keeps every label on the same baseline,
                      regardless of icon shape. `size` sets the icon WIDTH (px);
                      height follows the image's aspect ratio and is capped to the
                      row so wide wordmarks (e.g. Stitch) get bigger without
                      reserving empty vertical space that pushes the label down. */}
                  <div className="tool-icon">
                    <Image
                      src={resolveImage(tool.image)}
                      alt={tool.name}
                      width={tool.size ?? 64}
                      height={64}
                      className="tool-img"
                      style={{ width: tool.size ?? 64 }}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="tool-name">{tool.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Languages */}
          <LanguagesSection languages={languages.languages} />

          {/* Education */}
          <section className="section">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="section-title section-title--sm"
            >
              Education
            </motion.h2>

            <div className="edu-list">
              {education.education.map((edu, idx) => (
                <div key={`edu-${idx}`} className="edu-item">
                  <div className="edu-dot" />
                  <div>
                    <BlurReveal as="h3" delay={idx * 0.08} className="edu-title">{edu.institution}</BlurReveal>
                    <BlurReveal as="p" delay={idx * 0.08 + 0.05} className="edu-meta">{`${edu.degree} — ${edu.year}`}</BlurReveal>
                  </div>
                </div>
              ))}
              {education.certificates?.map((cert, idx) => (
                <div key={`cert-${idx}`} className="edu-item">
                  <div className="edu-dot" />
                  <div>
                    <BlurReveal as="h3" delay={idx * 0.08} className="edu-title">{cert.name}</BlurReveal>
                    <BlurReveal as="p" delay={idx * 0.08 + 0.05} className="edu-meta">{cert.date}</BlurReveal>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Achievements & Awards */}
          <section className="section" id="achievements">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="section-title"
            >
              Achievements &amp; Awards
            </motion.h2>

            <ul className="ach-list">
              {achievements.achievements.map((item, idx) => (
                <li key={idx} className="ach-item">
                  <span className="ach-dot" />
                  <BlurReveal as="span" delay={idx * 0.06} stagger={0.02} className="lg-text-left">{item}</BlurReveal>
                </li>
              ))}
            </ul>
          </section>

          {/* Links */}
          <section className="section" id="links">
            <div id="marker-section-5" style={{ position: "absolute", top: 0, left: 0, width: 100, height: 100, opacity: 0, pointerEvents: "none", overflow: "hidden" }} />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="section-title"
            >
              Links
            </motion.h2>

            <div className="social-row">
              {links.socials.linkedin && (
                <SocialLink href={links.socials.linkedin} label="LinkedIn" background="#0077B5">
                  <Linkedin className="social-icon" fill="currentColor" stroke="none" />
                </SocialLink>
              )}
              {links.socials.fb_personal && (
                <SocialLink href={links.socials.fb_personal} label="Facebook Personal" background="#1877F2">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </SocialLink>
              )}
              {links.socials.snapshot_fb && (
                <SocialLink href={links.socials.snapshot_fb} label="Facebook Page" background="#145DB2">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </SocialLink>
              )}
              {links.socials.instagram && (
                <SocialLink href={links.socials.instagram} label="Instagram" background="linear-gradient(to top right, #facc15, #ec4899, #9333ea)">
                  <Instagram className="social-icon" />
                </SocialLink>
              )}
              {links.socials.behance && (
                <SocialLink href={links.socials.behance} label="Behance" background="#000" border="1px solid rgba(255,255,255,0.1)">
                  <span className="social-be">Bē</span>
                </SocialLink>
              )}
            </div>

            <div className="links-contacts">
              <div className="links-contact">
                <Mail className="links-contact-icon" />
                <span>{links.email}</span>
              </div>
              <div className="links-contact">
                <Phone className="links-contact-icon" />
                <span>{links.phone}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Sticky Download CV — desktop + tablet only */}
        <div className="cv-sticky">
          <DownloadCVButton href={cvHref} />
        </div>

        {/* Floating Bottom Nav */}
        <nav className="bottom-nav">
          {[
            { id: "home", label: "Home", icon: User },
            { id: "summary", label: "About Me", icon: Briefcase },
            { id: "experience", label: "Experience", icon: FileText },
            { id: "skills", label: "Skills", icon: Zap },
            { id: "achievements", label: "Awards", icon: Trophy },
            { id: "links", label: "Links", icon: LinkIcon }
          ].map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => {
                  if (scrollLockRef.current) clearTimeout(scrollLockRef.current);
                  isScrollingToSection.current = true;
                  setActiveSection(item.id);
                  scrollLockRef.current = setTimeout(() => {
                    isScrollingToSection.current = false;
                  }, 1000);
                }}
                className={isActive ? "nav-link active" : "nav-link"}
              >
                <Icon className="nav-icon" strokeWidth={isActive ? 2.5 : 2} />
                <span className="nav-label">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </>
  );
}
