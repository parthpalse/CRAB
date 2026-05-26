import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DarkVeil from './DarkVeil';
import { useScale, scaled } from '../hooks/useScale';
import { DICT } from '../lib/translations';

export default function HowItWorks({ lang, isDark = true }: { lang: 'EN' | 'DE'; isDark?: boolean }) {
  const steps = DICT[lang].howItWorks.steps;
  const sectionRef   = useRef<HTMLDivElement>(null);
  const drawnPathRef = useRef<SVGPathElement | null>(null);
  const cometRef     = useRef<SVGCircleElement | null>(null);
  const cometGlowRef = useRef<SVGCircleElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [winDim, setWinDim] = useState({ w: 1366, h: 768 });
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const scale = useScale();

  useEffect(() => {
    const onResize = () => {
      setWinDim({ w: window.innerWidth, h: window.innerHeight });
      setIsMobile(window.innerWidth < 768);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const timer = setTimeout(() => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: true,
        onUpdate: self => setProgress(self.progress),
      });
      ScrollTrigger.refresh();
      setReady(true);
      return () => st.kill();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  /* ── Desktop positioning (unchanged) ── */
  const NX_desktop = (i: number) => winDim.w * (i % 2 === 0 ? 0.08 : 0.92);
  const NY_desktop = (i: number) => {
    const startY = winDim.h * 0.09 + 60;
    const endY = startY + (winDim.h * 0.82) - 120;
    return startY + (i / (steps.length - 1)) * (endY - startY);
  };

  const DESKTOP_NODES: [number, number][] = steps.map((_, i) => [NX_desktop(i), NY_desktop(i)]);
  const DESKTOP_PATH_D = DESKTOP_NODES.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x},${y}`;
    const [prevX, prevY] = DESKTOP_NODES[i - 1];
    const midX = (prevX + x) / 2;
    return `${acc} C ${midX},${prevY} ${midX},${y} ${x},${y}`;
  }, '');

  /* ── Mobile: SVG uses a fixed 100-unit tall viewBox so positions are percentages ── */
  const MOBILE_SVG_W = 100;
  const MOBILE_SVG_H = 100;
  const MOBILE_Y_START = 6;   // 6% from top
  const MOBILE_Y_END   = 94;  // 94% from top
  const MOBILE_NODES: [number, number][] = steps.map((_, i) => [
    MOBILE_SVG_W / 2,
    MOBILE_Y_START + (i / (steps.length - 1)) * (MOBILE_Y_END - MOBILE_Y_START),
  ]);
  const MOBILE_PATH_D = MOBILE_NODES.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x},${y}`;
    return `${acc} L ${x},${y}`;
  }, '');

  const PATH_D = isMobile ? MOBILE_PATH_D : DESKTOP_PATH_D;
  const activeIndex = progress === 0 ? -1 : Math.floor(progress * steps.length);

  useEffect(() => {
    const path = drawnPathRef.current;
    if (!path) return;
    const d = path.getAttribute('d');
    if (!d || d.trim() === '') return;
    let len = 0;
    try { len = path.getTotalLength(); } catch { return; }
    if (len === 0) return;

    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len * (1 - progress));

    let point;
    try { point = path.getPointAtLength(len * progress); } catch { return; }

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
  }, [progress, winDim, isMobile]);

  useEffect(() => {
    if (!cometGlowRef.current) return;
    const tween = gsap.to(cometGlowRef.current, {
      attr: { r: isMobile ? 4 : 22 }, duration: 1.0, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });
    return () => tween.kill();
  }, [isMobile]);

  /* ── SVG viewBox depends on mode ── */
  const svgViewBox = isMobile
    ? `0 0 ${MOBILE_SVG_W} ${MOBILE_SVG_H}`
    : `0 0 ${winDim.w} ${winDim.h}`;

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', background: isDark ? '#0A0A0A' : '#F5F5F5', width: '100%', height: '100dvh', zIndex: 5, transition: 'background 0.3s ease, color 0.3s ease' }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 1, transition: 'opacity 0.3s ease' }}>
        <DarkVeil isDark={isDark} />
      </div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* ── SVG layer ── */}
        <svg
          width="100%"
          height="100%"
          viewBox={svgViewBox}
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}
        >
          <defs>
            <linearGradient id="nhPathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#00ccff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffaa00" stopOpacity="0.95" />
            </linearGradient>
            <filter id="nhPathGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation={isMobile ? '0.5' : '4'} result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="nhCometGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation={isMobile ? '1' : '6'} result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path d={PATH_D} stroke="rgba(255,255,255,0)" strokeWidth={isMobile ? '0.3' : scaled(1.5, scale)} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path
            ref={drawnPathRef}
            d={PATH_D}
            stroke="url(#nhPathGrad)"
            strokeWidth={isMobile ? '0.8' : scaled(3, scale)}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#nhPathGlow)"
          />
          <circle ref={cometGlowRef} r={isMobile ? 2 : 14} fill="rgba(0,204,255,0.35)" filter="url(#nhCometGlow)" opacity="0" />
          <circle ref={cometRef}     r={isMobile ? 1 : 6}  fill="#ffffff"              filter="url(#nhCometGlow)" opacity="0" />
        </svg>

        {/* ── Step labels layer ── */}
        {isMobile ? (
          /* ══════════════════════════════════════════════════════
             MOBILE: Flexbox layout — items distribute naturally
             within the actual rendered container height.
             No pixel guessing, works on every screen.
             ══════════════════════════════════════════════════════ */
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4% 0 4% 0',
          }}>
            {ready && steps.map((step, i) => {
              const isReached = i <= activeIndex;
              return (
                <div key={i} style={{
                  textAlign: 'center',
                  width: '75vw',
                  opacity: isReached ? 1 : 0,
                  transition: 'opacity 0.45s ease',
                  pointerEvents: 'auto',
                  flex: '0 1 auto',
                }}>
                  <div style={{
                    fontFamily: "'EB Garamond', serif", fontWeight: 700,
                    fontSize: 'clamp(8px, 1.5vh, 13px)', color: '#00ccff',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    marginBottom: '1px',
                  }}>{step.n}</div>
                  <h2 style={{
                    fontFamily: "'EB Garamond', serif", fontWeight: 800,
                    fontSize: 'clamp(12px, 2.2vh, 18px)',
                    color: isDark ? '#fff' : '#0A0A0A', letterSpacing: '-0.01em', lineHeight: 1.15,
                    textTransform: 'uppercase', marginBottom: '1px',
                    transition: 'color 0.3s ease',
                  }}>{step.title}</h2>
                  <p style={{
                    fontFamily: "'Inter', sans-serif", fontWeight: 300,
                    fontSize: 'clamp(8px, 1.4vh, 12px)',
                    color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)', lineHeight: 1.3,
                    marginBottom: '1px',
                    transition: 'color 0.3s ease',
                  }}>{step.sub}</p>
                  <div style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 'clamp(8px, 1.4vh, 13px)',
                    color: 'rgba(0,204,255,1)', fontWeight: 600, letterSpacing: '0.02em',
                    borderBottom: '2px solid #00ccff',
                    paddingBottom: '3px',
                    marginTop: '2px',
                    display: 'inline-block',
                  }}>{step.text}</div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ══════════════════════════════════════
             DESKTOP: Absolute positioning (unchanged)
             ══════════════════════════════════════ */
          <div style={{ position: 'relative', width: '100%', height: `${winDim.h}px` }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              pointerEvents: 'none'
            }}>
              {ready && steps.map((step, i) => {
                const isLeft   = i % 2 === 0;
                const nodeY_Px = NY_desktop(i);
                const isReached = i <= activeIndex;
                const desktopStyle = {
                  position: 'absolute' as const,
                  top: `${nodeY_Px}px`,
                  transform: 'translateY(-50%)',
                  left:  isLeft ? scaled(90, scale) : 'auto',
                  right: isLeft ? 'auto' : scaled(90, scale),
                  width: scaled(420, scale),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isLeft ? 'flex-start' : 'flex-end',
                  opacity: isReached ? 1 : 0,
                  transition: 'opacity 0.45s ease',
                  pointerEvents: 'auto' as const,
                };
                return (
                  <div key={i} style={desktopStyle}>
                    <div style={{ textAlign: 'center', maxWidth: '420px' }}>
                      <div style={{
                        fontFamily: "'EB Garamond', serif", fontWeight: 700,
                        fontSize: scaled(18, scale), color: '#00ccff',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        marginBottom: scaled(4, scale),
                      }}>{step.n}</div>
                      <h2 style={{
                        fontFamily: "'EB Garamond', serif", fontWeight: 800,
                        fontSize: scaled(28, scale),
                        color: isDark ? '#fff' : '#0A0A0A', letterSpacing: '-0.01em', lineHeight: 1.1,
                        textTransform: 'uppercase', marginBottom: scaled(10, scale),
                        transition: 'background 0.3s ease, color 0.3s ease',
                      }}>{step.title}</h2>
                      <p style={{
                        fontFamily: "'Inter', sans-serif", fontWeight: 300,
                        fontSize: scaled(13, scale),
                        color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)', lineHeight: 1.4,
                        marginBottom: scaled(10, scale),
                        transition: 'background 0.3s ease, color 0.3s ease',
                      }}>{step.sub}</p>
                      <div style={{
                        fontFamily: "'EB Garamond', serif",
                        fontSize: scaled(14, scale),
                        color: 'rgba(0,204,255,1)', fontWeight: 600, letterSpacing: '0.02em',
                        borderLeft:  isLeft ? '3px solid #00ccff' : 'none',
                        borderRight: isLeft ? 'none' : '3px solid #00ccff',
                        paddingLeft:  isLeft ? scaled(16, scale) : '0',
                        paddingRight: isLeft ? '0' : scaled(16, scale),
                        marginTop: scaled(12, scale),
                      }}>{step.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
