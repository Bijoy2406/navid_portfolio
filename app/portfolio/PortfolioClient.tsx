"use client";

import Image from "next/image";
import { Mail, Phone, MapPin, Linkedin, User, Briefcase, FileText, Zap, Link as LinkIcon, Instagram } from "lucide-react";
import { MagicBentoGrid } from "@/components/MagicBento";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import type { SiteContent } from "@/lib/content";
import { resolveImage } from "@/lib/resolve-image";
import PulsingDot from "@/components/PulsingDot";
import CinemaLoadingScreen from "@/components/LoadingScreen";
import { BlurReveal } from "@/components/BlurReveal";

const accent = "text-[#FFB800]";
const bgAccent = "bg-[#FFB800]";

function getActiveSection() {
  const sections = ["home", "summary", "experience", "skills", "links"];
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

function LanguagesSection({ languages, accent }: { languages: { name: string; level: number }[]; accent: string }) {
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
    <section ref={sectionRef} className="py-20 md:py-28" id="languages">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className={`text-[26px] [@media(min-width:1600px)]:text-[30px] font-bold tracking-[-0.02em] leading-[130%] uppercase ${accent} mb-12`}
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
    <span
      className="relative inline-grid overflow-hidden whitespace-nowrap"
      style={{ verticalAlign: "bottom", gridTemplateAreas: '"stack"' }}
    >
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
          className="inline-block will-change-transform whitespace-nowrap"
          style={{ gridArea: "stack" }}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function PortfolioClient({ content }: { content: SiteContent }) {
  const { hero, summary, experience, skills, languages, education, links } = content;

  const [loading, setLoading] = useState(true);
  const [isBlurred, setIsBlurred] = useState(false);
  const blurOverlayRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState("home");
  const scrollLockRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrollingToSection = useRef(false);

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

      const triggerLine = window.innerHeight * 0.5;
      const marker2 = document.getElementById("marker-section-2");
      const linksSection = document.getElementById("links");
      // Blur ON once past hero (Summary marker crosses 50% viewport).
      // Blur OFF once Links section enters the viewport.
      // Same rule on all screen sizes.
      const pastSummary = marker2
        ? marker2.getBoundingClientRect().top <= triggerLine
        : false;

      const inLinksSection = linksSection
        ? linksSection.getBoundingClientRect().top <= triggerLine
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

  const socialBehance = links.socials.behance;

  return (
    <>
      <AnimatePresence>
        {loading && <CinemaLoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      <div className="bg-[#050505] text-neutral-300 min-h-screen font-sans selection:bg-[#FFB800]/30 selection:text-white relative overflow-x-hidden">

      {/* Background Image layer (fixed to viewport, blurs on scroll) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.4, ease: [0.44, 0, 0.56, 1] }}
        >
          <Image
            src={resolveImage(hero.background_image)}
            alt="Background Texture"
            fill
            priority
            className="object-cover object-[65%_31%] md:object-[57.8%_31%]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Animated Blur Overlay — transitions on #summary enter / #links enter */}
        <div
          ref={blurOverlayRef}
          className="absolute inset-0"
          style={{
            backdropFilter: isBlurred ? "blur(40px)" : "blur(0px)",
            backgroundColor: isBlurred ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
            transition: "backdrop-filter 0.6s cubic-bezier(0.44,0,0.56,1), background-color 0.6s cubic-bezier(0.44,0,0.56,1)",
          }}
        />

        {/* Shadow overlays */}
        {/* Mobile: heavy left+bottom fade so text on left stays readable */}
        <div className="absolute inset-0 md:hidden bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
        {/* Desktop: lighter left fade, image visible on right */}
        <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#050505] via-[#050505]/30 to-transparent" />
        {/* Bottom fade on all screens */}
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
        {/* Top fade on all screens */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#050505] to-transparent" />
      </div>

      <div className="relative z-10 max-w-[70rem] mx-auto px-5 min-[810px]:px-12 lg:px-8 pb-40 md:pr-48 lg:pr-8 lg:-translate-x-[50px]">

        {/* Header */}
        <header className="flex justify-between items-center py-10" id="home">
          <div className="flex items-center gap-3">
            <PulsingDot />
            <span className="text-white text-[18px] [@media(min-width:1600px)]:text-[20px] font-bold leading-[170%] tracking-wide">Portfolio</span>
          </div>
          <div className="md:hidden">
            <DownloadCVButton href={cvHref} />
          </div>
        </header>

        {/* Hero */}
        <section className="pb-24 md:pt-40 md:pb-40 flex flex-col md:justify-center min-h-screen">
          {/* On mobile: push role/name to ~50vh so photo shows above */}
          <div className="mt-[20vh] md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Role — Heading 3: 26px default, 30px ≥1600px */}
            <h2 className={`${accent} text-[16px] min-[360px]:text-[18px] min-[400px]:text-[22px] md:text-[26px] [@media(min-width:1600px)]:text-[30px] font-bold tracking-[-0.02em] uppercase leading-[130%] mb-3 overflow-hidden whitespace-nowrap`}>
              <RotatingText texts={ROTATING_ROLES} rotationInterval={1800} />
            </h2>
            {/* Name — scales from 36px on small phones up to 120px on wide screens */}
            <h1 className="text-[36px] min-[360px]:text-[70px] min-[400px]:text-[56px] md:text-[64px] [@media(min-width:1600px)]:text-[120px] leading-[90%] font-bold tracking-[-0.04em] text-white mb-8 md:mb-20 drop-shadow-md">
              {hero.name}
            </h1>

            {/* Contacts — Body L: 18px default, 20px ≥1600px */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 md:gap-y-4 gap-x-12 max-w-[40rem] font-bold mt-55 md:mt-0">
              <a href={`mailto:${hero.email}`} className="flex items-center gap-4 text-white text-[18px] [@media(min-width:1600px)]:text-[20px] leading-[170%] hover:text-[#FFB800] transition-colors">
                <Mail className={`w-6 h-6 ${accent}`} strokeWidth={1.5} />
                <span>{hero.email}</span>
              </a>
              <a href={`tel:${hero.phone}`} className="flex items-center gap-4 text-white text-[18px] [@media(min-width:1600px)]:text-[20px] leading-[170%] hover:text-[#FFB800] transition-colors">
                <Phone className={`w-6 h-6 ${accent}`} strokeWidth={1.5} />
                <span>{hero.phone}</span>
              </a>
              <a href={hero.linkedin.startsWith("http") ? hero.linkedin : `https://${hero.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white text-[18px] [@media(min-width:1600px)]:text-[20px] leading-[170%] hover:text-[#FFB800] transition-colors">
                <Linkedin className={`w-6 h-6 ${accent}`} strokeWidth={1.5} />
                <span>{hero.linkedin}</span>
              </a>
              <div className="flex items-center gap-4 text-white text-[18px] [@media(min-width:1600px)]:text-[20px] leading-[170%]">
                <MapPin className={`w-6 h-6 ${accent}`} strokeWidth={1.5} />
                <span>{hero.location}</span>
              </div>
            </div>
          </motion.div>
          </div>
        </section>

        {/* Summary */}
        <section className="py-20 md:py-28 font-medium relative" id="summary">
          <div id="marker-section-2" style={{ position: "absolute", top: 0, left: 0, width: 100, height: 100, opacity: 0, pointerEvents: "none", overflow: "hidden" }} />
          {/* Heading 2: 48px default, 56px ≥1600px */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`text-[48px] [@media(min-width:1600px)]:text-[56px] font-bold tracking-[-0.02em] leading-[100%] capitalize ${accent} mb-12`}
          >
            Summary
          </motion.h2>

          {/* Body: 16px/400w default, 18px ≥1600px */}
          <div className="max-w-[44rem] space-y-8 text-white leading-[170%] text-[16px] [@media(min-width:1600px)]:text-[18px] font-normal lg:text-left">
            {summary.paragraphs[0] && (
              <BlurReveal delay={0}>{summary.paragraphs[0]}</BlurReveal>
            )}
            {summary.paragraphs[1] && (
              <BlurReveal delay={0} className="text-white">{summary.paragraphs[1]}</BlurReveal>
            )}

            {/* Quote: 32px desktop, 26px tablet/mobile, 36px ≥1600px */}
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`border-l-[4px] border-[#FFB800] pl-6 md:pl-8 py-2 mt-20 text-[26px] md:text-[32px] [@media(min-width:1600px)]:text-[36px] font-bold text-white leading-[130%] tracking-[-0.02em] max-w-[42rem]`}
            >
              <BlurReveal as="span" delay={0.1} stagger={0.04}>{summary.blockquote}</BlurReveal>
            </motion.blockquote>

            {summary.paragraphs[2] && (
              <BlurReveal delay={0} className="mt-8 text-white leading-[170%] text-[16px] [@media(min-width:1600px)]:text-[18px] font-normal lg:text-left">{summary.paragraphs[2]}</BlurReveal>
            )}
          </div>
        </section>

        {/* Work Experience */}
        <section className="py-20 md:py-28" id="experience">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`text-[48px] [@media(min-width:1600px)]:text-[56px] font-bold tracking-[-0.02em] leading-[100%] capitalize ${accent} mb-20`}
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <h3 className={`text-[26px] [@media(min-width:1600px)]:text-[30px] font-bold uppercase tracking-[-0.02em] leading-[130%] ${accent}`}>{job.title}</h3>
                      <span className={`text-[16px] [@media(min-width:1600px)]:text-[18px] font-normal leading-[170%] ${accent}`}>{job.period}</span>
                    </div>
                    <div className="mb-8 text-[18px] [@media(min-width:1600px)]:text-[20px] font-bold leading-[170%] text-white">{job.company}</div>

                    <BlurReveal delay={0} className="text-white leading-[170%] text-[16px] [@media(min-width:1600px)]:text-[18px] font-normal mb-10 max-w-3xl lg:text-left">
                      {job.description}
                    </BlurReveal>

                    <div className="mb-12">
                      <h4 className={`${accent} text-sm font-semibold mb-6 uppercase tracking-widest`}>Selected Projects</h4>
                      <MagicBentoGrid projects={job.projects} />
                    </div>

                    <ul className="space-y-4">
                      {job.bullets.map((item, i) => (
                        <li key={i} className="flex gap-4 items-start text-white text-[16px] [@media(min-width:1600px)]:text-[18px] font-normal leading-[170%]">
                          <span className={`${accent} mt-[2px] shrink-0`}>—</span>
                          <BlurReveal as="span" delay={i * 0.06} stagger={0.03} className="lg:text-left">{item}</BlurReveal>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Skills & Tools */}
        <section className="py-20 md:py-28" id="skills">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`text-[48px] [@media(min-width:1600px)]:text-[56px] font-bold tracking-[-0.02em] leading-[100%] capitalize ${accent} mb-16`}
          >
            Skills & Tools
          </motion.h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mb-20 max-w-3xl ml-2">
            {skills.skills.map((skill, idx) => (
              <li key={idx} className="flex items-center gap-4 text-white text-[16px] [@media(min-width:1600px)]:text-[18px] font-normal leading-[170%]">
                <div className={`w-2 h-2 rounded-full ${bgAccent} opacity-80 shrink-0`} />
                <BlurReveal as="span" delay={idx * 0.07} stagger={0.04}>{skill}</BlurReveal>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-12 gap-x-8">
            {skills.tools.map((tool, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4 cursor-pointer group">
                <div className="w-16 h-16 relative">
                  <Image src={resolveImage(tool.image)} alt={tool.name} fill className="object-contain" referrerPolicy="no-referrer" />
                </div>
                <span className="text-sm font-medium text-white transition-colors">{tool.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Languages */}
        <LanguagesSection languages={languages.languages} accent={accent} />

        {/* Education */}
        <section className="py-20 md:py-28">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`text-[26px] [@media(min-width:1600px)]:text-[30px] font-bold tracking-[-0.02em] leading-[130%] uppercase ${accent} mb-12`}
          >
            Education & Certificates
          </motion.h2>

          <div className="space-y-12">
            {education.education.map((edu, idx) => (
              <div key={`edu-${idx}`} className="flex gap-6">
                <div className={`w-2.5 h-2.5 mt-2 rounded-full ${bgAccent} shrink-0`} />
                <div>
                  <BlurReveal as="h3" delay={idx * 0.08} className="text-xl font-bold text-white mb-2">{edu.institution}</BlurReveal>
                  <BlurReveal as="p" delay={idx * 0.08 + 0.05} className={`${accent} font-medium`}>{`${edu.degree} — ${edu.year}`}</BlurReveal>
                </div>
              </div>
            ))}
            {education.certificates.map((cert, idx) => (
              <div key={`cert-${idx}`} className="flex gap-6">
                <div className={`w-2.5 h-2.5 mt-2 rounded-full ${bgAccent} shrink-0`} />
                <div>
                  <BlurReveal as="h3" delay={idx * 0.08} className="text-xl font-bold text-white mb-2">{cert.name}</BlurReveal>
                  <BlurReveal as="p" delay={idx * 0.08 + 0.05} className={`${accent} font-medium`}>{cert.date}</BlurReveal>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Links */}
        <section className="py-20 md:py-28 relative" id="links">
          <div id="marker-section-5" style={{ position: "absolute", top: 0, left: 0, width: 100, height: 100, opacity: 0, pointerEvents: "none", overflow: "hidden" }} />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`text-[48px] [@media(min-width:1600px)]:text-[56px] font-bold tracking-[-0.02em] leading-[100%] capitalize ${accent} mb-12`}
          >
            Links
          </motion.h2>

          <div className="flex flex-wrap gap-4 mb-16">
             <a href={links.socials.linkedin} className="w-14 h-14 rounded-lg flex items-center justify-center bg-[#0077B5] hover:opacity-80 transition-opacity">
                <Linkedin className="w-7 h-7 text-white" fill="currentColor" stroke="none" />
             </a>
             <a href={links.socials.dribbble} className="w-14 h-14 rounded-lg flex items-center justify-center bg-[#EA4C89] hover:opacity-80 transition-opacity">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 24C5.385 24 0 18.614 0 12h0C0 5.385 5.385 0 12 0h0c6.614 0 12 5.385 12 12h0C24 18.614 18.614 24 12 24zm0-22C6.486 2 2 6.485 2 12c0 5.513 4.486 9.998 9.998 9.998 5.515 0 10.002-4.485 10.002-9.998C22 6.485 17.514 2 12 2zm8.01 7.228A9.78 9.78 0 0012.002 2.004v.002c-1.42 0-2.77.303-3.99.85 2.146 1.83 3.868 4.3 4.908 7.07 3.32-.494 5.922-2.102 7.09-3.696zm-1.89 8.788A9.996 9.996 0 0012 21.996c-1.124 0-2.2-.2-3.19-.56 1.134-2.85 1.025-5.91-.252-8.625 3.52 1.05 7.647 1.03 9.56 1.206.012.33.02 0 .02.002 0 1.455-.306 2.836-.856 4.07h.002z"></path>
                </svg>
             </a>
             <a href={links.socials.twitter} className="w-14 h-14 rounded-lg flex items-center justify-center bg-black border border-white/10 hover:bg-neutral-900 transition-colors">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
             </a>
             <a href={links.socials.instagram} className="w-14 h-14 rounded-lg flex items-center justify-center bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:opacity-80 transition-opacity">
                <Instagram className="w-7 h-7 text-white" />
             </a>
             <a href={socialBehance} className="w-14 h-14 rounded-lg flex items-center justify-center bg-black border border-white/10 hover:bg-neutral-900 transition-colors">
                <span className="text-white font-bold text-2xl tracking-tighter">Bē</span>
             </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
            <div className="flex items-center gap-4 text-white text-[18px] [@media(min-width:1600px)]:text-[20px] font-bold leading-[170%]">
              <Mail className={`w-6 h-6 ${accent}`} />
              <span>{links.email}</span>
            </div>
            <div className="flex items-center gap-4 text-white text-[18px] [@media(min-width:1600px)]:text-[20px] font-bold leading-[170%]">
              <Phone className={`w-6 h-6 ${accent}`} />
              <span>{links.phone}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Download CV — desktop + tablet only */}
      <div className="hidden md:block fixed top-8 right-8 lg:right-12 z-50">
        <DownloadCVButton href={cvHref} />
      </div>

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex items-center gap-1 z-50 shadow-2xl">
        {[
          { id: "home", label: "Home", icon: User },
          { id: "summary", label: "Summary", icon: Briefcase },
          { id: "experience", label: "Experience", icon: FileText },
          { id: "skills", label: "Skills", icon: Zap },
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
              className={`relative px-5 py-2.5 flex items-center gap-2 text-sm font-semibold transition-colors rounded-full ${isActive ? 'text-[#3E2B15]' : 'text-neutral-300 hover:text-white'}`}
            >
              <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-[#3E2B15]' : 'text-white'}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="hidden sm:inline relative z-10">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white rounded-full z-0 shadow-sm"
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
