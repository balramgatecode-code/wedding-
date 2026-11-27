import { useEffect, useId, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { GANESH_PATH, GANESH_W, GANESH_H, ORNAMENT_PATH } from './glyphs'
import {
  COUPLE, COUNTDOWN_TARGET, WEDDING_DATE_LONG, WEDDING_DATE_SHORT, FAMILY_NAME, FAMILY_HINDI,
  VENUE, DIRECTIONS_URL, MAP_EMBED_URL, EVENTS, BRIDE_FAMILY, GROOM_FAMILY, FAMILY_GROUPS, NIHARATI,
  CONTACT, RSVP_ENDPOINT, GALLERY, GALLERY_PLACEHOLDERS, MUSIC_SRC, BLESSINGS,
} from './data'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const B = COUPLE.bride, G = COUPLE.groom
const NAMES = `${B.name} & ${G.name}`
const INITIALS = `${B.initial} & ${G.initial}`

function timeLeft() {
  const ms = Math.max(0, COUNTDOWN_TARGET - Date.now())
  return [Math.floor(ms / 864e5), Math.floor(ms / 36e5) % 24, Math.floor(ms / 6e4) % 60, Math.floor(ms / 1e3) % 60]
}

/* ───────── small pieces ───────── */
function Ornament({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 220 50" fill="none" aria-hidden="true">
      <path d={ORNAMENT_PATH} stroke="currentColor" strokeWidth="1.3" />
      <circle cx="110" cy="25" r="5" fill="currentColor" />
    </svg>
  )
}

function Ganesh({ className = '' }) {
  const id = `ganesh-fill-${useId().replace(/:/g, '')}`
  return (
    <svg className={className} viewBox={`0 0 ${GANESH_W} ${GANESH_H}`} aria-hidden="true" focusable="false">
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={GANESH_W} height={GANESH_H}>
          <rect data-fill="top" x="0" y="0" width={GANESH_W} height="0" fill="white" />
          <rect data-fill="bottom" x="0" y={GANESH_H} width={GANESH_W} height="0" fill="white" />
          <rect data-fill="left" x="0" y="0" width="0" height={GANESH_H} fill="white" />
          <rect data-fill="right" x={GANESH_W} y="0" width="0" height={GANESH_H} fill="white" />
        </mask>
      </defs>
      <path d={GANESH_PATH} fill="currentColor" fillRule="evenodd" mask={`url(#${id})`} />
    </svg>
  )
}

function Mandala({ side }) {
  return (
    <div className={`mandala-scroll mandala-scroll--${side}`} aria-hidden="true">
      <div className="mandala-spin"><img src="/assets/hero/floral-rangoli.webp" alt="" loading="lazy" /></div>
    </div>
  )
}

function FlowerFall() {
  return (
    <div className="flower-fall" aria-hidden="true">
      {Array.from({ length: 10 }, (_, a) => (
        <span key={a} className="falling-flower" style={{
          '--flower-left': `${(a * 43 + 7) % 100}%`, '--flower-size': `${14 + (a * 7) % 13}px`,
          '--flower-duration': `${17 + (a * 3) % 9}s`, '--flower-delay': `${-((a * 11) % 24)}s`,
          '--flower-drift': `${(a * 31) % 130 - 65}px`, '--flower-turn': `${a % 2 ? 390 : -330}deg`,
        }}>
          <img src={a % 3 === 0 ? '/assets/hero/marigold-floret.webp' : '/assets/hero/rose-petal.webp'} alt="" />
        </span>
      ))}
    </div>
  )
}

function AuspiciousMark() {
  return (
    <svg className="auspicious-mark" viewBox="0 0 320 120" fill="none" aria-hidden="true">
      <g stroke="#912339" strokeWidth="9" strokeLinecap="round"><path d="M49 13v94M68 13v94M252 13v94M271 13v94" /></g>
      <g stroke="#c68746" strokeWidth="1.6"><path d="M38 13v94M79 13v94M241 13v94M282 13v94" /></g>
      <path d="M160 60V22h33M160 60h37v33M160 60v38h-33M160 60h-37V27" stroke="#f0bd77" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M160 60V22h33M160 60h37v33M160 60v38h-33M160 60h-37V27" stroke="#912339" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      <g fill="#912339"><circle cx="140" cy="39" r="4.7" /><circle cx="181" cy="40" r="4.7" /><circle cx="139" cy="81" r="4.7" /><circle cx="181" cy="81" r="4.7" /></g>
      <g fill="#c68746"><circle cx="26" cy="60" r="3" /><circle cx="294" cy="60" r="3" /></g>
    </svg>
  )
}

const COUNTER_ICONS = [
  <><rect x="4" y="6" width="16" height="15" rx="1" /><path d="M4 10h16M8 3v5m8-5v5M8 14h3m3 0h3m-9 4h3" /></>,
  <><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 3" /></>,
  <path d="M6 3h12M6 21h12M7 3c0 5 3 6 5 9-2 3-5 4-5 9m10-18c0 5-3 6-5 9 2 3 5 4 5 9M9 7l3 3 3-3M9 17l3-3 3 3" />,
  <><circle cx="12" cy="13" r="8" /><path d="M12 13l3-4M9 2h6m-3 0v3m6 1 2-2" /></>,
]
function CounterIcon({ index }) {
  return <svg className="counter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{COUNTER_ICONS[index]}</svg>
}

function SlotNumber({ value }) {
  const v = String(value).padStart(2, '0')
  const [s, setS] = useState({ current: v, previous: null })
  useEffect(() => {
    setS((o) => (o.current === v ? o : { current: v, previous: o.current }))
    const t = setTimeout(() => setS((o) => ({ ...o, previous: null })), 520)
    return () => clearTimeout(t)
  }, [v])
  return (
    <strong className="slot-number" aria-hidden="true">
      <span className={s.previous === null ? 'slot-number__current' : 'slot-number__current is-rolling'}>{s.current}</span>
      {s.previous !== null && <span className="slot-number__previous">{s.previous}</span>}
    </strong>
  )
}

/* ───────── door entry ───────── */
function DoorEntry({ onPrime, onDoorOpen, onComplete, reducedMotion }) {
  const [opened, setOpened] = useState(false)
  const open = () => {
    if (opened) return
    setOpened(true)
    if (onPrime) onPrime()
    if (reducedMotion) {
      if (onDoorOpen) onDoorOpen()
      onComplete()
      return
    }
    gsap.timeline({ onComplete })
      .to('.door-entry__prompt', { autoAlpha: 0, scale: 0.88, duration: 0.2, ease: 'power2.in' }, 0)
      .to('.door-entry__light', { autoAlpha: 0.9, scale: 1.08, duration: 0.75, ease: 'power2.out' }, 0.06)
      .to('.door-entry__vortex', { autoAlpha: 0.9, scale: 1, duration: 0.9, ease: 'power3.out' }, 0.28)
      .to('.door-entry__vortex-ring', { rotation: 240, stagger: 0.04, duration: 1.6, ease: 'power2.inOut' }, 0.28)
      .to('.door-entry__door--left', { rotationY: 108, duration: 1.5, ease: 'power3.inOut' }, 0.08)
      .to('.door-entry__door--right', { rotationY: -108, duration: 1.5, ease: 'power3.inOut' }, 0.08)
      .to('.door-entry__stage', { scale: 1.18, z: 420, autoAlpha: 0, duration: 0.9, ease: 'power3.in' }, 1.38)
      .to('.door-entry__backdrop', { scale: 1.16, filter: 'blur(8px)', duration: 0.9, ease: 'power3.in' }, 1.38)
      .to('.door-entry__vortex', { scale: 2.7, autoAlpha: 0, duration: 0.85, ease: 'power3.in' }, 1.38)
      .to('.door-entry__light', { autoAlpha: 0, scale: 2.4, duration: 0.85, ease: 'power2.in' }, 1.38)
      .call(() => {
        if (onDoorOpen) onDoorOpen()
      }, [], 1.52)
      .to('.door-entry', { autoAlpha: 0, duration: 0.42, ease: 'power1.out' }, 2.05)
  }
  return (
    <div className="door-entry" role="dialog" aria-modal="true" aria-label="Open the wedding invitation">
      <div className="door-entry__backdrop" />
      <div className="door-entry__glow" aria-hidden="true" />
      <div className="door-entry__light" aria-hidden="true" />
      <div className="door-entry__vortex" aria-hidden="true"><i className="door-entry__vortex-ring" /><i className="door-entry__vortex-ring" /><i className="door-entry__vortex-ring" /><span /></div>
      <div className="door-entry__stage" aria-hidden="true"><div className="door-entry__door door-entry__door--left" /><div className="door-entry__door door-entry__door--right" /></div>
      <button className="door-entry__prompt" type="button" onClick={open} disabled={opened} aria-label="Tap to open the doors">
        <span className="door-entry__prompt-dot" aria-hidden="true">✦</span><span>Tap to open</span>
      </button>
      <p className="door-entry__names">{B.name} <i>✦</i> {G.name}</p>
    </div>
  )
}

/* ───────── scratch card & countdown (video functionality) ───────── */
function ScratchCountdownSection({ reducedMotion, left }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const last = useRef(null)
  const dist = useRef(0)
  const moveCount = useRef(0)
  const timer = useRef(null)
  const [revealed, setRevealed] = useState(reducedMotion)
  const [confetti, setConfetti] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    if (reducedMotion) setRevealed(true)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [reducedMotion])

  const handleReveal = () => {
    if (revealed) return
    setRevealed(true)
    if (!reducedMotion) {
      setConfetti(true)
      timer.current = setTimeout(() => setConfetti(false), 3000)
    }
  }

  const handleReset = () => {
    setRevealed(false)
    setConfetti(false)
    dist.current = 0
    moveCount.current = 0
    setResetKey((k) => k + 1)
  }

  // Paint Scratch Canvas
  useEffect(() => {
    if (reducedMotion || revealed) return
    const canvas = canvasRef.current
    if (!canvas) return

    const paint = () => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const w = rect.width
      const h = rect.height

      // Midnight Sapphire / Royal Night Sky gradient
      const g = ctx.createLinearGradient(0, 0, w, h)
      g.addColorStop(0, '#1c3e72')
      g.addColorStop(0.5, '#132d56')
      g.addColorStop(1, '#0d1e3a')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      // Subtle delicate border
      ctx.strokeStyle = 'rgba(235, 190, 115, 0.45)'
      ctx.lineWidth = 1.5
      ctx.strokeRect(1, 1, w - 2, h - 2)

      // Gold Sparkle Stars (like in video)
      const stars = [
        { x: 0.12, y: 0.28, s: 6 }, { x: 0.18, y: 0.74, s: 5 },
        { x: 0.88, y: 0.28, s: 7 }, { x: 0.82, y: 0.74, s: 6 },
        { x: 0.26, y: 0.20, s: 4 }, { x: 0.74, y: 0.18, s: 4.5 },
        { x: 0.50, y: 0.14, s: 3.5 }, { x: 0.38, y: 0.84, s: 4 },
        { x: 0.62, y: 0.84, s: 4.5 }, { x: 0.08, y: 0.52, s: 4 },
        { x: 0.92, y: 0.52, s: 4 },
      ]

      const drawSparkle = (cx, cy, size) => {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.fillStyle = '#f6d289'
        ctx.beginPath()
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(0, -size)
          ctx.quadraticCurveTo(0, 0, size * 0.22, 0)
          ctx.rotate(Math.PI / 2)
        }
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      stars.forEach((st) => drawSparkle(st.x * w, st.y * h, st.s))

      // Scattered fine gold dust
      ctx.fillStyle = 'rgba(255, 235, 180, 0.6)'
      for (let i = 0; i < 30; i++) {
        const rx = (((i * 37 + 11) % 100) / 100) * w
        const ry = (((i * 59 + 23) % 100) / 100) * h
        const r = i % 3 === 0 ? 1.5 : 1
        ctx.beginPath()
        ctx.arc(rx, ry, r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Title: "✦  SCRATCH TO REVEAL  ✦"
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#fce5af'
      const fontSize = Math.max(11, Math.min(14, w * 0.036))
      ctx.font = `600 ${fontSize}px "DM Sans", sans-serif`
      if ('letterSpacing' in ctx) ctx.letterSpacing = '3px'
      ctx.fillText('✦   SCRATCH TO REVEAL   ✦', w / 2, h / 2 - 12)

      // Subtitle: "our special day" in script / italic
      ctx.fillStyle = '#eed69f'
      const subFontSize = Math.max(20, Math.min(28, w * 0.068))
      ctx.font = `italic 400 ${subFontSize}px "Pinyon Script", "Cormorant Garamond", Georgia, serif`
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
      ctx.fillText('our special day', w / 2, h / 2 + 18)
    }

    paint()
    const ro = new ResizeObserver(paint)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [revealed, reducedMotion, resetKey])

  const pos = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const scratch = (from, to) => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const rect = c.getBoundingClientRect()
    const dpr = c.width / rect.width
    ctx.save()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = Math.max(38, rect.width * 0.09)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    ctx.restore()
  }

  const checkCleared = () => {
    const c = canvasRef.current
    if (!c) return false
    const ctx = c.getContext('2d', { willReadFrequently: true })
    if (!ctx) return false
    const w = c.width
    const h = c.height
    const stepX = Math.floor(w / 16)
    const stepY = Math.floor(h / 10)
    let cleared = 0
    let total = 0
    for (let x = Math.floor(stepX / 2); x < w; x += stepX) {
      for (let y = Math.floor(stepY / 2); y < h; y += stepY) {
        total++
        const p = ctx.getImageData(x, y, 1, 1).data
        if (p[3] < 90) cleared++
      }
    }
    return total > 0 && cleared / total >= 0.35
  }

  const handlePointerDown = (e) => {
    if (revealed) return
    drawing.current = true
    const p = pos(e)
    last.current = p
    e.currentTarget.setPointerCapture(e.pointerId)
    scratch(p, p)
  }

  const handlePointerMove = (e) => {
    if (!drawing.current || revealed) return
    const p = pos(e)
    const from = last.current ?? p
    scratch(from, p)
    dist.current += Math.hypot(p.x - from.x, p.y - from.y)
    last.current = p
    moveCount.current++

    if (moveCount.current % 5 === 0) {
      if (checkCleared() || dist.current > e.currentTarget.getBoundingClientRect().width * 2.5) {
        handleReveal()
      }
    }
  }

  const handlePointerUp = () => {
    drawing.current = false
    last.current = null
  }

  // Pre-generate confetti pieces with varied angles, shapes, and colors
  const confettiPieces = useRef(
    Array.from({ length: 65 }, (_, i) => {
      const angle = (i * 137.5 * Math.PI) / 180
      const radius = 90 + (i % 6) * 36
      const colors = ['#f5ba42', '#2c5fb8', '#df3854', '#ffd56b', '#ffffff', '#8a1d33', '#e8a93a', '#4a90e2']
      return {
        tx: `${Math.cos(angle) * radius}px`,
        ty: `${Math.sin(angle) * (radius * 0.75) - 35}px`,
        rot: `${(i % 2 ? 1 : -1) * (360 + i * 28)}deg`,
        delay: `${(i % 9) * 25}ms`,
        color: colors[i % colors.length],
        width: i % 4 === 0 ? '7px' : i % 3 === 0 ? '11px' : '9px',
        height: i % 4 === 0 ? '7px' : i % 3 === 0 ? '6px' : '15px',
        borderRadius: i % 4 === 0 ? '50%' : i % 3 === 0 ? '2px' : '45% 10%',
      }
    })
  ).current

  return (
    <div className="scratch-countdown-wrap">
      {/* ── Top Card: Scratch & Save-The-Date Card ── */}
      <div className={`scratch-card-stage${revealed ? ' is-revealed' : ''}`}>
        {/* Underneath Revealed Content */}
        <div className="scratch-revealed-content">
          <p className="scratch-revealed-kicker">Save the Date</p>
          <h3 className="scratch-revealed-date">3rd December 2026</h3>
          <p className="scratch-revealed-venue">{VENUE.name} · Jaipur</p>
          <p className="scratch-revealed-time">Baraat Swagat · 8:15 PM onwards</p>
        </div>

        {/* Scratch Canvas Overlay */}
        {!revealed && (
          <>
            <canvas
              ref={canvasRef}
              className="scratch-canvas"
              aria-label="Scratch to reveal wedding date"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
            <div className="scratch-shimmer" aria-hidden="true" />
            <button className="scratch-helper-btn" type="button" onClick={handleReveal}>
              Reveal date
            </button>
          </>
        )}

        {/* Confetti Explosion */}
        {confetti && (
          <div className="scratch-confetti-wrap" aria-hidden="true">
            {confettiPieces.map((p, i) => (
              <span
                key={i}
                className="scratch-confetti-piece"
                style={{
                  '--tx': p.tx,
                  '--ty': p.ty,
                  '--rot': p.rot,
                  '--delay': p.delay,
                  backgroundColor: p.color,
                  width: p.width,
                  height: p.height,
                  borderRadius: p.borderRadius,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom Card: The Countdown Begins (Reveals only after scratching) ── */}
      {revealed && (
        <div className="countdown-revealed-wrap">
          <div className="countdown-revealed-heading">
            <span className="heading-line" />
            <span>✦ The Countdown Begins ✦</span>
            <span className="heading-line" />
          </div>

          <div
            className="countdown-revealed-card"
            role="timer"
            aria-label={`${left[0]} days, ${left[1]} hours, ${left[2]} minutes, and ${left[3]} seconds until the wedding`}
          >
            <div className="countdown-col">
              <span className="countdown-num">{String(left[0]).padStart(2, '0')}</span>
              <span className="countdown-unit">Days</span>
            </div>
            <div className="countdown-col">
              <span className="countdown-num">{String(left[1]).padStart(2, '0')}</span>
              <span className="countdown-unit">Hours</span>
            </div>
            <div className="countdown-col">
              <span className="countdown-num">{String(left[2]).padStart(2, '0')}</span>
              <span className="countdown-unit">Mins</span>
            </div>
            <div className="countdown-col">
              <span className="countdown-num">{String(left[3]).padStart(2, '0')}</span>
              <span className="countdown-unit">Secs</span>
            </div>
          </div>

          <p className="countdown-revealed-footer">
            <i>❦</i> Until our forever begins <i>❦</i>
          </p>

          <button className="scratch-again-btn" type="button" onClick={handleReset} aria-label="Scratch card again">
            <span>↺</span> Scratch again
          </button>
        </div>
      )}
    </div>
  )
}

/* ───────── royal couple ───────── */
function Portrait({ person, role, side }) {
  const [ok, setOk] = useState(true)
  return (
    <article className={`royal-portrait royal-portrait--${side}`}>
      <div className="royal-portrait__art">
        {ok
          ? <img className="royal-portrait__image" src={person.photo} alt={`${person.name}`} loading="lazy" decoding="async" onError={() => setOk(false)} />
          : <span className="royal-portrait__image portrait-placeholder" aria-hidden="true"><b>{person.initial}</b></span>}
        <img className="royal-portrait__frame" src="/assets/couple/portrait-frame.svg" alt="" />
      </div>
      <p>{role}</p>
      <h3>{person.name}</h3>
      <p className="royal-portrait__nickname"><strong lang="hi">{person.label}</strong></p>
    </article>
  )
}

function RoyalCouple() {
  return (
    <section className="royal-couple" aria-labelledby="royal-couple-title">
      <div className="royal-couple__inner">
        <p className="royal-couple__blessing">With the blessings of our elders</p>
        <h2 id="royal-couple-title">The Royal Couple</h2>
        <Ornament className="royal-couple__ornament" />
        <div className="royal-couple__portraits">
          <Portrait person={G} role="The Groom" side="groom" />
          <span className="royal-couple__amp">Weds</span>
          <Portrait person={B} role="The Bride" side="bride" />
        </div>
        <div className="families">
          <div><p>Groom’s family</p><strong>{GROOM_FAMILY.parents}</strong><small>{GROOM_FAMILY.grand}</small><small>{GROOM_FAMILY.home}</small></div>
          <div><p>Bride’s family</p><strong>{BRIDE_FAMILY.parents}</strong><small>{BRIDE_FAMILY.grand}</small><small>{BRIDE_FAMILY.home}</small></div>
        </div>
      </div>
    </section>
  )
}

/* ───────── gallery ───────── */
const SLIDES = [
  ...GALLERY,
  ...GALLERY_PLACEHOLDERS.slice(GALLERY.length).map((title) => ({ title, alt: title })),
]

function Gallery() {
  const h = SLIDES.length
  const [a, setA] = useState(h * 2)
  const [ready, setReady] = useState(true)
  const start = useRef(null), dragged = useRef(false)
  const cur = ((a % h) + h) % h
  const go = (i) => { let s = (i - cur + h) % h; if (s > h / 2) s -= h; setA((v) => v + s) }
  const step = (n) => setA((v) => v + n)

  useEffect(() => {
    if (a >= h && a < h * 4) return
    setReady(false); setA(h * 2 + (((a % h) + h) % h))
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [a, h])

  const down = (e) => { if (e.pointerType === 'mouse' && e.button !== 0) return; start.current = { x: e.clientX, y: e.clientY }; dragged.current = false; e.currentTarget.setPointerCapture(e.pointerId) }
  const up = (e) => {
    if (!start.current) return
    const dx = e.clientX - start.current.x, dy = e.clientY - start.current.y
    dragged.current = Math.abs(dx) > 12; start.current = null
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.15) step(dx < 0 ? 1 : -1)
  }

  return (
    <section className="gallery" aria-labelledby="gallery-title">
      <Mandala side="right" /><Mandala side="left" />
      <div className="gallery__inner">
        <header className="gallery__heading"><p>Moments to treasure</p><h2 id="gallery-title">Royal Gallery</h2><Ornament className="gallery__ornament" /></header>
        <div className="gallery__carousel" role="region" aria-roledescription="carousel" aria-label="Wedding gallery"
          onPointerDown={down} onPointerUp={up} onPointerCancel={() => { start.current = null }}
          onClickCapture={(e) => { if (dragged.current) { e.preventDefault(); e.stopPropagation(); dragged.current = false } }}>
          {Array.from({ length: h * 5 }, (_, i) => {
            const idx = i % h, it = SLIDES[idx], off = i - a, near = Math.abs(off) <= 2
            return (
              <button key={`${i}-${it.title}`} type="button"
                className={`gallery__slide${off === 0 ? ' is-active' : ''}${ready ? '' : ' is-recentering'}`}
                data-position={off === 0 ? 'current' : Math.abs(off) === 1 ? 'adjacent' : 'far'} data-offset={off}
                style={{ '--gallery-angle': `${(off * 360) / h}deg`, '--gallery-offset': off }}
                aria-label={`${off === 0 ? 'Current photo' : 'Show photo'}: ${it.title}`} aria-current={off === 0 ? 'true' : undefined}
                aria-hidden={!near} tabIndex={off === 0 ? 0 : -1} onClick={() => (off === 0 ? undefined : go(idx))}>
                <span className="gallery__photo">
                  {near && (it.src
                    ? <>
                        {it.fit === 'contain' && <img className="gallery__backdrop" src={it.src} alt="" aria-hidden="true" loading="lazy" decoding="async" />}
                        <img className={it.fit === 'contain' ? 'gallery__img--contain' : undefined} src={it.src} alt={it.alt} loading={off === 0 ? 'eager' : 'lazy'} decoding="async" style={it.position ? { objectPosition: it.position } : undefined} />
                      </>
                    : <span className="gallery__placeholder" aria-hidden="true"><b>{INITIALS}</b><i>✦</i></span>)}
                  <span className="gallery__caption">{it.title}</span>
                </span>
              </button>
            )
          })}
        </div>
        <nav className="gallery__controls" aria-label="Gallery controls">
          <button className="gallery__arrow" type="button" onClick={() => step(-1)} aria-label="Previous photo"><span aria-hidden="true">‹</span></button>
          <div className="gallery__dots" role="group" aria-label="Choose a photo">
            {SLIDES.map((it, i) => <button key={i} type="button" className={`gallery__dot${i === cur ? ' is-active' : ''}`} onClick={() => go(i)} aria-label={`Show ${it.title}`} aria-current={i === cur ? 'true' : undefined} />)}
          </div>
          <button className="gallery__arrow" type="button" onClick={() => step(1)} aria-label="Next photo"><span aria-hidden="true">›</span></button>
        </nav>
      </div>
    </section>
  )
}

/* ───────── festivities timeline ───────── */
function EventScroll({ event, index }) {
  return (
    <article className={`event-scroll event-scroll--${event.id}`}>
      <div className="event-scroll__reveal">
        <img className="event-scroll__art" src="/assets/timeline/embroidered-banner.webp" alt="" aria-hidden="true" />
        <div className="event-scroll__paper">
          <span className="event-scroll__number">{String(index).padStart(2, '0')}</span>
          <p className="event-scroll__eyebrow" lang="hi">{event.hindi}</p>
          <h3>{event.title}</h3>
          <div className="event-scroll__ornament" aria-hidden="true"><span /><b>✦</b><span /></div>
          {event.place?.length ? <p className="event-scroll__where">{event.place.map((r) => <span key={r}>{r}<br /></span>)}</p> : null}
        </div>
      </div>
      <img className="event-scroll__bottom-roller" src="/assets/timeline/matching-scroll-roller.webp" alt="" aria-hidden="true" />
    </article>
  )
}

function Festivities() {
  return (
    <section className="festivities" aria-labelledby="festivities-title">
      <div className="festivities__mandala festivities__mandala--top" aria-hidden="true" />
      <div className="festivities__mandala festivities__mandala--bottom" aria-hidden="true" />
      <header className="festivities__heading">
        <p className="festivities__script">25 November – 3 December 2026</p>
        <h2 id="festivities-title">Wedding Celebrations</h2>
        <Ornament className="festivities__ornament" />
      </header>
      <div className="festivities__timeline">
        <div className="festivities__route" aria-hidden="true">
          <span className="festivities__route-line" /><span className="festivities__route-progress" />
          <div className="festivities__route-garland">
            {Array.from({ length: 23 }, (_, i) => <span key={i} className="festivities__route-bloom" style={{ top: `${((i + 1) * 100) / 24}%` }}><img src="/assets/hero/marigold-floret.webp" alt="" /></span>)}
          </div>
          {['start', 'end'].map((k) => (
            <div key={k} className={`festivities__flower festivities__flower--${k}`}>
              <img src="/assets/hero/marigold-floret.webp" alt="" /><img src="/assets/hero/rose-petal.webp" alt="" /><img src="/assets/hero/marigold-floret.webp" alt="" />
            </div>
          ))}
          <div className="festivities__car"><img className="wedding-car" src="/assets/timeline/rajasthani-wedding-baggi.webp" alt="A miniature Rajasthani wedding carriage drawn by two white horses" /></div>
        </div>
        {EVENTS.map((ev, i) => (
          <article key={ev.id} className={`event-stop event-stop--${i % 2 === 0 ? 'left' : 'right'}`}>
            <EventScroll event={ev} index={i + 1} />
            <div className="event-stop__details"><span>{ev.date}</span><div className="event-stop__times">{ev.times.map((t) => <p key={t}>{t}</p>)}</div></div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ───────── details / venue ───────── */
function VenueIcon({ kind }) {
  return (
    <svg className="venue-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === 'date' && <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3v4M16.5 3v4M3.5 9h17M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" /></>}
      {kind === 'time' && <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>}
      {kind === 'place' && <><path d="M20 10.2c0 5.1-8 11-8 11s-8-5.9-8-11a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.4" /></>}
    </svg>
  )
}

function Details() {
  return (
    <section className="details" id="details" aria-labelledby="details-title">
      <Mandala side="right" /><Mandala side="left" />
      <div className="details-card">
        <header className="details-card__heading">
          <Ganesh className="details-ganesh" />
          <p className="details-family" lang="hi">{FAMILY_HINDI}</p>
          <p className="eyebrow">Invite you to celebrate</p>
          <p className="details-kicker">विवाह स्थल · Join us at</p>
          <h2 id="details-title">{VENUE.name}</h2>
          <Ornament className="details-ornament" />
        </header>
        <div className="details-facts">
          <div className="details-fact"><span className="details-fact__icon"><VenueIcon kind="date" /></span><p><span>Date</span><strong>{WEDDING_DATE_LONG}</strong></p></div>
          <div className="details-fact"><span className="details-fact__icon"><VenueIcon kind="time" /></span><p><span>Baraat Swagat</span><strong>8:15 PM onwards</strong></p></div>
          <div className="details-fact"><span className="details-fact__icon"><VenueIcon kind="place" /></span><p><span>Jaipur, Rajasthan</span><strong>{VENUE.short}</strong></p></div>
        </div>
        <a className="directions" href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">Get directions <span aria-hidden="true">↗</span></a>
        <div className="venue-map" aria-label={`Map showing ${VENUE.name}, Jaipur`}>
          <iframe title={`Map to ${VENUE.name}, Jaipur`} src={MAP_EMBED_URL} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          <a className="venue-map__open" href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">Open map <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <footer>{B.name} <span>✦</span> {G.name} <span>✦</span> {WEDDING_DATE_SHORT}</footer>
    </section>
  )
}

/* ───────── family ───────── */
function Family() {
  return (
    <section className="family" aria-labelledby="family-title">
      <header className="family__heading">
        <p>With love and blessings</p><h2 id="family-title">Our Families</h2><Ornament className="family__ornament" />
        <span lang="hi">{FAMILY_HINDI} का स्नेहभरा निमंत्रण</span>
      </header>
      <div className="family__grid">
        {FAMILY_GROUPS.map((g) => (
          <article key={g.title} className="family-card">
            <h3 lang="hi">{g.title}</h3><small>{g.en}</small>
            <ul lang="hi">{g.names.map((n) => <li key={n}>{n}</li>)}</ul>
          </article>
        ))}
      </div>
      <div className="niharati">
        <p className="niharati__title" lang="hi">निहारती पलकें</p>
        <p className="niharati__verse" lang="hi">{NIHARATI.verse}</p>
        <p className="niharati__names" lang="hi">{NIHARATI.names}</p>
      </div>
    </section>
  )
}

/* ───────── RSVP ───────── */
function Rsvp() {
  const [attend, setAttend] = useState('yes')
  const [count, setCount] = useState(1)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const bump = (n) => setCount((c) => Math.min(20, Math.max(1, c + n)))

  useEffect(() => {
    if (!done) return
    const k = (e) => e.key === 'Escape' && setDone(false)
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [done])

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('')
    const f = Object.fromEntries(new FormData(e.currentTarget).entries())
    try {
      if (RSVP_ENDPOINT) {
        const r = await fetch(RSVP_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(f) })
        if (!r.ok) throw new Error('RSVP failed')
      } else {
        const text = `${attend === 'yes' ? '✅ Joyfully accept' : '🙏 Regretfully decline'} — ${NAMES} wedding (${WEDDING_DATE_LONG})\nName: ${f['guest-name']}\nGuests: ${attend === 'yes' ? count : 0}${f.message ? `\nMessage: ${f.message}` : ''}`
        window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
      }
      setDone(true)
    } catch {
      setError('Your reply could not be sent just now. Please check your connection and try again.')
    } finally { setBusy(false) }
  }

  const person = <svg className="rsvp-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20v-1.4a7 7 0 0 1 14 0V20" /></svg>
  const heart = <path d="M16 27S4 19.5 4 11.5C4 5.7 11.2 3 16 9c4.8-6 12-3.3 12 2.5C28 19.5 16 27 16 27Z" />

  return (
    <section className="rsvp" id="rsvp" aria-labelledby="rsvp-title">
      <Mandala side="right" /><Mandala side="left" />
      <header className="rsvp__heading">
        <p>Kindly reply</p><h2 id="rsvp-title">Your presence means so much</h2><Ornament className="rsvp__ornament" />
        <span>{NAMES} · 3 December 2026</span>
      </header>
      <form className="rsvp-card" onSubmit={submit}>
        <input type="hidden" name="_subject" value={`Wedding RSVP — ${NAMES}`} />
        <input type="hidden" name="number-attending" value={attend === 'yes' ? count : 0} />
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }} />
        <div className="rsvp-card__intro">
          <span className="rsvp-card__seal" aria-hidden="true">{B.initial}<span>&amp;</span>{G.initial}</span>
          <h3>Will you join us?</h3><p>We would be delighted to celebrate together.</p>
        </div>
        <label className="rsvp-field"><span className="rsvp-field__label">Your name</span>
          <span className="rsvp-field__control">{person}<input type="text" name="guest-name" autoComplete="name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required /></span>
        </label>
        <fieldset className="rsvp-attendance">
          <legend className="rsvp-field__label">Will you be attending?</legend>
          <label className={`rsvp-choice${attend === 'yes' ? ' is-selected' : ''}`}>
            <input type="radio" name="attendance" value="yes" checked={attend === 'yes'} onChange={() => setAttend('yes')} />
            <span className="rsvp-choice__heart" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none">{heart}</svg></span>
            <strong>Joyfully accept</strong><small>We’ll be there</small>
          </label>
          <label className={`rsvp-choice${attend === 'no' ? ' is-selected' : ''}`}>
            <input type="radio" name="attendance" value="no" checked={attend === 'no'} onChange={() => setAttend('no')} />
            <span className="rsvp-choice__heart" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none">{heart}<path d="m7 7 18 18" /></svg></span>
            <strong>Regretfully decline</strong><small>With you in spirit</small>
          </label>
        </fieldset>
        <div className={`rsvp-guests${attend === 'no' ? ' is-disabled' : ''}`}>
          <span className="rsvp-field__label" id="rsvp-guests-label">Number attending</span>
          <div className="rsvp-guests__control">
            <span className="rsvp-guests__people" aria-hidden="true">{person}</span>
            <span className="rsvp-guests__text">Including you</span>
            <button type="button" onClick={() => bump(-1)} disabled={attend === 'no' || count <= 1} aria-label="Remove one guest">−</button>
            <output aria-labelledby="rsvp-guests-label">{attend === 'no' ? '—' : count}</output>
            <button type="button" onClick={() => bump(1)} disabled={attend === 'no' || count >= 20} aria-label="Add one guest">+</button>
          </div>
        </div>
        <label className="rsvp-field rsvp-field--message"><span className="rsvp-field__label">A wish for the couple <small>Optional</small></span>
          <textarea name="message" rows={3} maxLength={400} placeholder={`Write a note for ${NAMES}…`} />
        </label>
        <button className="rsvp-submit" type="submit" disabled={busy}><span>{busy ? 'Sending your reply…' : 'Send your reply'}</span><span aria-hidden="true">{busy ? '…' : '↗'}</span></button>
        {error && <p className="rsvp-status rsvp-status--error" role="alert">{error}</p>}
      </form>
      {done && (
        <div className="rsvp-confirmation" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setDone(false)}>
          <section className="rsvp-confirmation__card" role="dialog" aria-modal="true" aria-labelledby="rsvp-confirmation-title" aria-describedby="rsvp-confirmation-copy">
            <button className="rsvp-confirmation__close" type="button" onClick={() => setDone(false)} aria-label="Close message">×</button>
            <span className="rsvp-confirmation__seal" aria-hidden="true"><span>✦</span></span>
            <p className="rsvp-confirmation__eyebrow">A note from the family</p>
            <h3 id="rsvp-confirmation-title">{attend === 'yes' ? `We can’t wait to celebrate, ${name.trim()}!` : `Thank you for letting us know, ${name.trim()}.`}</h3>
            <Ornament className="rsvp-confirmation__ornament" />
            <p id="rsvp-confirmation-copy">{attend === 'yes' ? `Your reply is on its way to ${NAMES}’s family. We look forward to sharing a beautiful day together.` : 'We’ll keep your warm wishes close and celebrate you in spirit. Thank you for being part of their story.'}</p>
            <button className="rsvp-confirmation__done" type="button" onClick={() => setDone(false)}>With love, {B.name} &amp; {G.name}</button>
          </section>
        </div>
      )}
      <p className="rsvp__footnote">With love, <strong>The {FAMILY_NAME} Family</strong></p>
    </section>
  )
}

/* ───────── wishes ───────── */
function Wishes() {
  const [name, setName] = useState(''), [msg, setMsg] = useState(''), [list, setList] = useState([]), [ok, setOk] = useState(false)
  const submit = (e) => { e.preventDefault(); setList((l) => [{ name: name.trim(), message: msg.trim() }, ...l]); setOk(true); setName(''); setMsg('') }
  return (
    <section className="wishes" id="wishes" aria-labelledby="wishes-title">
      <Mandala side="right" /><Mandala side="left" />
      <div className="wishes__inner">
        <header className="wishes__heading"><p>Words to keep close</p><h2 id="wishes-title">A wall of blessings</h2><Ornament className="wishes__ornament" /><span>Leave {B.name} &amp; {G.name} a note for the years ahead</span></header>
        <div className="wishes__layout">
          <div className="wishes__wall" aria-label="Wedding blessings">
            <div className="wishes__wall-heading"><span aria-hidden="true">✦</span><p>With love, for the two of you</p><span aria-hidden="true">✦</span></div>
            {list.map((p, i) => (
              <article key={`${p.name}-${i}`} className="wish-card wish-card--new">
                <span className="wish-card__number">A note from your guest</span><p>“{p.message}”</p><footer>— {p.name} <small>· this preview</small></footer>
              </article>
            ))}
            {BLESSINGS.map((t, i) => (
              <article key={t} className={`wish-card wish-card--${i + 1}`}>
                <span className="wish-card__number">Blessing {String(i + 1).padStart(2, '0')}</span><p>“{t}”</p><footer>For {B.name} &amp; {G.name} <span aria-hidden="true">✧</span></footer>
              </article>
            ))}
          </div>
          <form className="wishes-form" onSubmit={submit}>
            <div className="wishes-form__top"><span aria-hidden="true">{B.initial} <i>&amp;</i> {G.initial}</span><p>Leave a blessing</p><small>A few heartfelt words make a keepsake.</small></div>
            <label className="wishes-form__field"><span>Your name</span><input value={name} onChange={(e) => { setName(e.target.value); setOk(false) }} name="wish-name" autoComplete="name" placeholder="How should we sign it?" maxLength={70} required /></label>
            <label className="wishes-form__field wishes-form__field--message"><span>Your message <small>Up to 400 characters</small></span>
              <textarea value={msg} onChange={(e) => { setMsg(e.target.value); setOk(false) }} name="wish-message" placeholder="Share a memory, a wish, or a few words from the heart…" maxLength={400} rows={5} required />
              <small className="wishes-form__count">{msg.length} / 400</small></label>
            <button type="submit" className="wishes-form__submit"><span>Add your wish</span><span aria-hidden="true">✦</span></button>
            {ok && <p className="wishes-form__status" role="status">Your note has been added to this preview on this device. It hasn’t been shared with the family.</p>}
            <p className="wishes-form__footnote">With warmest thanks <span aria-hidden="true">♡</span></p>
          </form>
        </div>
      </div>
    </section>
  )
}

/* ───────── contact + footer ───────── */
function DayContact() {
  const fmt = (n) => `+91 ${n.slice(0, 5)} ${n.slice(5)}`
  return (
    <>
      <section className="day-contact" id="day-contact" aria-labelledby="day-contact-title">
        <Mandala side="left" />
        <header className="day-contact__heading">
          <p>Here for the little things</p><h2 id="day-contact-title">A helping hand on the day</h2><Ornament className="day-contact__ornament" />
          <span>Directions, last-minute questions, baraat logistics — all welcome.</span>
        </header>
        <article className="day-contact__card">
          <span className="day-contact__badge" aria-hidden="true">✦</span>
          <div className="day-contact__copy">
            <p className="day-contact__eyebrow">{FAMILY_HINDI}</p>
            <h3>{CONTACT.heading}</h3>
            <p className="day-contact__role">{CONTACT.role}</p>
            <a className="day-contact__number" href={`tel:+91${CONTACT.numbers[0]}`}>{fmt(CONTACT.numbers[0])}</a>
            <div className="day-contact__others">
              {CONTACT.numbers.slice(1).map((n) => (
                <a key={n} href={`tel:+91${n}`}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  <span>{fmt(n)}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="day-contact__actions">
            <a className="day-contact__action day-contact__action--call" href={`tel:+91${CONTACT.numbers[0]}`} aria-label="Call the family">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3.8 4.9 3a1.5 1.5 0 0 0-1.8.6c-.8 1.3-1 2.9-.5 4.4 1.7 5.3 6.1 9.7 11.4 11.4 1.5.5 3.1.3 4.4-.5a1.5 1.5 0 0 0 .6-1.8l-.8-2.1a1.5 1.5 0 0 0-1.5-.9l-2.4.2a1.5 1.5 0 0 0-1.3 1.1l-.3 1a14 14 0 0 1-5.5-5.5l1-.3a1.5 1.5 0 0 0 1.1-1.3l.2-2.4A1.5 1.5 0 0 0 8.6 5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg><span>Call</span>
            </a>
            <a className="day-contact__action day-contact__action--whatsapp" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Message the family on WhatsApp">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4.1A8 8 0 1 1 20 11.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 8.4c.2-.4.5-.4.7-.4h.4c.2 0 .3.1.4.4l.6 1.4c.1.2.1.4 0 .5l-.5.6c-.2.2-.2.3-.1.5.4.7 1 1.3 1.8 1.7.2.1.3.1.5-.1l.7-.8c.2-.2.3-.2.5-.1l1.4.7c.2.1.3.2.3.4 0 .3-.2 1-.6 1.3-.4.4-.9.5-1.4.4a8 8 0 0 1-3.5-1.8 7.8 7.8 0 0 1-2.1-2.9c-.2-.6-.1-1.2.2-1.7Z" fill="currentColor" /></svg><span>WhatsApp</span>
            </a>
          </div>
          <p className="day-contact__aside">For urgent questions, ring. For everything else, a WhatsApp is kinder to the baraat.</p>
        </article>
      </section>
      <footer className="wedding-close"><p className="wedding-close__credit" lang="hi">{CONTACT.people}</p></footer>
    </>
  )
}

/* ───────── page ───────── */
export default function App() {
  const root = useRef(null), audio = useRef(null)
  const [left, setLeft] = useState(timeLeft)
  const [reduced, setReduced] = useState(false)
  const [entered, setEntered] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [hasMusic, setHasMusic] = useState(Boolean(MUSIC_SRC))

  useEffect(() => {
    const t = setInterval(() => setLeft(timeLeft()), 1000)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)'), on = () => setReduced(mq.matches)
    on(); mq.addEventListener('change', on)
    return () => { clearInterval(t); mq.removeEventListener('change', on) }
  }, [])

  useEffect(() => {
    const prev = document.body.style.overflow
    if (!entered) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [entered])

  const play = () => { const a = audio.current; if (!a || !MUSIC_SRC) return; a.volume = 0.58; a.play().then(() => setPlaying(true)).catch(() => setPlaying(false)) }
  const prime = () => { const a = audio.current; if (a && MUSIC_SRC) { a.load() } }
  const toggle = () => { const a = audio.current; if (!a || !MUSIC_SRC) return; if (a.paused) play(); else { a.pause(); setPlaying(false) } }

  const heroIntro = () => {
    if (reduced) return
    const f = root.current?.querySelectorAll('.hero .ganesh-mark [data-fill]')
    if (!f || f.length < 4) return
    gsap.timeline()
      .fromTo('.hero-palace', { clipPath: 'inset(100% 0 0 0)', scale: 1.08 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.52, ease: 'power3.out' }, 0)
      .fromTo('.hero-railing', { yPercent: 10, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: 'power3.out' }, 0.12)
      .fromTo('.hero-arch', { scale: 0.93, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.2, ease: 'power3.out' }, 0.12)
      .fromTo('.hero-couple', { y: 100, autoAlpha: 0, scale: 0.94 }, { y: 0, autoAlpha: 1, scale: 1, duration: 1.3, ease: 'power3.out' }, 0.18)
      .fromTo('.hero-content', { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.82, ease: 'power3.out' }, 0.48)
      .fromTo('.hero-name', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.68, stagger: 0.1, ease: 'power3.out' }, 0.7)
      .to(f[0], { attr: { height: 572.5 }, duration: 1.85, ease: 'power2.inOut' }, 0.62)
      .to(f[1], { attr: { y: 572.5, height: 572.5 }, duration: 1.85, ease: 'power2.inOut' }, 0.62)
      .to(f[2], { attr: { width: 420.5 }, duration: 1.85, ease: 'power2.inOut' }, 0.67)
      .to(f[3], { attr: { x: 420.5, width: 420.5 }, duration: 1.85, ease: 'power2.inOut' }, 0.67)
  }

  useGSAP(() => {
    if (!root.current || reduced) return
    const st = (trigger, start = 'top 78%') => ({ trigger, start, toggleActions: 'play none none reverse' })
    gsap.set('.hero-palace', { clipPath: 'inset(100% 0 0 0)' })
    gsap.set('.hero-railing, .hero-arch, .hero-couple, .hero-content', { autoAlpha: 0 })

    const fills = root.current.querySelectorAll('.details-ganesh [data-fill]')
    const paths = gsap.utils.toArray('.auspicious-mark path', root.current)
    paths.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }) })
    gsap.timeline({ scrollTrigger: { trigger: '.auspicious-mark', start: 'top 85%', toggleActions: 'play none none reverse' } })
      .to(paths, { strokeDashoffset: 0, duration: 1.15, stagger: 0.1, ease: 'power2.inOut' })
      .from('.auspicious-mark circle', { scale: 0, autoAlpha: 0, transformOrigin: 'center center', stagger: 0.06, duration: 0.38, ease: 'back.out(2)' }, 0.65)

    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.75 } })
      .to('.hero-palace', { scale: 1.14, yPercent: 5, ease: 'none' }, 0)
      .to('.hero-couple', { yPercent: 7, scale: 1.08, ease: 'none' }, 0)
      .to('.hero-arch', { scale: 1.22, ease: 'none' }, 0)
      .to('.hero-content', { yPercent: -24, autoAlpha: 0, ease: 'none' }, 0.18)

    gsap.from('.invitation-copy', { y: 50, opacity: 0, duration: 1, ease: 'power2.out', scrollTrigger: st('.celebration-section', 'top 72%') })
    gsap.from('.scratch-countdown-wrap', { y: 55, opacity: 0, duration: 0.9, ease: 'power2.out', scrollTrigger: st('.scratch-countdown-wrap', 'top 85%') })
    gsap.from('.royal-couple__blessing, .royal-couple h2, .royal-couple__ornament', { y: 25, opacity: 0, stagger: 0.12, duration: 0.85, ease: 'power2.out', scrollTrigger: st('.royal-couple') })
    gsap.from('.royal-portrait--groom', { x: -32, opacity: 0, duration: 1, ease: 'power2.out', scrollTrigger: st('.royal-couple__portraits', 'top 82%') })
    gsap.from('.royal-portrait--bride', { x: 32, opacity: 0, duration: 1, ease: 'power2.out', scrollTrigger: st('.royal-couple__portraits', 'top 82%') })
    gsap.from('.families > div', { y: 24, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power2.out', scrollTrigger: st('.families', 'top 88%') })
    gsap.from('.festivities__heading > *', { y: 32, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power2.out', scrollTrigger: st('.festivities') })

    const route = root.current.querySelector('.festivities__route')
    if (route) {
      gsap.fromTo('.festivities__route-progress', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.festivities__timeline', start: 'top 72%', end: 'bottom 68%', scrub: 0.7 } })
      gsap.fromTo('.festivities__car', { y: 0 }, { y: () => Math.max(0, route.offsetHeight - 54), ease: 'none', scrollTrigger: { trigger: '.festivities__timeline', start: 'top 72%', end: 'bottom 68%', scrub: 0.7, invalidateOnRefresh: true } })
    }
    gsap.utils.toArray('.event-scroll', root.current).forEach((el) => {
      const reveal = el.querySelector('.event-scroll__reveal'), roller = el.querySelector('.event-scroll__bottom-roller')
      if (!reveal || !roller) return
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 45%', scrub: 0.35, invalidateOnRefresh: true } })
        .fromTo(reveal, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'none' })
        .fromTo(roller, { y: () => -reveal.offsetHeight + roller.offsetHeight / 2, autoAlpha: 0.6 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'none' }, 0)
        .from(el.querySelectorAll('.event-scroll__eyebrow, h3, .event-scroll__ornament, .event-scroll__where'), { y: 13, autoAlpha: 0, stagger: 0.04, duration: 0.22, ease: 'power2.out' }, 0.12)
    })

    const spin = (sel, trig, deg) => gsap.to(sel, { rotation: deg, ease: 'none', scrollTrigger: { trigger: trig, start: 'top bottom', end: 'bottom top', scrub: 0.35 } })
    spin('.celebration-section .mandala-scroll--left', '.celebration-section', 900); spin('.celebration-section .mandala-scroll--right', '.celebration-section', -900)
    spin('.gallery .mandala-scroll--left', '.gallery', 900); spin('.gallery .mandala-scroll--right', '.gallery', -900)
    spin('.details .mandala-scroll--left', '.details', 900); spin('.details .mandala-scroll--right', '.details', -900)

    gsap.from('.details-card', { y: 48, opacity: 0, duration: 1, ease: 'power2.out', scrollTrigger: st('.details', 'top 75%') })
    if (fills.length >= 4) {
      gsap.timeline({ scrollTrigger: st('.details-card') })
        .to(fills[0], { attr: { height: 572.5 }, duration: 1.85, ease: 'power2.inOut' }, 0)
        .to(fills[1], { attr: { y: 572.5, height: 572.5 }, duration: 1.85, ease: 'power2.inOut' }, 0)
        .to(fills[2], { attr: { width: 420.5 }, duration: 1.85, ease: 'power2.inOut' }, 0.05)
        .to(fills[3], { attr: { x: 420.5, width: 420.5 }, duration: 1.85, ease: 'power2.inOut' }, 0.05)
    }
    gsap.from('.family__heading > *, .family-card, .niharati > *', { y: 28, opacity: 0, stagger: 0.07, duration: 0.8, ease: 'power2.out', scrollTrigger: st('.family') })
    gsap.from('.rsvp__heading > *, .rsvp-card', { y: 28, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power2.out', scrollTrigger: st('.rsvp') })
    gsap.from('.wishes__heading > *, .wish-card, .wishes-form', { y: 30, opacity: 0, stagger: 0.1, duration: 0.75, ease: 'power2.out', scrollTrigger: st('.wishes') })
    gsap.from('.day-contact__heading > *, .day-contact__card', { y: 28, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power2.out', scrollTrigger: st('.day-contact') })
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true })

  return (
    <div className="site" ref={root}>
      {hasMusic && MUSIC_SRC && <audio ref={audio} src={MUSIC_SRC} loop preload="auto" onError={() => setHasMusic(false)} />}
      {!entered && (
        <DoorEntry
          onPrime={prime}
          onDoorOpen={() => {
            heroIntro()
            if (MUSIC_SRC) play()
          }}
          onComplete={() => {
            setEntered(true)
            if (MUSIC_SRC) play()
          }}
          reducedMotion={reduced}
        />
      )}
      {entered && hasMusic && MUSIC_SRC && (
        <button
          className={`music-toggle${playing ? ' is-playing' : ' is-paused'}`}
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Turn music off' : 'Turn music on'}
          aria-pressed={playing}
        >
          <svg className="music-toggle__icon" aria-hidden="true" viewBox="0 0 24 24">
            <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="6" cy="18" r="3" fill="currentColor" />
            <circle cx="18" cy="16" r="3" fill="currentColor" />
          </svg>
          <span className="music-toggle__label">{playing ? 'On' : 'Off'}</span>
        </button>
      )}
      <a className="sr-only focus-link" href="#details">Skip to celebration details</a>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-sky" />
          <div className="hero-palace" role="img" aria-label="Stylized view of Jaipur's Hawa Mahal" />
          <img className="hero-clouds" src="/assets/hero/clouds.webp" alt="" />
          <div className="hero-couple-window"><img className="hero-couple" src="/assets/hero/couple-back.png" alt="Stylized couple looking toward Hawa Mahal" /></div>
          <img className="hero-railing" src="/assets/hero/gallery-railing.png" alt="" />
          <img className="hero-arch" src="/assets/hero/carved-arch.png" alt="" />
          <div className="hero-content">
            <Ganesh className="ganesh-mark" />
            <h1 id="hero-title"><span className="hero-name">{B.name}</span><span className="hero-amp">&amp;</span><span className="hero-name">{G.name}</span></h1>
          </div>
          <div className="scroll-invite" aria-hidden="true"><span>↓</span></div>
        </section>

        <section className="celebration-section" aria-labelledby="invitation-title">
          <Mandala side="right" /><Mandala side="left" />
          <div className="celebration-inner">
            <div className="invitation-copy">
              <AuspiciousMark />
              <h2 id="invitation-title">Together with<br />their families</h2>
              <p>request the honour of your presence<br className="desktop-break" /> to celebrate the joining of two families.</p>
              <p lang="hi" className="invitation-hindi">।। मंगल परिणयोत्सव ।। के शुभ अवसर पर आपको सादर आमंत्रित करते हैं। कृपया पधार कर कन्या-वर को आशीर्वाद प्रदान करें।</p>
              <Ornament className="copy-ornament" />
            </div>
            <ScratchCountdownSection reducedMotion={reduced} left={left} />
          </div>
        </section>

        <RoyalCouple />
        <Gallery />
        <Festivities />
        <Details />
        <Family />
        <Rsvp />
        <Wishes />
        <DayContact />
      </main>
      {!reduced && <FlowerFall />}
    </div>
  )
}
