'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'

interface LoadingScreenProps {
  onComplete: () => void
}

const WORDS = ['Vision', 'Craft', 'Strategy', 'Story', 'Purpose', 'Legacy']


const SVG_SIZE = 580
const C = SVG_SIZE / 2

const NUM_SPOKES = 12
const RINGS = [52, 145, 248]

function NetworkDecoration() {
  const spokes = Array.from({ length: NUM_SPOKES }, (_, i) => {
    const angle = (i / NUM_SPOKES) * Math.PI * 2
    return {
      x1: C + RINGS[0] * Math.sin(angle),
      y1: C - RINGS[0] * Math.cos(angle),
      x2: C + RINGS[2] * Math.sin(angle),
      y2: C - RINGS[2] * Math.cos(angle),
    }
  })

  const nodes = RINGS.flatMap(r =>
    Array.from({ length: NUM_SPOKES }, (_, i) => {
      const angle = (i / NUM_SPOKES) * Math.PI * 2
      return { cx: C + r * Math.sin(angle), cy: C - r * Math.cos(angle) }
    })
  )

  const ticks = Array.from({ length: 60 }, (_, i) => {
    const theta = (i / 60) * Math.PI * 2
    const r1 = RINGS[2]
    const r2 = i % 5 === 0 ? 234 : 241
    return {
      x1: C + r1 * Math.sin(theta),
      y1: C - r1 * Math.cos(theta),
      x2: C + r2 * Math.sin(theta),
      y2: C - r2 * Math.cos(theta),
    }
  })

  return (
    <svg
      width={SVG_SIZE}
      height={SVG_SIZE}
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 pointer-events-none"
      style={{ animation: 'aperture_spin 38s linear infinite' }}
    >
      {spokes.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke="rgba(255,184,0,0.055)" strokeWidth={0.5} />
      ))}
      <circle cx={C} cy={C} r={RINGS[0]} fill="none" stroke="rgba(255,184,0,0.18)"  strokeWidth={0.5} />
      <circle cx={C} cy={C} r={RINGS[1]} fill="none" stroke="rgba(255,184,0,0.06)"  strokeWidth={0.4} />
      <circle cx={C} cy={C} r={RINGS[2]} fill="none" stroke="rgba(255,184,0,0.035)" strokeWidth={0.4} />
      {nodes.map((n, i) => (
        <circle key={i} cx={n.cx} cy={n.cy} r={1.5} fill="rgba(255,184,0,0.22)" />
      ))}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke="rgba(255,184,0,0.08)" strokeWidth={0.5} />
      ))}
    </svg>
  )
}

export default function CinemaLoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress]       = useState(0)
  const [currentWord, setCurrentWord] = useState(WORDS[0])
  const [irisOpen, setIrisOpen]       = useState(true)
  const [flash, setFlash]             = useState(false)
  const [mounted, setMounted]         = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!mounted) return
    let idx = 0
    let t1: ReturnType<typeof setTimeout>
    let t2: ReturnType<typeof setTimeout>

    const interval = setInterval(() => {
      setFlash(true)
      setIrisOpen(false)
      t1 = setTimeout(() => setFlash(false), 90)
      t2 = setTimeout(() => {
        idx = (idx + 1) % WORDS.length
        setCurrentWord(WORDS[idx])
        setIrisOpen(true)
      }, 300)
    }, 900)

    return () => {
      clearInterval(interval)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const duration = 4000
    const start = performance.now()
    let animId: number

    const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

    function step(now: number) {
      const raw = Math.min((now - start) / duration, 1)
      const count = Math.floor(ease(raw) * 100)
      setProgress(count)
      if (raw < 1) {
        animId = requestAnimationFrame(step)
      } else {
        setProgress(100)
        setTimeout(() => onComplete(), 500)
      }
    }

    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [mounted, onComplete])

  if (!mounted) return <div className="fixed inset-0 bg-[#050505] z-[100]" />

  const padded = String(progress).padStart(3, '0')
  const frameCount = String(Math.floor(progress / 4)).padStart(3, '0')

  const irisClip = irisOpen
    ? 'circle(60% at 50% 50%)'
    : 'circle(0% at 50% 50%)'

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
      className="fixed inset-0 bg-[#050505] z-[100] overflow-hidden select-none"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Space+Mono&display=swap');

        @keyframes scan_anim {
          0%   { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes fade_in_anim {
          to { opacity: 1; }
        }
        @keyframes aperture_spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes rec_blink {
          0%, 100% { opacity: 0.85; }
          50%       { opacity: 0.1; }
        }
      `}} />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.38] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,184,0,0.06), transparent)',
          animation: 'scan_anim 4s linear infinite'
        }}
      />

      {/* Shutter flash overlay */}
      <div
        className="absolute inset-0 z-50 pointer-events-none bg-white"
        style={{
          opacity: flash ? 0.14 : 0,
          transition: flash ? 'none' : 'opacity 0.1s ease'
        }}
      />

      {/* Rotating network decoration */}
      <NetworkDecoration />

      {/* Viewfinder corners */}
      <div className="absolute top-[18px] left-[18px] w-[18px] h-[18px] border-t border-l border-white/10 z-10" />
      <div className="absolute top-[18px] right-[18px] w-[18px] h-[18px] border-t border-r border-white/10 z-10" />
      <div className="absolute bottom-[14px] left-[18px] w-[18px] h-[18px] border-b border-l border-white/10 z-10" />
      <div className="absolute bottom-[14px] right-[18px] w-[18px] h-[18px] border-b border-r border-white/10 z-10" />

      {/* Label — top left */}
      <div
        className="absolute top-[26px] left-[28px] z-10 opacity-0"
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 9,
          letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.18)',
          textTransform: 'uppercase',
          animation: 'fade_in_anim 0.8s ease 0.3s forwards'
        }}
      >
Tamzidur Rahman Navid
      </div>

      {/* REC indicator — top right */}
      <div
        className="absolute top-[24px] right-[28px] z-10 flex items-center gap-[6px] opacity-0"
        style={{ animation: 'fade_in_anim 0.8s ease 0.5s forwards' }}
      >
        <div
          className="w-[6px] h-[6px] rounded-full"
          style={{
            background: 'rgba(255,184,0,0.85)',
            animation: 'rec_blink 1.4s ease-in-out infinite'
          }}
        />
        <span
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 9,
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.18)',
            textTransform: 'uppercase'
          }}
        >
          REC
        </span>
      </div>

      {/* Center word — iris shutter clip-path */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center"
        style={{
          width: 'min(82vw, 680px)',
          padding: '64px 40px',
          clipPath: irisClip,
          transition: 'clip-path 0.28s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <span
          style={{
            fontFamily: 'DM Serif Display, Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(52px, 10vw, 112px)',
            color: 'rgba(255,255,255,0.82)',
            letterSpacing: '0.03em',
            lineHeight: 1.1,
            display: 'block'
          }}
        >
          {currentWord}
        </span>
      </div>

      {/* Counter — bottom right */}
      <div
        className="absolute bottom-[26px] right-[28px] z-10 text-right leading-none"
        style={{
          fontFamily: 'DM Serif Display, Georgia, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(52px, 8vw, 96px)',
          color: 'rgba(255,255,255,0.58)',
          letterSpacing: '0.02em',
          minWidth: 80
        }}
      >
        {padded}
      </div>

      {/* Frame label — bottom left */}
      <div
        className="absolute bottom-[30px] left-[28px] z-10 opacity-0"
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 9,
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.14)',
          textTransform: 'uppercase',
          animation: 'fade_in_anim 0.8s ease 0.4s forwards'
        }}
      >
        Frame {frameCount}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#FFB800]/[0.12] z-10">
        <div
          className="h-full bg-[#FFB800]"
          style={{ width: `${progress}%`, transition: 'width 0.05s linear' }}
        />
      </div>
    </motion.div>
  )
}
