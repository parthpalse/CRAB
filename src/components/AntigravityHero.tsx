// src/components/AntigravityHero.tsx
import React, { useEffect, useRef, useState } from 'react';
import { initHeroScene } from './heroScene';
import MagicBento from './MagicBento';
import DarkVeil from './DarkVeil';
import HowItWorks from './HowItWorks';
import ContactUs from './ContactUs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScale, scaled } from '../hooks/useScale';
import { DICT } from '../lib/translations';

gsap.registerPlugin(ScrollTrigger);

export default function AntigravityHero() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') !== 'light';
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
  const bg = isDark ? '#0A0A0A' : '#F5F5F5';
  const fg = isDark ? '#ffffff' : '#0A0A0A';
  const muted = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const navBg = isDark ? 'rgba(10,10,10,0.78)' : 'rgba(245,245,245,0.85)';
  const t = DICT[lang];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const scale = useScale();
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

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setHideNav(window.scrollY > window.innerHeight * 0.9);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Safety fallback: reveal after 2.5s if scene initialization hangs or crashes
    const timer = setTimeout(() => setRevealed(true), 2500);

    if (canvasRef.current) {
      try {
        const cleanup = initHeroScene(canvasRef.current, () => setRevealed(true));
        return () => { 
          if (cleanup) cleanup(); 
          clearTimeout(timer); 
        };
      } catch (err) {
        console.error("Hero scene failed:", err);
        setRevealed(true);
      }
    }
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://use.typekit.net/jho4afd.css');
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        [data-theme='dark'] {
          --bg: #0A0A0A;
          --fg: #ffffff;
          --muted: rgba(255,255,255,0.55);
          --card-bg: #0d1117;
          --border: rgba(255,255,255,0.08);
          --nav-bg: rgba(10,10,10,0.78);
          --section-bg: #0A0A0A;
        }

        [data-theme='light'] {
          --bg: #F5F5F5;
          --fg: #0A0A0A;
          --muted: rgba(0,0,0,0.55);
          --card-bg: #FFFFFF;
          --border: rgba(0,0,0,0.08);
          --nav-bg: rgba(245,245,245,0.85);
          --section-bg: #F5F5F5;
        }

        :root{--bg:#0A0A0A;--fg:#ffffff;--muted:rgba(255,255,255,0.55);--dim:rgba(255,255,255,0.32);--line:rgba(255,255,255,0.08);--line-2:rgba(255,255,255,0.16);--card-bg:#0d1117;--border:rgba(255,255,255,0.08);--nav-bg:rgba(10,10,10,0.78);--section-bg:#0A0A0A}
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{background:var(--bg);color:var(--fg);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        ::-webkit-scrollbar{width:6px;background:#000}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:4px}
        @keyframes load{0%{transform:translateX(-100%)}100%{transform:translateX(280%)}}
        
        /* Override index.css static background color dynamic */
        html, body, #root {
          background-color: var(--bg) !important;
        }
        section, footer, div[style] {
          transition: background 0.3s ease, color 0.3s ease;
        }
      `}</style>

      {/* Splash Screen */}
      <div id="splash" style={{ position: 'fixed', inset: 0, zIndex: 200, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18, transition: 'opacity .8s ease, background 0.3s ease, color 0.3s ease', pointerEvents: 'none', opacity: revealed ? 0 : 1 }}>
        <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 10, color: 'rgba(255,255,255,.45)', letterSpacing: '.3em' }}>{t.splash}</div>
        <div style={{ width: 160, height: 1, background: 'rgba(255,255,255,.1)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, width: '40%', background: '#fff', animation: 'load 1.2s ease-in-out infinite', boxShadow: '0 0 12px rgba(255,255,255,.4)' }} />
        </div>
      </div>

      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 40, 
        height: isMobile ? 32 : scaled(64, scale), 
        display: 'grid', 
        gridTemplateColumns: isMobile ? 'auto auto auto' : isTablet ? 'auto 1fr auto' : '1fr auto 1fr', 
        columnGap: isMobile ? '8px' : '0px',
        alignItems: 'center', 
        padding: isMobile ? '0 6px' : isTablet ? '0 32px' : '0 2vw', 
        transform: 'translateY(0)', 
        transition: 'transform 0.4s ease, backdrop-filter .3s ease, background 0.3s ease, border-color 0.3s ease', 
        borderBottom: `1px solid ${scrolled ? border : 'transparent'}`, 
        backdropFilter: scrolled ? 'blur(14px)' : 'none', 
        background: scrolled ? navBg : 'transparent' 
      }}>
        <div 
          onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <img 
            src="/Klarstone_logo_.svg" 
            alt="Klarstone" 
            style={{ 
              height: isMobile ? '24px' : scaled(44, scale),
              width: 'auto',
              filter: isDark ? 'brightness(0) invert(1)' : 'brightness(0)'
            }} 
          />
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: isMobile ? '10px' : isTablet ? '24px' : '48px', 
          alignItems: 'center', 
          fontSize: isMobile ? 8 : isTablet ? 12 : 13, 
          color: muted, 
          fontFamily: 'Inter, sans-serif', 
          fontWeight: 300, 
          letterSpacing: '0.03em',
          transition: 'background 0.3s ease, color 0.3s ease'
        }}>

          <a href="#about" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = fg} onMouseOut={e => e.currentTarget.style.color = muted}>{t.nav[1]}</a>
          <a href="#services" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = fg} onMouseOut={e => e.currentTarget.style.color = muted}>{t.nav[2]}</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = fg} onMouseOut={e => e.currentTarget.style.color = muted}>{t.nav[3]}</a>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: isMobile ? 8 : isTablet ? 32 : 32, 
          alignItems: 'center', 
          justifyContent: 'flex-end', 
          fontSize: isMobile ? 8 : 13, 
          color: muted, 
          fontFamily: 'Inter, sans-serif', 
          fontWeight: 300,
          transition: 'background 0.3s ease, color 0.3s ease'
        }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = fg} onMouseOut={e => e.currentTarget.style.color = muted}>{t.nav[4]}</a>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: isMobile ? 8 : 11, letterSpacing: '0.05em' }}>
            <span onClick={() => setLang('EN')} style={{ cursor: 'pointer', color: lang === 'EN' ? fg : 'inherit', fontWeight: lang === 'EN' ? 500 : 300, transition: 'color .2s' }}>EN</span>
            <span style={{ opacity: 0.2 }}>|</span>
            <span onClick={() => setLang('DE')} style={{ cursor: 'pointer', color: lang === 'DE' ? fg : 'inherit', fontWeight: lang === 'DE' ? 500 : 300, transition: 'color .2s' }}>DE</span>
          </div>
          {!isMobile && (
            <div
              onClick={() => setIsDark(!isDark)}
              style={{
                width: 36,
                height: 20,
                borderRadius: 10,
                background: isDark ? '#00ccff' : 'rgba(255,255,255,0.2)', // brand cyan #00ccff in dark mode
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
                flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute',
                top: 2,
                left: isDark ? 18 : 2,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#ffffff',
                transition: 'left 0.3s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }} />
            </div>
          )}
        </div>
      </nav>

      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: isDark ? 'radial-gradient(80% 60% at 50% 50%, #1a1a1a 0%, #0a0a0a 60%, #000 100%)' : 'radial-gradient(80% 60% at 50% 50%, #F5F5F5 0%, #F5F5F5 60%, #F5F5F5 100%)', pointerEvents: 'none' }} />

      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: scrolled ? 0 : 1, transition: 'opacity 0.25s ease' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', inset: 0, background: isDark ? 'radial-gradient(70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.95) 100%), linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.8) 100%)' : 'none' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: .07, mixBlendMode: 'overlay', backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />
      </div>

      <section id="home" style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', background: 'transparent', display: 'flex', alignItems: 'center', padding: isMobile ? '0 24px' : `0 ${scaled(109, scale)}`, pointerEvents: 'none' }}>
        <div style={{ maxWidth: 1400, pointerEvents: 'auto', opacity: revealed && !scrolled ? 1 : 0, transition: 'opacity 0.8s ease', zIndex: 10, textAlign: 'left' }}>
          <div style={{ fontFamily: "'EB Garamond', serif", fontWeight: 400, fontSize: scaled(22, scale), textTransform: 'none', letterSpacing: '0.1em', color: 'rgba(0,204,255,0.9)', marginBottom: 20 }}>{t.heroTitle}</div>
          <h1 style={{ color: fg, fontSize: isMobile ? 'clamp(28px, 7.5vw, 38px)' : isTablet ? 'clamp(52px, 6vw, 80px)' : scaled(115, scale), letterSpacing: '-0.02em', marginBottom: 32, fontFamily: "'EB Garamond', serif", fontWeight: 400, lineHeight: 1.1, textWrap: 'balance' as any, transition: 'background 0.3s ease, color 0.3s ease' }}>{lang === 'EN' ? <>Your AI Consultant<br />for Strategic Decisions</> : <>Entscheidungsintelligenz<br />für moderne Unternehmen</>}</h1>
          <a
            href="#contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: isDark ? 'transparent' : 'rgba(245,245,245,0.5)',
              color: fg,
              padding: '14px 28px',
              borderRadius: 8,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: scaled(14, scale),
              textDecoration: 'none',
              border: isDark ? `1px solid ${border}` : '1px solid rgba(0,0,0,0.15)',
              cursor: 'pointer',
              transition: 'all 0.3s ease, background 0.3s ease, color 0.3s ease',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 20px rgba(0,204,255,0.5)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = '#00ccff';
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.color = fg;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = isDark ? border : 'rgba(0,0,0,0.15)';
              (e.currentTarget as HTMLAnchorElement).style.background = isDark ? 'transparent' : 'rgba(245,245,245,0.5)';
              (e.currentTarget as HTMLAnchorElement).style.color = fg;
            }}
            onMouseDown={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = isDark ? '#00ccff' : 'rgba(0,204,255,0.8)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = isDark ? '0 0 30px rgba(0,204,255,0.6)' : '0 0 30px rgba(0,204,255,0.8)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(0.96)';
            }}
            onMouseUp={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
            }}
          >
            {t.bookBtn}
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </div>
      </section>

      <WhatWeDo lang={lang} isDark={isDark} />
      <HowItWorks lang={lang} isDark={isDark} />
      <KeyBenefits lang={lang} isDark={isDark} />

      <div id="services" style={{ position: 'relative', zIndex: 8, width: '100%', padding: '80px 0 120px', background: isDark ? '#0A0A0A' : '#F5F5F5', overflow: 'hidden', transition: 'background 0.3s ease, color 0.3s ease' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: isDark ? 1 : 0, transition: 'opacity 0.3s ease' }}>
          <DarkVeil
            scanlineIntensity={0.47}
            speed={1.5}
            scanlineFrequency={4.5}
            warpAmount={1.7}
          />
        </div>
        <div style={{ 
          position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', 
          padding: isMobile ? '0 20px' : isTablet ? '0 48px' : `0 ${scaled(109, scale)}`, boxSizing: 'border-box' 
        }}>
          <MagicBento
            lang={lang}
            isDark={isDark}
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={430}
            particleCount={12}
            glowColor="0, 204, 255"
          />
        </div>
      </div>

      <ContactUs lang={lang} isDark={isDark} />
      <Footer lang={lang} isDark={isDark} />
    </>
  );
}

function WhatWeDo({ lang, isDark }: { lang: 'EN' | 'DE'; isDark: boolean }) {
  const t = DICT[lang].whatWeDo;
  const scale = useScale();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const bg = isDark ? '#0A0A0A' : '#F5F5F5';
  const fg = isDark ? '#ffffff' : '#0A0A0A';
  const muted = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const navBg = isDark ? 'rgba(10,10,10,0.78)' : 'rgba(245,245,245,0.85)';

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

  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const els = [labelRef.current, headRef.current, p1Ref.current, p2Ref.current];
    els.forEach(el => {
      if (!el) return;
      gsap.set(el, { opacity: 0, y: 36 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        }
      });
    });
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      style={{
        position: 'relative',
        zIndex: 8,
        background: bg,
        width: '100%',
        padding: isMobile ? '60px 24px' : isTablet ? '80px 48px' : `${scaled(120, scale)} ${scaled(109, scale)}`,
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        <div ref={labelRef} style={{
          fontFamily: "'EB Garamond', serif",
          fontWeight: 400,
          fontSize: '16px',
          color: isDark ? 'rgba(0,204,255,0.6)' : 'rgba(0,204,255,0.8)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase' as const,
          marginBottom: 20,
        }}>
          {t.label}
        </div>
        <h2 ref={headRef} style={{
          fontFamily: "'EB Garamond', serif",
          fontWeight: 600,
          fontSize: isMobile ? 'clamp(24px, 7vw, 36px)' : scaled(51, scale),
          color: fg,
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          textTransform: 'none' as const,
          marginBottom: 32,
          transition: 'background 0.3s ease, color 0.3s ease',
        }}>
          {t.title}
        </h2>
        <p ref={p1Ref} style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: isMobile ? '15px' : scaled(16, scale),
          color: muted,
          lineHeight: 1.8,
          marginBottom: scaled(16, scale),
          transition: 'background 0.3s ease, color 0.3s ease',
        }}>
          {t.p1}
        </p>
        <p ref={p2Ref} style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: isMobile ? '15px' : scaled(16, scale),
          color: muted,
          lineHeight: 1.8,
          transition: 'background 0.3s ease, color 0.3s ease',
        }}>
          {t.p2}
        </p>
      </div>
    </section>
  );
}

function KeyBenefits({ lang, isDark }: { lang: 'EN' | 'DE'; isDark: boolean }) {
  const t = DICT[lang].keyBenefits;
  const scale = useScale();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const bg = isDark ? '#0A0A0A' : '#F5F5F5';
  const fg = isDark ? '#ffffff' : '#0A0A0A';
  const muted = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const navBg = isDark ? 'rgba(10,10,10,0.78)' : 'rgba(245,245,245,0.85)';

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

  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [labelRef.current, headRef.current];
    if (listRef.current) {
      gsap.set(listRef.current, { opacity: 1, y: 0 });
    }
    els.forEach(el => {
      if (!el) return;
      gsap.set(el, { opacity: 0, y: 36 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        }
      });
    });
  }, []);

  const benefits = t.items;

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 8,
        background: bg,
        width: '100%',
        paddingTop: isMobile ? '60px' : isTablet ? '80px' : '120px',
        paddingBottom: isMobile ? '60px' : isTablet ? '80px' : '120px',
        paddingLeft: isMobile ? '24px' : isTablet ? '48px' : scaled(109, scale),
        paddingRight: isMobile ? '24px' : isTablet ? '48px' : scaled(109, scale),
        boxSizing: 'border-box' as const,
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      <div style={{ width: '100%' }}>
        <div ref={labelRef} style={{
          fontFamily: "'EB Garamond', serif",
          fontWeight: 400,
          fontSize: scaled(16, scale),
          color: isDark ? 'rgba(0,204,255,0.6)' : 'rgba(0,204,255,0.8)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase' as const,
          marginBottom: scaled(20, scale),
        }}>
          {t.label}
        </div>
        <h2 ref={headRef} style={{
          fontFamily: "'EB Garamond', serif",
          fontWeight: 600,
          fontSize: isMobile ? 'clamp(28px, 3.2vw, 42px)' : scaled(52, scale),
          color: fg,
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          textTransform: 'none' as const,
          marginBottom: scaled(60, scale),
          whiteSpace: isMobile ? 'normal' : isTablet ? 'normal' : 'nowrap',
          transition: 'background 0.3s ease, color 0.3s ease',
        }}>
          {t.title}
        </h2>
        
        <div ref={listRef} style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
          gap: isMobile ? '16px' : 'clamp(24px, 3vw, 48px) clamp(32px, 5vw, 100px)', 
          overflow: 'hidden' 
        }}>
          {benefits.map((benefit, i) => (
            <div key={i} style={{ 
              borderLeft: isDark ? (isMobile ? '2px solid rgba(0,204,255,0.6)' : '2px solid rgba(0,204,255,0.3)') : (isMobile ? '2px solid rgba(0,204,255,0.8)' : '2px solid rgba(0,204,255,0.4)'), 
              paddingLeft: 20,
              display: 'flex',
              alignItems: 'flex-start',
              minHeight: '60px'
            }}>
              <p style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontWeight: 300, 
                fontSize: 'clamp(14px, 1.2vw, 18px)', 
                color: muted, 
                lineHeight: 1.4,
                transition: 'background 0.3s ease, color 0.3s ease',
              }}>
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Footer({ lang, isDark }: { lang: 'EN' | 'DE'; isDark: boolean }) {
  const t = DICT[lang].footer;
  const scale = useScale();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const bg = isDark ? '#0A0A0A' : '#F5F5F5';
  const fg = isDark ? '#ffffff' : '#0A0A0A';
  const muted = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const navBg = isDark ? 'rgba(10,10,10,0.78)' : 'rgba(245,245,245,0.85)';

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

  return (
    <footer style={{ 
      position: 'relative', 
      width: '100%', 
      background: bg, 
      zIndex: 10, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'stretch', 
      paddingTop: isMobile ? '80px' : isTablet ? '100px' : '120px',
      paddingBottom: '60px',
      paddingLeft: isMobile ? '24px' : isTablet ? '48px' : scaled(109, scale),
      paddingRight: isMobile ? '24px' : isTablet ? '48px' : scaled(109, scale),
      boxSizing: 'border-box' as const,
      transition: 'background 0.3s ease, color 0.3s ease',
    }}>
      <div style={{ textAlign: 'left', marginBottom: 80, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h2 style={{ 
          fontFamily: "'EB Garamond', serif", 
          fontWeight: 600, 
          fontSize: isMobile ? 'clamp(24px, 6vw, 36px)' : isTablet ? 'clamp(28px, 4vw, 44px)' : 'clamp(28px, 3.5vw, 56px)', 
          color: fg, 
          letterSpacing: '-0.02em', 
          lineHeight: 1.1, 
          marginBottom: 24,
          whiteSpace: isMobile ? 'normal' : isTablet ? 'normal' : 'nowrap',
          textTransform: 'none' as const,
          textWrap: 'balance' as any,
          transition: 'background 0.3s ease, color 0.3s ease',
        }}>
          {t.title}
        </h2>
        <p style={{ 
          fontFamily: "'Inter', sans-serif", 
          fontWeight: 300, 
          fontSize: 'clamp(16px, 1.4vw, 22px)', 
          color: muted, 
          marginBottom: 48,
          lineHeight: 1.6,
          maxWidth: 700,
          transition: 'background 0.3s ease, color 0.3s ease',
        }}>
          {t.sub}
        </p>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            background: isDark ? 'transparent' : 'rgba(245,245,245,0.5)',
            color: fg,
            padding: '14px 28px',
            borderRadius: 8,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: scaled(16, scale),
            textDecoration: 'none',
            border: isDark ? `1px solid ${border}` : '1px solid rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.3s ease, background 0.3s ease, color 0.3s ease',
            letterSpacing: '0.02em',
            width: '100%',
            marginTop: scaled(12, scale),
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 20px rgba(0,204,255,0.5)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = '#00ccff';
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.color = fg;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = isDark ? border : 'rgba(0,0,0,0.15)';
            (e.currentTarget as HTMLAnchorElement).style.background = isDark ? 'transparent' : 'rgba(245,245,245,0.5)';
            (e.currentTarget as HTMLAnchorElement).style.color = fg;
          }}
          onMouseDown={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = isDark ? '#00ccff' : 'rgba(0,204,255,0.8)';
            (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = isDark ? '0 0 30px rgba(0,204,255,0.6)' : '0 0 30px rgba(0,204,255,0.8)';
            (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(0.96)';
          }}
          onMouseUp={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
          }}
        >
          {t.cta}
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
      </div>

      <div style={{ 
        width: '100%', 
        maxWidth: 1600, 
        borderTop: `1px solid ${border}`, 
        paddingTop: 40,
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '8px' : '0',
        alignItems: 'center',
        transition: 'background 0.3s ease, color 0.3s ease',
      }}>
        <div style={{ 
          fontFamily: "'EB Garamond', serif", 
          letterSpacing: '.18em', 
          fontSize: 10, 
          fontWeight: 700, 
          color: muted,
          transition: 'background 0.3s ease, color 0.3s ease',
        }}>
          KLARSTONE
        </div>
        <div style={{ 
          fontFamily: "'Inter', sans-serif", 
          fontSize: 11, 
          color: muted,
          letterSpacing: '0.02em',
          textAlign: isMobile ? 'center' : 'right',
          whiteSpace: isMobile ? 'nowrap' : 'normal',
          transition: 'background 0.3s ease, color 0.3s ease',
        }}>
          {t.copyright}
        </div>
      </div>
    </footer>
  );
}
