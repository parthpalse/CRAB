import React, { useEffect, useRef, useState } from 'react';
import { initHeroScene } from './heroScene';
import MagicBento from './MagicBento';
import DarkVeil from './DarkVeil';
import HowItWorks from './HowItWorks';
import ContactUs from './ContactUs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScale, scaled } from '../hooks/useScale';

gsap.registerPlugin(ScrollTrigger);

const DICT = {
  EN: {
    nav: ['Home', 'About Us', 'Contact Us', 'Login'],
    bookBtn: 'Start Consultation',
    splash: 'KLARSTONE / INITIALIZING',
    heroOverline: <>DECISION INTELLIGENCE<br />FOR MODERN BUSINESS</>,
    heroTitle: <>KLARSTONE</>,
  },
  DE: {
    nav: ['Startseite', 'Über uns', 'Kontakt', 'Login'],
    bookBtn: 'Beratung starten',
    splash: 'KLARSTONE / INITIALISIERT',
    heroOverline: <>ENTSCHEIDUNGSINTELLIGENZ<br />FÜR MODERNE UNTERNEHMEN</>,
    heroTitle: <>KLARSTONE</>,
  }
};

export default function AntigravityHero() {
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
  const t = DICT[lang];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const scale = useScale();

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
    // Safety fallback: reveal after 2s if scene initialization hangs
    const timer = setTimeout(() => setRevealed(true), 2500);
    return () => { cleanup(); clearTimeout(timer); };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        :root{--bg:#0A0A0A;--fg:#fff;--muted:rgba(255,255,255,0.55);--dim:rgba(255,255,255,0.32);--line:rgba(255,255,255,0.08);--line-2:rgba(255,255,255,0.16)}
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{background:var(--bg);color:var(--fg);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        ::-webkit-scrollbar{width:6px;background:#000}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:4px}
        @keyframes load{0%{transform:translateX(-100%)}100%{transform:translateX(280%)}}
      `}</style>

      <div id="splash" style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18, transition: 'opacity .8s ease', pointerEvents: 'none', opacity: revealed ? 0 : 1 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.45)', letterSpacing: '.3em' }}>{t.splash}</div>
        <div style={{ width: 160, height: 1, background: 'rgba(255,255,255,.1)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, width: '40%', background: '#fff', animation: 'load 1.2s ease-in-out infinite', boxShadow: '0 0 12px rgba(255,255,255,.4)' }} />
        </div>
      </div>

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, height: 64, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 2vw', transform: hideNav ? 'translateY(-100%)' : 'translateY(0)', transition: 'transform 0.4s ease, backdrop-filter .3s ease, background .3s ease, border-color .3s ease', borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'}`, backdropFilter: scrolled ? 'blur(14px)' : 'none', background: scrolled ? 'rgba(10,10,10,.78)' : 'transparent' }}>
        <div style={{ fontFamily: 'Orbitron', letterSpacing: '.18em', fontSize: 10, fontWeight: 700, color: '#e6e6e6', display: 'flex', alignItems: 'baseline' }}>KLARSTONE</div>
        <div style={{ display: 'flex', gap: '48px', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif', fontWeight: 300, letterSpacing: '0.03em' }}>
          <a href="#home" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>{t.nav[0]}</a>
          <a href="#about" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>{t.nav[1]}</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>{t.nav[2]}</a>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'flex-end', fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>{t.nav[3]}</a>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, letterSpacing: '0.05em' }}>
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

      <section id="home" style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', background: 'transparent', display: 'flex', alignItems: 'center', paddingLeft: scaled(109, scale), pointerEvents: 'none' }}>
        <div style={{ maxWidth: 1400, pointerEvents: 'auto', opacity: revealed && !scrolled ? 1 : 0, transition: 'opacity 0.8s ease', zIndex: 10 }}>
          <div style={{ 
            fontFamily: "'Satoshi', sans-serif", 
            fontWeight: 500, 
            fontSize: scaled(22, scale), 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            color: 'rgba(0,204,255,0.9)', 
            marginBottom: 20 
          }}>{t.heroTitle}</div>
          <h1 style={{ 
            color: '#fff', 
            fontSize: 'clamp(36px, 4.8vw, 66px)', 
            letterSpacing: '-0.03em', 
            marginBottom: 32, 
            fontFamily: "'JetBrains Mono', monospace", 
            fontWeight: 500, 
            lineHeight: 1.05, 
            textWrap: 'balance' as any 
          }}>{t.heroOverline}</h1>
          <a
            href="#"
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

      <WhatWeDo />
      <HowItWorks />
      <KeyBenefits />

      <div style={{ position: 'relative', zIndex: 8, width: '100%', padding: '80px 0 120px', background: '#0A0A0A' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <DarkVeil
            scanlineIntensity={0.47}
            speed={1.5}
            scanlineFrequency={4.5}
            warpAmount={1.7}
          />
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <MagicBento
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

      <ContactUs />
      <Footer />
    </>
  );
}

function WhatWeDo() {
  const scale = useScale();
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
        padding: `${scaled(120, scale)} ${scaled(109, scale)}`,
      }}
    >
      <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        <div ref={labelRef} style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 400,
          fontSize: '11px',
          color: 'rgba(0,204,255,0.6)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase' as const,
          marginBottom: 20,
        }}>
          What We Do
        </div>
        <h2 ref={headRef} style={{
          fontFamily: "'Satoshi', sans-serif",
          fontWeight: 550,
          fontSize: scaled(51, scale),
          color: '#fff',
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          textTransform: 'uppercase' as const,
          marginBottom: 32,
          overflowWrap: 'break-word' as const,
        }}>
          AI-powered consulting for growing businesses
        </h2>
        <p ref={p1Ref} style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: scaled(16, scale),
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.8,
          maxWidth: '700px',
          marginBottom: 16,
        }}>
          KLARSTONE acts as a micro-consultant for your company. It works with your business data, asks smart follow-up questions, and gives clear recommendations on what to do next.
        </p>
        <p ref={p2Ref} style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: scaled(16, scale),
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.8,
          maxWidth: '700px',
        }}>
          It helps you move from scattered data and uncertainty to structured insights and action.
        </p>
      </div>
    </section>
  );
}

function KeyBenefits() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [labelRef.current, headRef.current, listRef.current];
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

  const benefits = [
    '24/7 AI micro-consultant',
    'Data-backed business recommendations',
    'Smart follow-up questions for better context',
    'Interactive dashboards',
    'Downloadable consulting reports',
    'Built for fast, practical decision-making'
  ];

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        zIndex: 8,
        background: '#0A0A0A',
        width: '100%',
        padding: '120px 8vw',
      }}
    >
      <div style={{ width: '100%' }}>
        <div ref={labelRef} style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 400,
          fontSize: '11px',
          color: 'rgba(0,204,255,0.6)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase' as const,
          marginBottom: 20,
        }}>
          Key Benefits
        </div>
        <h2 ref={headRef} style={{
          fontFamily: "'Satoshi', sans-serif",
          fontWeight: 550,
          fontSize: 'clamp(32px, 4.5vw, 60px)',
          color: '#fff',
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          textTransform: 'uppercase' as const,
          marginBottom: 80,
        }}>
          Consulting intelligence, delivered instantly
        </h2>
        
        <div ref={listRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 'clamp(24px, 3vw, 48px) clamp(32px, 5vw, 100px)' }}>
          {benefits.map((benefit, i) => (
            <div key={i} style={{ 
              borderLeft: '2px solid rgba(0,204,255,0.3)', 
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
}function Footer() {
  return (
    <footer style={{ 
      position: 'relative', 
      width: '100%', 
      background: '#0A0A0A', 
      zIndex: 10, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'flex-start', 
      padding: '120px 8vw 60px'
    }}>
      <div style={{ textAlign: 'left', marginBottom: 80, width: '100%' }}>
        <h2 style={{ 
          fontFamily: "'Satoshi', sans-serif", 
          fontWeight: 550, 
          fontSize: 'clamp(32px, 5vw, 68px)', 
          color: '#fff', 
          letterSpacing: '-0.02em', 
          lineHeight: 1.1, 
          marginBottom: 24
        }}>
          Turn business questions into clear action
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
          Ask. Understand. Get recommendations. Move forward with clarity.
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
            gap: 12,
            background: 'transparent',
            color: '#fff',
            padding: '20px',
            borderRadius: 8,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: '16px',
            textDecoration: 'none',
            border: '1px solid rgba(0,204,255,0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            letterSpacing: '0.02em',
            width: '100%'
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
          Get started
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
          fontFamily: 'Orbitron', 
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
          © 2024 KLARSTONE. Intelligence for modern business.
        </div>
      </div>
    </footer>
  );
}
