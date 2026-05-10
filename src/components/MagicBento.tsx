import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';
import { useScale, scaled } from '../hooks/useScale';
import { DICT } from '../lib/translations';

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
    particlesRef.current.forEach(p => p.parentNode?.removeChild(p));
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
        p.parentNode?.removeChild(p);
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
          onComplete: () => p.parentNode?.removeChild(p)
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
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
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
  const isMobile = useMobileDetection();
  const scale = useScale();
  const shouldDisableAnimations = disableAnimations || isMobile;
  const t = DICT[lang].magicBento;

  const cardData: any[] = [
    {
      type: 'usecase',
      color: '#0A0A0A',
      glowColor: '0, 204, 255',
      items: [
        { title: t.sales.title, desc: t.sales.desc },
      ]
    },
    {
      type: 'usecase',
      color: '#0A0A0A',
      glowColor: '255, 170, 0',
      items: [
        { title: t.strategy.title, desc: t.strategy.desc },
      ]
    },
    {
      type: 'image',
      color: '#0A0A0A',
      glowColor: '0, 204, 255',
    },
    {
      type: 'image',
      color: '#0A0A0A',
      glowColor: '255, 170, 0',
    },
    {
      type: 'usecase',
      color: '#0A0A0A',
      glowColor: '0, 204, 255',
      items: [
        { title: t.controlling.title, desc: t.controlling.desc },
      ]
    },
    {
      type: 'usecase',
      color: '#0A0A0A',
      glowColor: '255, 170, 0',
      items: [
        { title: t.operations.title, desc: t.operations.desc },
      ]
    },
  ];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', padding: '0', marginBottom: '4rem', userSelect: 'none', zIndex: 10 }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'rgba(0,204,255,0.6)', letterSpacing:'.3em', textTransform:'uppercase', marginBottom:20 }}>{t.label}</div>
        <div style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 550, fontSize: isMobile ? 'clamp(24px, 7vw, 36px)' : 'clamp(32px, 4.5vw, 60px)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.05, textTransform: 'uppercase' }}>{t.title}</div>
      </div>
      {enableSpotlight && <GlobalSpotlight gridRef={gridRef} disableAnimations={shouldDisableAnimations} enabled={enableSpotlight} spotlightRadius={spotlightRadius} glowColor={glowColor} />}
      <div className="card-grid bento-section" ref={gridRef}>
        {cardData.map((card, index) => {
          const baseClassName = `magic-bento-card${card.type === 'image' ? ' magic-bento-card--image' : ''}${enableBorderGlow && card.type !== 'image' ? ' magic-bento-card--border-glow' : ''}`;
          const itemGlowColor = card.glowColor || glowColor;
          const cardStyle = { 
            backgroundColor: card.color, 
            '--glow-color': itemGlowColor,
            borderColor: `rgba(${itemGlowColor}, 0.18)` 
          } as React.CSSProperties;

          const cardContent = () => {
            if (card.type === 'usecase') {
              return (
                <div style={{ display:'flex', flexDirection:'column', height:'100%', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:24, flex:1, justifyContent:'center' }}>
                    {card.items?.map((item: any, i: number) => (
                      <div key={i} style={{ borderLeft:`2px solid rgba(${itemGlowColor},0.3)`, paddingLeft:'clamp(16px, 2vw, 48px)', position:'relative', zIndex:1 }}>
                        <div style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: scaled(22, scale), textTransform: 'uppercase', letterSpacing: '0.02em', color: '#fff', marginBottom: 12, position:'relative', zIndex:1 }}>{item.title}</div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: scaled(15, scale), color: 'rgba(255,255,255,0.65)', lineHeight: 1.4, position:'relative', zIndex:1 }}>{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (card.type === 'image') {
              return (
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ color:'rgba(255,255,255,0.08)', fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:'.2em', textTransform:'uppercase' }}>{t.imagePlaceholder}</div>
                </div>
              );
            }
            return null;
          };

          if (enableStars && card.type !== 'image') {
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
