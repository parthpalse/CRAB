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
  const sectionRef = useRef<HTMLDivElement>(null);
  const drawnPathRef = useRef<SVGPathElement | null>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const [progress, setProgress] = useState(0);
  const [winDim, setWinDim] = useState({ w: 1000, h: 1000 });

  // Update window dimensions on mount & resize
  useEffect(() => {
    const onResize = () => setWinDim({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Use the entire screen now that navbar is hidden!
  // 80px safely clears half of the text box height at the top and bottom.
  const PAD_TOP = 80; 
  const PAD_BOT = 80;
  // Push nodes to the extreme edges for maximum spacing
  const NX = (i: number) => winDim.w * (i % 2 === 0 ? 0.08 : 0.92);
  const NY = (i: number) => PAD_TOP + (i / (steps.length - 1)) * (winDim.h - PAD_TOP - PAD_BOT);

  const NODES: [number, number][] = steps.map((_, i) => [NX(i), NY(i)]);
  const PATH_D = NODES.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x},${y}`;
    const [prevX, prevY] = NODES[i - 1];
    const midX = (prevX + x) / 2;
    return `${acc} C ${midX},${prevY} ${midX},${y} ${x},${y}`;
  }, '');

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=500%', // Pin the section for 5x its height (500vh of scroll)
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        setProgress(self.progress);
      }
    });

    return () => st.kill();
  }, []);

  // Update SVG drawing based on progress
  useEffect(() => {
    const path = drawnPathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len * (1 - progress));

    nodeRefs.current.forEach((g, i) => {
      if (!g) return;
      const nodeP = i / (steps.length - 1);
      const isReached = progress >= nodeP - 0.02;
      const isActive = Math.abs(progress - nodeP) < 0.15;

      const ring = g.querySelector('.nh-ring') as SVGCircleElement;
      const fill = g.querySelector('.nh-fill') as SVGCircleElement;
      
      if (ring) {
        ring.style.opacity = isReached ? '1' : '0.2';
        ring.style.transform = isActive ? 'scale(1.2)' : 'scale(1)';
        ring.style.transformOrigin = 'center';
      }
      if (fill) fill.style.opacity = isReached ? '1' : '0';
    });
  }, [progress, winDim]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        background: '#0A0A0A',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 5,
      }}
    >
      <DarkVeil />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {/* Sticky SVG */}
        <svg
          width={winDim.w}
          height={winDim.h}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
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
            <filter id="nhNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ghost path — the full road, dim */}
          <path
            d={PATH_D}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* drawn path — fills in with scroll */}
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

          {NODES.map(([cx, cy], i) => (
            <g key={i} ref={el => { nodeRefs.current[i] = el; }}>
              <circle
                className="nh-ring"
                cx={cx} cy={cy} r={14}
                fill="none"
                stroke={i % 3 === 0 ? '#00ccff' : '#ffffff'}
                strokeWidth="2"
                filter="url(#nhNodeGlow)"
                style={{ opacity: 0.2, transition: 'opacity 0.4s ease' }}
              />
              <circle
                className="nh-fill"
                cx={cx} cy={cy} r={6}
                fill={i % 3 === 0 ? '#00ccff' : '#ffffff'}
                filter="url(#nhNodeGlow)"
                style={{ opacity: 0, transition: 'opacity 0.4s ease' }}
              />
            </g>
          ))}
        </svg>

        {/* Static text panels — perfectly aligned to nodes, fading based on progress */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          {steps.map((step, i) => {
            const nodeP = i / (steps.length - 1);
            const isLeft = i % 2 === 0;
            
            // The node's exact pixel Y coordinate mapped back to vh for CSS positioning
            const nodeY_Vh = (NY(i) / winDim.h) * 100;
            
            // Smooth opacity logic
            const isReached = progress >= nodeP - 0.05;
            // Once reached, stay fully lit! Unreached stays dim.
            const textOpacity = isReached ? 1 : 0.05;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: `${nodeY_Vh}vh`,
                  transform: 'translateY(-50%)',
                  left: isLeft ? '11vw' : 'auto',
                  right: isLeft ? 'auto' : '11vw',
                  width: '35vw',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isLeft ? 'flex-start' : 'flex-end',
                  pointerEvents: 'auto',
                  opacity: textOpacity,
                  transition: 'opacity 0.4s ease',
                }}
              >
                <div style={{ textAlign: isLeft ? 'left' : 'right' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'rgba(0,204,255,0.7)', letterSpacing: '.3em', textTransform: 'uppercase', marginBottom: 8 }}>{step.n}</div>
                  <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 'clamp(18px, 2.5vw, 32px)', color: '#fff', letterSpacing: '-.02em', lineHeight: 1.1, marginBottom: 8 }}>{step.title}</h2>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 12 }}>{step.sub}</p>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'rgba(0,204,255,0.9)', borderLeft: isLeft ? '3px solid rgba(0,204,255,0.4)' : 'none', borderRight: isLeft ? 'none' : '3px solid rgba(0,204,255,0.4)', paddingLeft: isLeft ? 12 : 0, paddingRight: isLeft ? 0 : 12, letterSpacing: '.04em', display: 'inline-block' }}>{step.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
