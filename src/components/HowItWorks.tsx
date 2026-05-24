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

  const USABLE_H = isMobile ? winDim.h - 80 : winDim.h * 0.82;
  const OFFSET_Y = isMobile ? 55 : winDim.h * 0.09;
  const PAD_TOP  = isMobile ? 20 : 60;
  const PAD_BOT  = isMobile ? 40 : 60;

  const NX = (i: number) => {
    if (isMobile) return winDim.w * 0.5;
    return winDim.w * (i % 2 === 0 ? 0.08 : 0.92);
  };
  const NY = (i: number) =>
    OFFSET_Y + PAD_TOP + (i / (steps.length - 1)) * (USABLE_H - PAD_TOP - PAD_BOT);

  const NODES: [number, number][] = steps.map((_, i) => [NX(i), NY(i)]);

  const PATH_D = NODES.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x},${y}`;
    const [prevX, prevY] = NODES[i - 1];
    const midX = isMobile ? x : (prevX + x) / 2;
    return `${acc} C ${midX},${prevY} ${midX},${y} ${x},${y}`;
  }, '');

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
  }, [progress, winDim]);

  useEffect(() => {
    if (!cometGlowRef.current) return;
    const tween = gsap.to(cometGlowRef.current, {
      attr: { r: 22 }, duration: 1.0, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });
    return () => tween.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', background: isDark ? '#0A0A0A' : '#F5F5F5', width: '100%', height: '100dvh', zIndex: 5, transition: 'background 0.3s ease, color 0.3s ease' }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 1, transition: 'opacity 0.3s ease' }}>
        <DarkVeil isDark={isDark} />
      </div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'relative', width: '100%', height: `${winDim.h}px` }}>
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${winDim.w} ${winDim.h}`}
            preserveAspectRatio="none"
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
            <path d={PATH_D} stroke="rgba(255,255,255,0)" strokeWidth={isMobile ? "2" : scaled(1.5, scale)} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path
              ref={drawnPathRef}
              d={PATH_D}
              stroke="url(#nhPathGrad)"
              strokeWidth={isMobile ? "5" : scaled(3, scale)}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#nhPathGlow)"
            />
            <circle ref={cometGlowRef} r="14" fill="rgba(0,204,255,0.35)" filter="url(#nhCometGlow)" opacity="0" />
            <circle ref={cometRef}     r="6"  fill="#ffffff"              filter="url(#nhCometGlow)" opacity="0" />
          </svg>
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: 2, 
            pointerEvents: 'none'
          }}>
            {ready && steps.map((step, i) => {
              const isLeft   = !isMobile && i % 2 === 0;
              const nodeY_Px = NY(i);
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
              const mobileStyle = {
                position: 'absolute' as const,
                top: `${nodeY_Px}px`,
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '70vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isReached ? 1 : 0,
                transition: 'opacity 0.45s ease',
                pointerEvents: 'auto' as const,
              };
              return (
                <div key={i} style={isMobile ? mobileStyle : desktopStyle}>
                  <div style={{ textAlign: 'center', maxWidth: isMobile ? '70vw' : '420px', margin: isMobile ? '0 auto' : '0' }}>
                    <div style={{
                      fontFamily: "'EB Garamond', serif", fontWeight: 700,
                      fontSize: isMobile ? '9px' : scaled(18, scale), color: '#00ccff',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      marginBottom: isMobile ? scaled(2, scale) : scaled(4, scale),
                    }}>{step.n}</div>
                    <h2 style={{
                      fontFamily: "'EB Garamond', serif", fontWeight: 800,
                      fontSize: isMobile ? 'clamp(11px, 3vw, 14px)' : scaled(28, scale),
                      color: isDark ? '#fff' : '#0A0A0A', letterSpacing: '-0.01em', lineHeight: 1.1,
                      textTransform: 'uppercase', marginBottom: isMobile ? 4 : scaled(10, scale),
                      transition: 'background 0.3s ease, color 0.3s ease',
                    }}>{step.title}</h2>
                    <p style={{
                      fontFamily: "'Inter', sans-serif", fontWeight: 300,
                      fontSize: isMobile ? '9px' : scaled(13, scale),
                      color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)', lineHeight: 1.4,
                      marginBottom: isMobile ? 4 : scaled(10, scale),
                      transition: 'background 0.3s ease, color 0.3s ease',
                    }}>{step.sub}</p>
                    <div style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: isMobile ? '9px' : scaled(14, scale),
                      color: 'rgba(0,204,255,1)', fontWeight: 600, letterSpacing: '0.02em',
                      borderLeft:   isMobile ? 'none' : (isLeft ? '3px solid #00ccff' : 'none'),
                      borderRight:  isMobile ? 'none' : (isLeft ? 'none' : '3px solid #00ccff'),
                      borderBottom: isMobile ? '3px solid #00ccff' : 'none',
                      paddingLeft:  isMobile ? '0' : (isLeft ? scaled(16, scale) : '0'),
                      paddingRight: isMobile ? '0' : (isLeft ? '0' : scaled(16, scale)),
                      paddingBottom: isMobile ? '8px' : '0',
                      marginTop: scaled(12, scale),
                    }}>{step.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
