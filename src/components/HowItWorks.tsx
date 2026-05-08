import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DarkVeil from './DarkVeil';

const steps = [
  { n: '01', title: 'Ask a Question',       sub: 'Start with your business problem',         text: '"Why are sales declining?"' },
  { n: '02', title: 'Add Context',          sub: 'Answer a few smart follow-up questions',   text: 'Synthesizing Context.' },
  { n: '03', title: 'AI Analyzes',          sub: 'Data + context → clear diagnosis',         text: 'Identifying Root Causes.' },
  { n: '04', title: 'Get Recommendations',  sub: 'What to do. What to avoid.',               text: 'Actionable Insights.' },
  { n: '05', title: 'View Dashboard',       sub: 'Key insights, KPIs, and trends',           text: 'Live Intelligence.' },
  { n: '06', title: 'Download Report',      sub: 'Consulting-style strategy report',         text: 'Your Plan. Ready.' },
];

export default function HowItWorks() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const drawnPathRef  = useRef<SVGPathElement | null>(null);
  const cometRef      = useRef<SVGCircleElement | null>(null);
  const cometGlowRef  = useRef<SVGCircleElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [winDim, setWinDim]     = useState({ w: 1200, h: 800 });

  /* ── window size ── */
  useEffect(() => {
    const onResize = () => setWinDim({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── node coordinates (zigzag left / right) ── */
  const PAD_TOP = 120;
  const PAD_BOT = 120;
  const NX = (i: number) => winDim.w * (i % 2 === 0 ? 0.08 : 0.92);
  const NY = (i: number) => PAD_TOP + (i / (steps.length - 1)) * (winDim.h - PAD_TOP - PAD_BOT);
  const NODES: [number, number][] = steps.map((_, i) => [NX(i), NY(i)]);

  /* ── bezier path through nodes ── */
  const PATH_D = NODES.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x},${y}`;
    const [prevX, prevY] = NODES[i - 1];
    const midX = (prevX + x) / 2;
    return `${acc} C ${midX},${prevY} ${midX},${y} ${x},${y}`;
  }, '');

  /* ── active step (progressive reveal) ── */
  const activeIndex = Math.min(steps.length - 1, Math.floor(progress * steps.length));

  /* ── pinned scroll trigger ── */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=500%',
      pin: true,
      scrub: true,
      onUpdate: self => setProgress(self.progress),
    });
    return () => st.kill();
  }, []);

  /* ── draw path + move comet ── */
  useEffect(() => {
    const path = drawnPathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len * (1 - progress));

    const point = path.getPointAtLength(len * progress);
    const visible = progress > 0.005 && progress < 0.995 ? '1' : '0';
    if (cometRef.current) {
      cometRef.current.setAttribute('cx', String(point.x));
      cometRef.current.setAttribute('cy', String(point.y));
      cometRef.current.setAttribute('opacity', visible);
    }
    if (cometGlowRef.current) {
      cometGlowRef.current.setAttribute('cx', String(point.x));
      cometGlowRef.current.setAttribute('cy', String(point.y));
      cometGlowRef.current.setAttribute('opacity', visible);
    }
  }, [progress, winDim]);

  /* ── comet pulse (independent of scroll) ── */
  useEffect(() => {
    if (!cometGlowRef.current) return;
    const tween = gsap.to(cometGlowRef.current, {
      attr: { r: 22 },
      duration: 1.0,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    return () => tween.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', background: '#0A0A0A', width: '100%', height: '100vh', overflow: 'hidden', zIndex: 5 }}
    >
      <DarkVeil />

      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

        {/* ── SVG layer (z-index 1, behind text) ── */}
        <svg
          width={winDim.w}
          height={winDim.h}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}
        >
          <defs>
            <linearGradient id="nhPathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#00ccff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffaa00" stopOpacity="0.95" />
            </linearGradient>
            <filter id="nhPathGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="nhCometGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ghost path */}
          <path d={PATH_D} stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* drawn gradient path */}
          <path
            ref={drawnPathRef}
            d={PATH_D}
            stroke="url(#nhPathGrad)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#nhPathGlow)"
          />

          {/* comet glow halo (pulsing) */}
          <circle ref={cometGlowRef} r="14" fill="rgba(0,204,255,0.35)" filter="url(#nhCometGlow)" opacity="0" />
          {/* comet core */}
          <circle ref={cometRef}     r="6"  fill="#ffffff"              filter="url(#nhCometGlow)" opacity="0" />
        </svg>

        {/* ── Text panels (z-index 2, above SVG) ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
          {steps.map((step, i) => {
            const isLeft   = i % 2 === 0;
            const nodeY_Vh = (NY(i) / winDim.h) * 100;
            const isReached = i <= activeIndex;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: `${nodeY_Vh}vh`,
                  transform: 'translateY(-50%)',
                  left:  isLeft ? '8vw' : 'auto',
                  right: isLeft ? 'auto' : '8vw',
                  width: 'max-content',
                  maxWidth: '45vw',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isLeft ? 'flex-start' : 'flex-end',
                  opacity: isReached ? 1 : 0,
                  transition: 'opacity 0.45s ease',
                  pointerEvents: 'auto',
                }}
              >
                <div style={{ textAlign: isLeft ? 'left' : 'right' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 400, fontSize: '11px', color: 'rgba(0,204,255,0.6)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 12 }}>
                    {step.n}
                  </div>
                  <h2 style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 550, fontSize: 'clamp(32px, 4.5vw, 60px)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.05, textTransform: 'uppercase', marginBottom: 16 }}>
                    {step.title}
                  </h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 'clamp(15px, 1.2vw, 18px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 20 }}>
                    {step.sub}
                  </p>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                    color: 'rgba(0,204,255,0.8)',
                    letterSpacing: '0.04em',
                    borderLeft: isLeft ? '2px solid rgba(0,204,255,0.3)' : 'none',
                    borderRight: isLeft ? 'none' : '2px solid rgba(0,204,255,0.3)',
                    paddingLeft: isLeft ? '14px' : '0',
                    paddingRight: isLeft ? '0' : '14px',
                    marginTop: 8
                  }}>
                    {step.text}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
