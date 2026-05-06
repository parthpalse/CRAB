import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { n: '01', title: 'Ask a Question',       sub: 'Start with your business problem',         text: '"Why are sales declining?"' },
  { n: '02', title: 'Add Context',          sub: 'Answer a few smart follow-up questions',   text: 'Synthesizing Context.' },
  { n: '03', title: 'AI Analyzes',          sub: 'Data + context → clear diagnosis',         text: 'Identifying Root Causes.' },
  { n: '04', title: 'Get Recommendations',  sub: 'What to do. What to avoid.',               text: 'Actionable Insights.' },
  { n: '05', title: 'View Dashboard',       sub: 'Key insights, KPIs, and trends',           text: 'Live Intelligence.' },
  { n: '06', title: 'Download Report',      sub: 'Consulting-style strategy report',         text: 'Your Plan. Ready.' },
];

// SVG canvas — uses % coords so it scales with viewport
const W = 1000;
const H = 2400; // 6 nodes spaced down a tall canvas
const NODES: [number, number][] = steps.map((_, i) => {
  // strict alternation — odd index left, even index right
  const x = i % 2 === 0 ? 220 : 780;
  // evenly spaced down the canvas, with margin top/bottom
  const y = 180 + i * ((H - 360) / (steps.length - 1));
  return [x, y];
});

// Build a single continuous straight-zigzag path through all nodes
const PATH_D = NODES.reduce((acc, [x, y], i) => acc + (i === 0 ? `M${x},${y}` : ` L${x},${y}`), '');

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement | null>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const progressRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const path = pathRef.current;
      if (!path) return;
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

      // initial states
      stepRefs.current.forEach((s, i) => { if (s) gsap.set(s, { opacity: i === 0 ? 1 : 0.25, y: 0 }); });
      nodeRefs.current.forEach((g, i) => {
        if (!g) return;
        const ring = g.querySelector('.nh-ring') as SVGCircleElement | null;
        const fill = g.querySelector('.nh-fill') as SVGCircleElement | null;
        if (ring) gsap.set(ring, { opacity: 0.45 });
        if (fill) gsap.set(fill, { opacity: 0, scale: 0.6, transformOrigin: 'center center' });
      });

      // single scroll-scrubbed timeline that draws the path & lights up nodes
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;
          // draw the path
          gsap.set(path, { strokeDashoffset: len * (1 - p) });

          // light up nodes as the path reaches each one
          steps.forEach((_, i) => {
            const nodeProgress = i / (steps.length - 1); // 0, 0.2, 0.4, ...
            const isReached = p >= nodeProgress - 0.02;
            const isActive = Math.abs(p - nodeProgress) < 0.08;
            const ringEl = nodeRefs.current[i]?.querySelector('.nh-ring') as SVGCircleElement | null;
            const fillEl = nodeRefs.current[i]?.querySelector('.nh-fill') as SVGCircleElement | null;
            if (ringEl) ringEl.style.opacity = String(isReached ? (isActive ? 1 : 0.85) : 0.45);
            if (fillEl) {
              fillEl.style.opacity = String(isReached ? 1 : 0);
              fillEl.style.transform = `scale(${isReached ? 1 : 0.6})`;
            }
            const stepEl = stepRefs.current[i];
            if (stepEl) stepEl.style.opacity = String(isReached ? 1 : 0.25);
          });
        },
      });

      // subtle pulse on the currently-active node (driven by ticker so it stays smooth)
      const tick = () => {
        const p = progressRef.current;
        steps.forEach((_, i) => {
          const nodeProgress = i / (steps.length - 1);
          const isActive = Math.abs(p - nodeProgress) < 0.08;
          const fillEl = nodeRefs.current[i]?.querySelector('.nh-fill') as SVGCircleElement | null;
          if (fillEl && isActive) {
            const t = (performance.now() / 1000);
            const pulse = 0.7 + (Math.sin(t * 1.6) * 0.5 + 0.5) * 0.3; // 0.7 -> 1.0
            fillEl.style.opacity = String(pulse);
          }
        });
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        background: '#0A0A0A',
        width: '100%',
        // 6 steps × 60vh — tighter cadence per your request
        minHeight: `${steps.length * 60}vh`,
      }}
    >
      {/* sticky SVG canvas */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="nhPathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#777777" stopOpacity="0.7" />
            </linearGradient>
            <filter id="nhPathGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="nhNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* the single continuous path */}
          <path
            ref={pathRef}
            d={PATH_D}
            stroke="url(#nhPathGrad)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#nhPathGlow)"
          />

          {/* 6 main nodes — hollow ring + inner fill that activates when path arrives */}
          {NODES.map(([cx, cy], i) => (
            <g key={i} ref={el => { nodeRefs.current[i] = el; }}>
              {/* outer hollow ring */}
              <circle
                className="nh-ring"
                cx={cx}
                cy={cy}
                r={11}
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.2"
                filter="url(#nhNodeGlow)"
              />
              {/* inner fill — fades/scales in when active */}
              <circle
                className="nh-fill"
                cx={cx}
                cy={cy}
                r={5}
                fill="#ffffff"
                filter="url(#nhNodeGlow)"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* scroll steps — alternating left/right text columns */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: '-100vh' }}>
        {steps.map((step, i) => (
          <div
            key={i}
            ref={el => { stepRefs.current[i] = el; }}
            style={{
              minHeight: '60vh',
              display: 'flex',
              alignItems: 'center',
              padding: '0 8vw',
              justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end',
              transition: 'opacity 0.35s ease',
            }}
          >
            <div style={{ maxWidth: 420, textAlign: i % 2 === 0 ? 'left' : 'right' }}>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 11,
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '.3em',
                textTransform: 'uppercase',
                marginBottom: 12
              }}>
                {step.n}
              </div>
              <h2 style={{
                fontFamily: "'Orbitron',sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(28px,4vw,52px)',
                color: '#fff',
                letterSpacing: '-.02em',
                lineHeight: 1.1,
                marginBottom: 12
              }}>
                {step.title}
              </h2>
              <p style={{
                fontFamily: 'Inter,sans-serif',
                fontSize: 16,
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.6,
                marginBottom: 20
              }}>
                {step.sub}
              </p>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 13,
                color: 'rgba(255,255,255,0.7)',
                borderLeft: '2px solid rgba(255,255,255,0.25)',
                borderRight: i % 2 === 0 ? 'none' : '2px solid rgba(255,255,255,0.25)',
                paddingLeft: i % 2 === 0 ? 14 : 0,
                paddingRight: i % 2 === 0 ? 0 : 14,
                letterSpacing: '.04em',
                display: 'inline-block',
              }}>
                {step.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
