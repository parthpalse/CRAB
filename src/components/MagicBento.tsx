// src/components/MagicBento.tsx
import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';
import { useScale, scaled } from '../hooks/useScale';
import { DICT } from '../lib/translations';
import Chart from 'chart.js/auto';

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '0, 204, 255';
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (x: number, y: number, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `position:absolute;width:4px;height:4px;border-radius:50%;background:rgba(${color},1);box-shadow:0 0 6px rgba(${color},0.6);pointer-events:none;z-index:100;left:${x}px;top:${y}px;`;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({ proximity: radius * 0.5, fadeDistance: radius * 0.75 });

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--glow-x', `${((mouseX - rect.left) / rect.width) * 100}%`);
  card.style.setProperty('--glow-y', `${((mouseY - rect.top) / rect.height) * 100}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const renderTicks = () => {
  const cx = 360, cy = 360, r1 = 320, r2 = 336;
  const ticks = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const M = i % 6 === 0;
    const x1 = cx + Math.cos(a) * r1;
    const y1 = cy + Math.sin(a) * r1;
    const x2 = cx + Math.cos(a) * (M ? r2 + 6 : r2);
    const y2 = cy + Math.sin(a) * (M ? r2 + 6 : r2);
    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#00CCFF"
        strokeOpacity={M ? 0.7 : 0.25}
        strokeWidth={M ? 1 : 0.5}
      />
    );
  }
  return ticks;
};

interface ParticleCardProps {
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const ParticleCard = ({ children, className = '', disableAnimations = false, style, particleCount = DEFAULT_PARTICLE_COUNT, glowColor = DEFAULT_GLOW_COLOR, enableTilt = true, clickEffect = false, enableMagnetism = false }: ParticleCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () => createParticleElement(Math.random() * width, Math.random() * height, glowColor));
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    particlesRef.current.forEach(p => { if (p.parentNode) p.parentNode.removeChild(p); });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!isHoveredRef.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    const p = memoizedParticles.current[Math.floor(Math.random() * memoizedParticles.current.length)].cloneNode(true) as HTMLElement;
    cardRef.current.appendChild(p);
    particlesRef.current.push(p);

    const tx = (Math.random() - 0.5) * 120, ty = (Math.random() - 0.5) * 120;
    gsap.to(p, {
      x: tx, y: ty, opacity: 0, scale: 0, duration: 1.5 + Math.random(), ease: 'power2.out',
      onComplete: () => {
        if (p.parentNode) p.parentNode.removeChild(p);
        particlesRef.current = particlesRef.current.filter(item => item !== p);
      }
    });

    const nextDelay = 150 + Math.random() * 300;
    const timeout = setTimeout(animateParticles, nextDelay);
    timeoutsRef.current.push(timeout);
  }, []);

  useEffect(() => {
    const element = cardRef.current;
    if (!element || disableAnimations) return;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      initializeParticles();
      animateParticles();
    };
    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
      if (magnetismAnimationRef.current) magnetismAnimationRef.current.kill();
      gsap.to(element, { x: 0, y: 0, rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power2.out' });
    };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      if (enableTilt) {
        const xc = rect.width / 2, yc = rect.height / 2;
        const dx = x - xc, dy = y - yc;
        gsap.to(element, { rotationY: dx / 15, rotationX: -dy / 15, duration: 0.4, ease: 'power2.out' });
      }
      if (enableMagnetism) {
        const mx = (x - rect.width / 2) * 0.15, my = (y - rect.height / 2) * 0.15;
        if (magnetismAnimationRef.current) magnetismAnimationRef.current.kill();
        magnetismAnimationRef.current = gsap.to(element, { x: mx, y: my, duration: 0.4, ease: 'power2.out' });
      }
    };
    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      for (let i = 0; i < 8; i++) {
        const p = createParticleElement(x, y, glowColor);
        element.appendChild(p);
        gsap.to(p, {
          x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200, opacity: 0, scale: 0, duration: 0.8 + Math.random(), ease: 'power2.out',
          onComplete: () => { if (p.parentNode) p.parentNode.removeChild(p); }
        });
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);
    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div ref={cardRef} className={`${className} particle-container`} style={{ ...style, position: 'relative', overflow: 'hidden' }}>
      {children}
    </div>
  );
};

interface GlobalSpotlightProps {
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}

const GlobalSpotlight = ({ gridRef, disableAnimations = false, enabled = true, spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS, glowColor = DEFAULT_GLOW_COLOR }: GlobalSpotlightProps) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;
    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `position:fixed;width:800px;height:800px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(${glowColor},0.15) 0%,rgba(${glowColor},0.08) 15%,rgba(${glowColor},0.04) 25%,rgba(${glowColor},0.02) 40%,rgba(${glowColor},0.01) 65%,transparent 70%);z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;`;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;
      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside = rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      const cards = gridRef.current.querySelectorAll('.magic-bento-card');
      if (!mouseInside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        cards.forEach(card => (card as HTMLElement).style.setProperty('--glow-intensity', '0'));
        return;
      }
      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;
      cards.forEach(card => {
        const cardHtml = card as HTMLElement;
        const cardRect = cardHtml.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2, centerY = cardRect.top + cardRect.height / 2;
        const effectiveDistance = Math.max(0, Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2);
        minDistance = Math.min(minDistance, effectiveDistance);
        let glowIntensity = 0;
        if (effectiveDistance <= proximity) glowIntensity = 1;
        else if (effectiveDistance <= fadeDistance) glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        updateCardGlowProperties(cardHtml, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });
      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out' });
      const targetOpacity = minDistance <= proximity ? 0.8 : minDistance <= fadeDistance ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8 : 0;
      gsap.to(spotlightRef.current, { opacity: targetOpacity, duration: targetOpacity > 0 ? 0.2 : 0.5, ease: 'power2.out' });
    };
    const handleMouseLeave = () => {
      gridRef.current?.querySelectorAll('.magic-bento-card').forEach(card => (card as HTMLElement).style.setProperty('--glow-intensity', '0'));
      if (spotlightRef.current) gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return { isMobile, isTablet };
};

const GrowthChartTile = ({ lang }: { lang: 'EN' | 'DE' }) => {
  const t = DICT[lang].magicBento.growthChart;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const [activeRange, setActiveRange] = useState<'6M' | '12M' | 'YTD'>('12M');

  // Datasets
  const months12 = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
  const months6  = ['Oct','Nov','Dec','Jan','Feb','Mar'];

  const withK_12  = [298, 305, 312, 326, 348, 372, 395, 410, 428, 445, 466, 487];
  const withK_6   = withK_12.slice(6);

  const base_12   = [298, 301, 296, 305, 312, 315, 308, 314, 318, 322, 319, 325];
  const base_6    = base_12.slice(6);

  // Determine current active metrics
  const totalVal = '€487K';
  let changeVal = '↑ 38.2%';
  if (activeRange === '6M') {
    changeVal = '↑ 24.1%';
  } else if (activeRange === 'YTD') {
    changeVal = '↑ 9.4%';
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    Chart.defaults.font.family = "'EB Garamond', serif";

    // Vertical gradient fill for the Klarstone area
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0,    'rgba(0, 204, 255, 0.32)');
    gradient.addColorStop(0.5,  'rgba(0, 204, 255, 0.10)');
    gradient.addColorStop(1,    'rgba(0, 204, 255, 0)');

    let labels: string[];
    let withData: number[];
    let baseData: number[];

    if (activeRange === '6M') {
      labels = months6;
      withData = withK_6;
      baseData = base_6;
    } else if (activeRange === 'YTD') {
      labels = ['Jan','Feb','Mar'];
      withData = [445, 466, 487];
      baseData = [322, 319, 325];
    } else {
      labels = months12;
      withData = withK_12;
      baseData = base_12;
    }

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: t.withKlarstone,
            data: withData,
            borderColor: '#00ccff',
            backgroundColor: gradient,
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#00ccff',
            pointHoverBorderColor: '#0A0A0A',
            pointHoverBorderWidth: 3,
          },
          {
            label: t.baseline,
            data: baseData,
            borderColor: '#ffaa00',
            borderWidth: 1.5,
            borderDash: [4, 4],
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: '#ffaa00',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#131913',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            titleColor: '#FFFFFF',
            bodyColor: '#E8F4EC',
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            boxWidth: 8,
            boxHeight: 8,
            callbacks: {
              label: (context: any) => `  ${context.dataset.label}: €${context.parsed.y}K`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#6B8377', font: { size: 15 } },
            border: { color: 'rgba(255, 255, 255, 0.08)' }
          },
          y: {
            grid: { color: 'rgba(255, 170, 0, 0.25)', drawTicks: false },
            ticks: {
              color: '#6B8377',
              font: { size: 15 },
              callback: (value: any) => '€' + value + 'K',
              stepSize: 50
            },
            border: { display: false },
            min: 270,
            max: 510
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [activeRange]);

  return (
    <div className="gc-wrap">
      <div className="gc-head">
        <div className="gc-left">
          <h3>{t.heading}</h3>
          <div className="gc-stat-row">
            <span className="gc-stat-val">{totalVal}</span>
            <span className="gc-stat-change">{changeVal}</span>
          </div>
          <p>{t.subtitle}</p>
        </div>
        <div className="gc-toggle">
          {(['6M', '12M', 'YTD'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={activeRange === range ? 'active' : ''}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="gc-chart-wrap">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Revenue growth line chart showing monthly revenue before and after Klarstone implementation"
        />
      </div>

      <div className="gc-legend">
        <div className="gc-legend-item">
          <span className="gc-dot" style={{ backgroundColor: '#00ccff' }}></span>
          {t.withKlarstone}
        </div>
        <div className="gc-legend-item">
          <span className="gc-dot" style={{ backgroundColor: '#ffaa00' }}></span>
          {t.baseline}
        </div>
      </div>

      <div className="gc-footer">
        <span className="gc-footer-left">{t.sampleData}</span>
        <span className="gc-footer-right">{t.incremental}</span>
      </div>
    </div>
  );
};

interface MagicBentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  lang: 'EN' | 'DE';
}

export default function MagicBento({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  lang
}: MagicBentoProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet } = useMobileDetection();
  const scale = useScale();
  const shouldDisableAnimations = disableAnimations || isMobile;
  const t = DICT[lang].magicBento;
  const secT = t.security;

  const cardData: any[] = [
    { type: 'usecase', color: '#0A0A0A', glowColor: '0, 204, 255', items: [{ title: t.sales.title, desc: t.sales.desc }] },
    { type: 'usecase', color: '#0A0A0A', glowColor: '255, 170, 0', items: [{ title: t.strategy.title, desc: t.strategy.desc }] },
    { type: 'security', color: '#0A0A0A', glowColor: '0, 204, 255' },
    { type: 'chart', color: '#0A0A0A', glowColor: '255, 170, 0' },
    { type: 'usecase', color: '#0A0A0A', glowColor: '0, 204, 255', items: [{ title: t.controlling.title, desc: t.controlling.desc }] },
    { type: 'usecase', color: '#0A0A0A', glowColor: '255, 170, 0', items: [{ title: t.operations.title, desc: t.operations.desc }] },
  ];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', padding: '0', marginBottom: scaled(64, scale), userSelect: 'none', zIndex: 10 }}>
        <div style={{ fontFamily: "'EB Garamond', serif", fontSize: scaled(16, scale), color: 'rgba(0,204,255,0.6)', letterSpacing: '.3em', textTransform: 'uppercase', marginBottom: scaled(20, scale) }}>{t.label}</div>
        <div style={{ 
          fontFamily: "'EB Garamond', serif", fontWeight: 700, 
          fontSize: isMobile ? 'clamp(24px, 7vw, 36px)' : isTablet ? 'clamp(28px, 4vw, 44px)' : scaled(52, scale), 
          color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.05, textTransform: 'none' 
        }}>{t.title}</div>
      </div>
      {enableSpotlight && <GlobalSpotlight gridRef={gridRef} disableAnimations={shouldDisableAnimations} enabled={enableSpotlight} spotlightRadius={spotlightRadius} glowColor={glowColor} />}
      <div className="card-grid bento-section" ref={gridRef} style={{ '--card-gap': scaled(24, scale) } as React.CSSProperties}>
        {cardData.map((card, index) => {
          const baseClassName = `magic-bento-card${card.type === 'image' || card.type === 'security' || card.type === 'chart' ? ' magic-bento-card--image' : ''}${enableBorderGlow && card.type !== 'image' && card.type !== 'security' && card.type !== 'chart' ? ' magic-bento-card--border-glow' : ''}`;
          const itemGlowColor = card.glowColor || glowColor;
          const cardStyle = { 
            backgroundColor: card.color, 
            '--glow-color': itemGlowColor, 
            borderColor: `rgba(${itemGlowColor}, 0.18)`,
            borderRadius: scaled(24, scale),
            padding: (card.type === 'security' || card.type === 'chart') ? 0 : scaled(27, scale)
          } as React.CSSProperties;

          const cardContent = () => {
            if (card.type === 'usecase') {
              return (
                <div style={{ display:'flex', flexDirection:'column', height:'100%', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap: scaled(24, scale), flex:1, justifyContent:'center' }}>
                    {card.items?.map((item: any, i: number) => (
                      <div key={i} style={{ borderLeft:`2px solid rgba(${itemGlowColor},0.3)`, paddingLeft: scaled(27, scale), position:'relative', zIndex:1 }}>
                        <div style={{ 
                          fontFamily: "'EB Garamond', serif", fontWeight: 700, 
                          fontSize: isMobile ? 'clamp(19px, 4vw, 23px)' : isTablet ? 'clamp(21px, 2.5vw, 25px)' : scaled(24, scale), 
                          textTransform: 'none', letterSpacing: '0.02em', color: '#fff', marginBottom: scaled(12, scale), position:'relative', zIndex:1 
                        }}>{item.title}</div>
                        <div style={{ 
                          fontFamily: "'Inter', sans-serif", fontWeight: 300, 
                          fontSize: isMobile ? '13px' : isTablet ? '14px' : scaled(15, scale), 
                          color: 'rgba(255,255,255,0.65)', lineHeight: 1.4, position:'relative', zIndex:1 
                        }}>{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
             if (card.type === 'chart') {
              return <GrowthChartTile lang={lang} />;
            }
            if (card.type === 'image') {
              return (
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <img src={card.img} alt={card.alt} style={{ width: '100%', height: '100%', objectFit: card.imgFit || 'cover', ...(card.imgPosition ? { objectPosition: card.imgPosition } : {}), ...(card.imgTransform ? { transform: card.imgTransform } : {}), borderRadius: 'inherit' }} />
                </div>
              );
            }
            if (card.type === 'security') {
              return (
                <div className="di-tile">
                  <div className="di-composition">
                    <span className="di-kicker">{secT.kicker}</span>

                    <svg className="di-emblem" viewBox="0 0 720 720" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                      <defs>
                        <radialGradient id="di-halo" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#00CCFF" stopOpacity="0.55"/>
                          <stop offset="35%" stopColor="#00CCFF" stopOpacity="0.12"/>
                          <stop offset="70%" stopColor="#00CCFF" stopOpacity="0"/>
                        </radialGradient>
                        <linearGradient id="di-glass" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#BFF3FF" stopOpacity="0.20"/>
                          <stop offset="50%" stopColor="#00CCFF" stopOpacity="0.08"/>
                          <stop offset="100%" stopColor="#0091B8" stopOpacity="0.18"/>
                        </linearGradient>
                        <linearGradient id="di-edge" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#BFF3FF"/>
                          <stop offset="100%" stopColor="#0091B8"/>
                        </linearGradient>
                        <linearGradient id="di-shield" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0B1B22" stopOpacity="0.9"/>
                          <stop offset="100%" stopColor="#02080C" stopOpacity="1"/>
                        </linearGradient>
                        <filter id="di-glow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="3.2" result="b"/>
                          <feMerge>
                            <feMergeNode in="b"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                        <filter id="di-glowL" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="14" result="b"/>
                          <feMerge>
                            <feMergeNode in="b"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                        <path id="di-arcTop" d="M 220 348 A 140 140 0 0 1 500 348"/>
                        <path id="di-arcBot" d="M 220 348 A 140 140 0 0 0 500 348"/>
                      </defs>

                      <circle cx="360" cy="360" r="340" fill="url(#di-halo)"/>

                      <g className="di-ring-c" stroke="#00CCFF" strokeOpacity="0.35" fill="none">
                        <circle cx="360" cy="360" r="330" strokeWidth="0.5"/>
                        <g id="di-ticks">
                          {renderTicks()}
                        </g>
                      </g>

                      <g className="di-ring-a" fill="none">
                        <circle cx="360" cy="360" r="280" stroke="#00CCFF" strokeOpacity="0.55" strokeWidth="0.7" strokeDasharray="2 6"/>
                        <circle cx="360" cy="360" r="280" stroke="#00CCFF" strokeOpacity="0.18" strokeWidth="0.5" strokeDasharray="40 320"/>
                      </g>

                      <g className="di-ring-b" fill="none">
                        <circle cx="360" cy="360" r="230" stroke="#00CCFF" strokeOpacity="0.40" strokeWidth="0.6"/>
                        <g fill="#00CCFF" filter="url(#di-glow)">
                          <circle cx="360" cy="130" r="3"/><circle cx="590" cy="360" r="3"/>
                          <circle cx="360" cy="590" r="3"/><circle cx="130" cy="360" r="3"/>
                          <circle cx="522" cy="198" r="2"/><circle cx="522" cy="522" r="2"/>
                          <circle cx="198" cy="522" r="2"/><circle cx="198" cy="198" r="2"/>
                        </g>
                      </g>

                      <g fontFamily="Geist Mono, monospace" fontSize="9" fill="#7FE5FF" letterSpacing="2">
                        <text x="360" y="86" textAnchor="middle">N · 00°</text>
                        <text x="640" y="364" textAnchor="middle">E · 90°</text>
                        <text x="360" y="650" textAnchor="middle">S · 180°</text>
                        <text x="80" y="364" textAnchor="middle">W · 270°</text>
                      </g>

                      <g className="di-core">
                        <polygon points="360,140 540,240 540,440 360,540 180,440 180,240"
                          fill="none" stroke="url(#di-edge)" strokeWidth="1.2" opacity="0.9"/>
                        <polygon points="360,164 522,254 522,430 360,520 198,430 198,254"
                          fill="url(#di-glass)" stroke="#00CCFF" strokeOpacity="0.45" strokeWidth="0.6"/>

                        <path d="M360 220 C 420 220, 460 232, 470 244 L 470 348 C 470 408, 420 452, 360 478
                                 C 300 452, 250 408, 250 348 L 250 244 C 260 232, 300 220, 360 220 Z"
                              fill="url(#di-shield)" stroke="url(#di-edge)" strokeWidth="1"/>
                        <path d="M360 240 C 412 240, 446 250, 454 260 L 454 346 C 454 396, 412 436, 360 460
                                 C 308 436, 266 396, 266 346 L 266 260 C 274 250, 308 240, 360 240 Z"
                              fill="none" stroke="#00CCFF" strokeOpacity="0.35" strokeWidth="0.6"/>

                        <g filter="url(#di-glow)">
                          <polygon points="360,278 410,348 360,418 310,348" fill="#02080C" stroke="#00CCFF" strokeWidth="1"/>
                          <line x1="360" y1="278" x2="360" y2="418" stroke="#00CCFF" strokeWidth="0.6" strokeOpacity="0.6"/>
                          <line x1="310" y1="348" x2="410" y2="348" stroke="#00CCFF" stroke-width="0.6" strokeOpacity="0.6"/>
                          <polygon points="360,278 410,348 360,348" fill="#00CCFF" fillOpacity="0.10"/>
                          <polygon points="360,348 410,348 360,418" fill="#00CCFF" fillOpacity="0.04"/>
                        </g>

                        <circle cx="360" cy="348" r="3.2" fill="#BFF3FF" filter="url(#di-glow)"/>
                        <circle cx="360" cy="348" r="8" fill="none" stroke="#00CCFF" strokeOpacity="0.5"/>

                        <text fontFamily="Geist Mono, monospace" fontSize="9" fill="#7FE5FF" letterSpacing="6">
                          <textPath href="#di-arcTop" startOffset="50%" textAnchor="middle">INTEGRITAS · CUSTODITA · IN · LUCE</textPath>
                        </text>
                        <text fontFamily="Geist Mono, monospace" fontSize="8" fill="#7FE5FF" fillOpacity="0.7" letterSpacing="6">
                          <textPath href="#di-arcBot" startOffset="50%" textAnchor="middle">SHA · 256 · VERIFIED · MMXXVI</textPath>
                        </text>

                        <g fill="#00CCFF">
                          <circle cx="360" cy="140" r="2.5"/><circle cx="540" cy="240" r="2.5"/>
                          <circle cx="540" cy="440" r="2.5"/><circle cx="360" cy="540" r="2.5"/>
                          <circle cx="180" cy="440" r="2.5"/><circle cx="180" cy="240" r="2.5"/>
                        </g>
                      </g>

                      <g stroke="#00CCFF" strokeOpacity="0.10">
                        <line x1="20" y1="360" x2="700" y2="360" strokeWidth="0.5"/>
                        <line x1="360" y1="20" x2="360" y2="700" strokeWidth="0.5"/>
                      </g>

                      <g className="di-pulse">
                        <circle cx="360" cy="60" r="2.5" fill="#BFF3FF" filter="url(#di-glowL)"/>
                      </g>
                    </svg>

                    <h1 className="di-headline">{secT.headline} <em>{secT.headlineItalic}</em></h1>
                  </div>
                </div>
              );
            }
            return null;
          };

          if (enableStars && card.type !== 'image' && card.type !== 'security' && card.type !== 'chart') {
            return (
              <ParticleCard key={index} className={baseClassName} style={cardStyle} disableAnimations={shouldDisableAnimations} particleCount={particleCount} glowColor={itemGlowColor} enableTilt={enableTilt} clickEffect={clickEffect} enableMagnetism={enableMagnetism}>
                {cardContent()}
              </ParticleCard>
            );
          }

          return (
            <div key={index} className={baseClassName} style={cardStyle}>
              {cardContent()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
