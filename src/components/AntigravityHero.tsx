import React, { useEffect, useRef, useState } from 'react';
import { initHeroScene } from './heroScene';
import MagicBento from './MagicBento';
import DarkVeil from './DarkVeil';
import HowItWorks from './HowItWorks';

const DICT = {
  EN: {
    nav: ['Home', 'About Us', 'Contact Us', 'Login'],
    bookBtn: 'Book a Consultation',
    splash: 'KLARSTONE / INITIALIZING',
    heroOverline: 'Your 24/7 AI Micro-Consultant for Business Clarity',
    heroTitle: 'KLARSTONE',
  },
  DE: {
    nav: ['Startseite', 'Über uns', 'Kontakt', 'Login'],
    bookBtn: 'Beratung buchen',
    splash: 'KLARSTONE / INITIALISIERT',
    heroOverline: 'Ihr 24/7 KI Mikro-Berater für geschäftliche Klarheit',
    heroTitle: 'KLARSTONE',
  }
};

export default function AntigravityHero() {
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
  const t = DICT[lang];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = initHeroScene(canvasRef.current, () => setRevealed(true));
    return cleanup;
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @import url('https://fonts.cdnfonts.com/css/helvetica-lt-pro');
        @import url('https://fonts.cdnfonts.com/css/tachyon');
        :root{--bg:#0A0A0A;--fg:#fff;--muted:rgba(255,255,255,0.55);--dim:rgba(255,255,255,0.32);--line:rgba(255,255,255,0.08);--line-2:rgba(255,255,255,0.16)}
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{background:var(--bg);color:var(--fg);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        ::-webkit-scrollbar{width:6px;background:#000}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:4px}
        @keyframes load{0%{transform:translateX(-100%)}100%{transform:translateX(280%)}}
      `}</style>

      <div id="splash" style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18, transition: 'opacity .8s ease', pointerEvents: 'none' }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.45)', letterSpacing: '.3em' }}>{t.splash}</div>
        <div style={{ width: 160, height: 1, background: 'rgba(255,255,255,.1)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, width: '40%', background: '#fff', animation: 'load 1.2s ease-in-out infinite', boxShadow: '0 0 12px rgba(255,255,255,.4)' }} />
        </div>
      </div>

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, height: 64, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 32px', transition: 'backdrop-filter .3s ease,background .3s ease,border-color .3s ease', borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'}`, backdropFilter: scrolled ? 'blur(14px)' : 'none', background: scrolled ? 'rgba(10,10,10,.78)' : 'transparent' }}>
        <div style={{ fontFamily: 'Orbitron', letterSpacing: '.18em', fontSize: 13, fontWeight: 700, color: '#e6e6e6' }}>KLARSTONE</div>
        <div style={{ display: 'flex', gap: 36, alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
          {t.nav.slice(0, 3).map(l => <a key={l} href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{l}</a>)}
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'flex-end', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 20 }}>
            <span onClick={() => setLang('EN')} style={{ cursor: 'pointer', color: lang === 'EN' ? '#fff' : 'inherit', fontWeight: lang === 'EN' ? 700 : 400, transition: 'color .2s' }}>EN</span>
            <span>/</span>
            <span onClick={() => setLang('DE')} style={{ cursor: 'pointer', color: lang === 'DE' ? '#fff' : 'inherit', fontWeight: lang === 'DE' ? 700 : 400, transition: 'color .2s' }}>DE</span>
          </div>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{t.nav[3]}</a>
        </div>
      </nav>

      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'radial-gradient(80% 60% at 50% 50%, #1a1a1a 0%, #0a0a0a 60%, #000 100%)', pointerEvents: 'none' }} />

      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: scrolled ? 0 : 1, transition: 'opacity 0.8s ease' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.95) 100%), linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.8) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: .07, mixBlendMode: 'overlay', backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />
      </div>

      <section style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', background: 'transparent', display: 'flex', alignItems: 'center', paddingLeft: '8vw', pointerEvents: 'none' }}>
        <div style={{ maxWidth: 840, pointerEvents: 'auto', opacity: revealed && !scrolled ? 1 : 0, transition: 'opacity 0.8s ease', zIndex: 10 }}>
          <h1 style={{ fontFamily: "'Tachyon', 'Tachyon Regular', sans-serif", fontWeight: 400, fontSize: 'clamp(48px, 6vw, 92px)', lineHeight: 1.05, color: '#fff', letterSpacing: '-0.03em', marginBottom: 16 }}>{t.heroTitle}</h1>
          <div style={{ color: '#66b2b2', fontSize: 20, letterSpacing: '0.02em', marginBottom: 40, fontFamily: 'Inter, sans-serif' }}>{t.heroOverline}</div>
          <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#fff', color: '#0A0A0A', padding: '14px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            {t.bookBtn}
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </div>
      </section>

      <HowItWorks />

      <div style={{ position: 'relative', zIndex: 8, width: '100%', padding: '80px 0 120px' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <DarkVeil
            hueShift={37}
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
    </>
  );
}
