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
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
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
    if (!canvasRef.current) return;
    const cleanup = initHeroScene(canvasRef.current, () => setRevealed(true));
    // Safety fallback: reveal after 2.5s if scene initialization hangs
    const timer = setTimeout(() => setRevealed(true), 2500);
    return () => { cleanup(); clearTimeout(timer); };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://use.typekit.net/jho4afd.css');
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        :root{--bg:#0A0A0A;--fg:#fff;--muted:rgba(255,255,255,0.55);--dim:rgba(255,255,255,0.32);--line:rgba(255,255,255,0.08);--line-2:rgba(255,255,255,0.16)}
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{background:var(--bg);color:var(--fg);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        ::-webkit-scrollbar{width:6px;background:#000}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:4px}
        @keyframes load{0%{transform:translateX(-100%)}100%{transform:translateX(280%)}}
      `}</style>

      {/* Splash Screen */}
      <div id="splash" style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18, transition: 'opacity .8s ease', pointerEvents: 'none', opacity: revealed ? 0 : 1 }}>
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
        height: 64, 
        display: 'grid', 
        gridTemplateColumns: isMobile ? 'auto auto auto' : isTablet ? 'auto 1fr auto' : '1fr auto 1fr', 
        columnGap: isMobile ? '8px' : '0px',
        alignItems: 'center', 
        padding: isMobile ? '0 8px' : isTablet ? '0 32px' : '0 2vw', 
        transform: hideNav ? 'translateY(-100%)' : 'translateY(0)', 
        transition: 'transform 0.4s ease, backdrop-filter .3s ease, background .3s ease, border-color .3s ease', 
        borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'}`, 
        backdropFilter: scrolled ? 'blur(14px)' : 'none', 
        background: scrolled ? 'rgba(10,10,10,.78)' : 'transparent' 
      }}>
        <div style={{ 
          fontFamily: "'EB Garamond', serif", 
          letterSpacing: isMobile ? '.12em' : '.18em', 
          fontSize: isMobile ? 8 : 10, 
          fontWeight: 400, 
          color: '#e6e6e6', 
          display: 'flex', 
          alignItems: 'baseline' 
        }}>
          KLARSTONE
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: isMobile ? '10px' : isTablet ? '24px' : '48px', 
          alignItems: 'center', 
          fontSize: isMobile ? 8 : isTablet ? 12 : 13, 
          color: 'rgba(255,255,255,0.5)', 
          fontFamily: 'Inter, sans-serif', 
          fontWeight: 300, 
          letterSpacing: '0.03em' 
        }}>

          <a href="#about" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>{t.nav[1]}</a>
          <a href="#services" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>{t.nav[2]}</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>{t.nav[3]}</a>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: isMobile ? 8 : isTablet ? 32 : 32, 
          alignItems: 'center', 
          justifyContent: 'flex-end', 
          fontSize: isMobile ? 8 : 13, 
          color: 'rgba(255,255,255,0.5)', 
          fontFamily: 'Inter, sans-serif', 
          fontWeight: 300 
        }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>{t.nav[4]}</a>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: isMobile ? 8 : 11, letterSpacing: '0.05em' }}>
            <span onClick={() => setLang('EN')} style={{ cursor: 'pointer', color: lang === 'EN' ? '#fff' : 'inherit', fontWeight: lang === 'EN' ? 500 : 300, transition: 'color .2s' }}>EN</span>
            <span style={{ opacity: 0.2 }}>|</span>
            <span onClick={() => setLang('DE')} style={{ cursor: 'pointer', color: lang === 'DE' ? '#fff' : 'inherit', fontWeight: lang === 'DE' ? 500 : 300, transition: 'color .2s' }}>DE</span>
          </div>
        </div>
      </nav>

      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'radial-gradient(80% 60% at 50% 50%, #1a1a1a 0%, #0a0a0a 60%, #000 100%)', pointerEvents: 'none' }} />

      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: scrolled ? 0 : 1, transition: 'opacity 0.25s ease' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.95) 100%), linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.8) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: .07, mixBlendMode: 'overlay', backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />
      </div>

      <section id="home" style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', background: 'transparent', display: 'flex', alignItems: 'center', padding: isMobile ? '0 24px' : `0 ${scaled(109, scale)}`, pointerEvents: 'none' }}>
        <div style={{ maxWidth: 1400, pointerEvents: 'auto', opacity: revealed && !scrolled ? 1 : 0, transition: 'opacity 0.8s ease', zIndex: 10, textAlign: 'left' }}>
          <div style={{ fontFamily: "'EB Garamond', serif", fontWeight: 400, fontSize: scaled(22, scale), textTransform: 'none', letterSpacing: '0.1em', color: 'rgba(0,204,255,0.9)', marginBottom: 20 }}>{t.heroTitle}</div>
          <h1 style={{ color: '#fff', fontSize: isMobile ? 'clamp(36px, 4.8vw, 66px)' : isTablet ? 'clamp(52px, 6vw, 80px)' : scaled(115, scale), letterSpacing: '-0.02em', marginBottom: 32, fontFamily: "'EB Garamond', serif", fontWeight: 400, lineHeight: 1.1, textWrap: 'balance' as any }}>{lang === 'EN' ? <>Decision intelligence<br />for modern business</> : <span style={{ fontSize: isMobile ? 'clamp(22px, 5.5vw, 36px)' : 'inherit' }}>Entscheidungsintelligenz<br />für moderne Unternehmen</span>}</h1>
          <a
            href="#contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'transparent',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: 8,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: scaled(14, scale),
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.25)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 20px rgba(0,204,255,0.5)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = '#00ccff';
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.25)';
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
            }}
            onMouseDown={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#00ccff';
              (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 30px rgba(0,204,255,0.6)';
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

      <WhatWeDo lang={lang} />
      <HowItWorks lang={lang} />
      <KeyBenefits lang={lang} />

      <div id="services" style={{ position: 'relative', zIndex: 8, width: '100%', padding: '80px 0 120px', background: '#0A0A0A', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
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

      <ContactUs lang={lang} />
      <Footer lang={lang} />
    </>
  );
}

function WhatWeDo({ lang }: { lang: 'EN' | 'DE' }) {
  const t = DICT[lang].whatWeDo;
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
        background: '#0A0A0A',
        width: '100%',
        padding: isMobile ? '60px 24px' : isTablet ? '80px 48px' : `${scaled(120, scale)} ${scaled(109, scale)}`,
      }}
    >
      <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        <div ref={labelRef} style={{
          fontFamily: "'EB Garamond', serif",
          fontWeight: 400,
          fontSize: '16px',
          color: 'rgba(0,204,255,0.6)',
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
          color: '#fff',
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          textTransform: 'none' as const,
          marginBottom: 32,
        }}>
          {t.title}
        </h2>
        <p ref={p1Ref} style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: isMobile ? '15px' : scaled(16, scale),
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.8,
          marginBottom: 16,
        }}>
          {t.p1}
        </p>
        <p ref={p2Ref} style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: isMobile ? '15px' : scaled(16, scale),
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.8,
        }}>
          {t.p2}
        </p>
      </div>
    </section>
  );
}

function KeyBenefits({ lang }: { lang: 'EN' | 'DE' }) {
  const t = DICT[lang].keyBenefits;
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
        background: '#0A0A0A',
        width: '100%',
        paddingTop: isMobile ? '60px' : isTablet ? '80px' : '120px',
        paddingBottom: isMobile ? '60px' : isTablet ? '80px' : '120px',
        paddingLeft: isMobile ? '24px' : isTablet ? '48px' : scaled(109, scale),
        paddingRight: isMobile ? '24px' : isTablet ? '48px' : scaled(109, scale),
        boxSizing: 'border-box' as const,
      }}
    >
      <div style={{ width: '100%' }}>
        <div ref={labelRef} style={{
          fontFamily: "'EB Garamond', serif",
          fontWeight: 400,
          fontSize: '16px',
          color: 'rgba(0,204,255,0.6)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase' as const,
          marginBottom: 20,
        }}>
          {t.label}
        </div>
        <h2 ref={headRef} style={{
          fontFamily: "'EB Garamond', serif",
          fontWeight: 600,
          fontSize: 'clamp(28px, 3.2vw, 52px)',
          color: '#fff',
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          textTransform: 'none' as const,
          marginBottom: 80,
          whiteSpace: isMobile ? 'normal' : isTablet ? 'normal' : 'nowrap',
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
              borderLeft: isMobile ? '2px solid rgba(0,204,255,0.6)' : '2px solid rgba(0,204,255,0.3)', 
              paddingLeft: 20,
              display: 'flex',
              alignItems: 'flex-start',
              minHeight: '60px'
            }}>
              <p style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontWeight: 300, 
                fontSize: 'clamp(14px, 1.2vw, 18px)', 
                color: 'rgba(255,255,255,0.7)', 
                lineHeight: 1.4 
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

function Footer({ lang }: { lang: 'EN' | 'DE' }) {
  const t = DICT[lang].footer;
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

  return (
    <footer style={{ 
      position: 'relative', 
      width: '100%', 
      background: '#0A0A0A', 
      zIndex: 10, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'stretch', 
      paddingTop: isMobile ? '80px' : isTablet ? '100px' : '120px',
      paddingBottom: '60px',
      paddingLeft: isMobile ? '24px' : isTablet ? '48px' : scaled(109, scale),
      paddingRight: isMobile ? '24px' : isTablet ? '48px' : scaled(109, scale),
      boxSizing: 'border-box' as const,
    }}>
      <div style={{ textAlign: 'left', marginBottom: 80, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h2 style={{ 
          fontFamily: "'EB Garamond', serif", 
          fontWeight: 600, 
          fontSize: isMobile ? 'clamp(24px, 6vw, 36px)' : isTablet ? 'clamp(28px, 4vw, 44px)' : 'clamp(28px, 3.5vw, 56px)', 
          color: '#fff', 
          letterSpacing: '-0.02em', 
          lineHeight: 1.1, 
          marginBottom: 24,
          whiteSpace: isMobile ? 'normal' : isTablet ? 'normal' : 'nowrap',
          textTransform: 'none' as const,
        }}>
          {t.title}
        </h2>
        <p style={{ 
          fontFamily: "'Inter', sans-serif", 
          fontWeight: 300, 
          fontSize: 'clamp(16px, 1.4vw, 22px)', 
          color: 'rgba(255,255,255,0.6)', 
          marginBottom: 48,
          lineHeight: 1.6,
          maxWidth: 700
        }}>
          {t.sub}
        </p>
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            background: 'transparent',
            color: '#fff',
            padding: '14px 28px',
            borderRadius: 8,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: '16px',
            textDecoration: 'none',
            border: '1px solid rgba(0,204,255,0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            letterSpacing: '0.02em',
            width: '100%',
            marginTop: 12,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 25px rgba(0,204,255,0.5)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = '#00ccff';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,204,255,0.3)';
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
          }}
          onMouseDown={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = '#00ccff';
            (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 30px rgba(0,204,255,0.6)';
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
        borderTop: '1px solid rgba(255,255,255,0.06)', 
        paddingTop: 40,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ 
          fontFamily: "'EB Garamond', serif", 
          letterSpacing: '.18em', 
          fontSize: 10, 
          fontWeight: 700, 
          color: 'rgba(255,255,255,0.4)' 
        }}>
          KLARSTONE
        </div>
        <div style={{ 
          fontFamily: "'Inter', sans-serif", 
          fontSize: 11, 
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.02em'
        }}>
          {t.copyright}
        </div>
      </div>
    </footer>
  );
}
