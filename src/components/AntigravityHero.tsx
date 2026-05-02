import React, { useEffect, useRef, useState } from 'react';
import { initHeroScene } from './heroScene';

const DICT = {
  EN: {
    nav: ['Home', 'About Us', 'Contact Us', 'Login'],
    bookBtn: 'Book a Consultation',
    splash: 'KLARSTONE / INITIALIZING',
    heroOverline: 'Future Conversation Solutions',
    heroTitle: <>Your 24/7 AI<br />Micro-Consultant<br />for Business Clarity</>,
    scroll: [
      { n:'01', label:'Impact', align:'center' as const, title:<>The signal <span style={{color:'rgba(255,255,255,.4)'}}>arrives.</span></>, body:'A single thread becomes a network. Every business is a system of connected decisions — we map the ones quietly costing you margin.' },
      { n:'02', label:'What we are', align:'left' as const, title:<>An AI advisor that <span style={{color:'rgba(255,255,255,.4)'}}>finds the leaks.</span></>, body:'KLARSTONE is a consultant-grade audit engine for SMBs. It reads your finances, costs, and growth signals, and surfaces the few moves that actually move margin.' },
      { n:'03', label:'How we operate', align:'right' as const, title:<>Connect. Diagnose. <span style={{color:'rgba(255,255,255,.4)'}}>Fix.</span></>, body:'Three steps. Sixty seconds. A prioritized plan you can hand to your team Monday morning.' },
      { n:'04', label:'What we find', align:'left' as const, title:<>Money <span style={{color:'rgba(255,255,255,.4)'}}>hiding</span> in plain sight.</>, body:'The same patterns surface across thousands of audits. Most operators are leaking from two or three of these at once.' },
      { n:'05', label:'Proof', align:'center' as const, title:<>2,400 audits. <span style={{color:'rgba(255,255,255,.4)'}}>€41M recovered.</span></>, body:'Operators across 14 countries use KLARSTONE to find what their P&L is hiding.' },
    ]
  },
  DE: {
    nav: ['Startseite', 'Über uns', 'Kontakt', 'Login'],
    bookBtn: 'Beratung buchen',
    splash: 'KLARSTONE / INITIALISIERT',
    heroOverline: 'Zukünftige Konversationslösungen',
    heroTitle: <>Ihr 24/7 KI<br />Mikro-Berater<br />für geschäftliche Klarheit</>,
    scroll: [
      { n:'01', label:'Einfluss', align:'center' as const, title:<>Das Signal <span style={{color:'rgba(255,255,255,.4)'}}>kommt an.</span></>, body:'Ein einzelner Faden wird zu einem Netzwerk. Jedes Unternehmen ist ein System verbundener Entscheidungen — wir kartieren diejenigen, die Sie stillschweigend Marge kosten.' },
      { n:'02', label:'Was wir sind', align:'left' as const, title:<>Ein KI-Berater, der <span style={{color:'rgba(255,255,255,.4)'}}>die Lecks findet.</span></>, body:'KLARSTONE ist eine Audit-Engine auf Beraterniveau für KMUs. Sie liest Ihre Finanzen, Kosten und Wachstumssignale und deckt die wenigen Schritte auf, die tatsächlich Marge bewegen.' },
      { n:'03', label:'Wie wir arbeiten', align:'right' as const, title:<>Verbinden. Diagnostizieren. <span style={{color:'rgba(255,255,255,.4)'}}>Beheben.</span></>, body:'Drei Schritte. Sechzig Sekunden. Ein priorisierter Plan, den Sie Ihrem Team am Montagmorgen übergeben können.' },
      { n:'04', label:'Was wir finden', align:'left' as const, title:<>Geld, das sich in aller <span style={{color:'rgba(255,255,255,.4)'}}>Öffentlichkeit versteckt.</span></>, body:'Dieselben Muster tauchen bei Tausenden von Audits auf. Die meisten Betreiber verlieren durch zwei oder drei davon gleichzeitig Marge.' },
      { n:'05', label:'Beweis', align:'center' as const, title:<>2.400 Audits. <span style={{color:'rgba(255,255,255,.4)'}}>41 Mio. € zurückgewonnen.</span></>, body:'Betreiber aus 14 Ländern nutzen KLARSTONE, um zu finden, was ihre GuV verbirgt.' },
    ]
  }
};

export default function AntigravityHero() {
  const [lang, setLang] = useState<'EN'|'DE'>('EN');
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
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @import url('https://fonts.cdnfonts.com/css/helvetica-lt-pro');
        @import url('https://fonts.cdnfonts.com/css/tachyon');
        :root{--bg:#0A0A0A;--fg:#fff;--muted:rgba(255,255,255,0.55);--dim:rgba(255,255,255,0.32);--line:rgba(255,255,255,0.08);--line-2:rgba(255,255,255,0.16)}
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{background:var(--bg);color:var(--fg);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        ::-webkit-scrollbar{width:6px;background:#000}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:4px}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,.6)}50%{box-shadow:0 0 0 6px rgba(255,255,255,0)}}
        @keyframes rise{to{transform:translateY(0)}}
        @keyframes blink{0%,60%,100%{opacity:1}30%{opacity:.2}}
        @keyframes scroll-cue{0%{transform:translateY(0);opacity:0}30%{opacity:1}100%{transform:translateY(46px);opacity:0}}
        @keyframes load{0%{transform:translateX(-100%)}100%{transform:translateX(280%)}}
        .row span{display:inline-block;transform:translateY(110%);animation:rise .9s cubic-bezier(.16,1,.3,1) forwards}
        .row.delay span{animation-delay:.12s}.row.delay-2 span{animation-delay:.24s}
        .scene-section .inner{opacity:0;transform:translateY(28px);transition:opacity .8s ease,transform .8s ease}
        .scene-section.in .inner{opacity:1;transform:none}
        .scroll-line::after{content:"";position:absolute;top:-12px;left:0;width:1px;height:14px;background:#fff;animation:scroll-cue 2s ease-in-out infinite}
      `}</style>

      {/* Splash */}
      <div id="splash" style={{ position:'fixed',inset:0,zIndex:200,background:'#0A0A0A',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:18,transition:'opacity .8s ease',pointerEvents:'none' }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'rgba(255,255,255,.45)',letterSpacing:'.3em' }}>{t.splash}</div>
        <div style={{ width:160,height:1,background:'rgba(255,255,255,.1)',position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',inset:0,width:'40%',background:'#fff',animation:'load 1.2s ease-in-out infinite',boxShadow:'0 0 12px rgba(255,255,255,.4)' }} />
        </div>
      </div>

      {/* Nav */}
      <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:40,height:64,display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',padding:'0 32px',transition:'backdrop-filter .3s ease,background .3s ease,border-color .3s ease',borderBottom:`1px solid ${scrolled?'rgba(255,255,255,0.08)':'transparent'}`,backdropFilter:scrolled?'blur(14px)':'none',background:scrolled?'rgba(10,10,10,.78)':'transparent' }}>
        {/* Left: Brand */}
        <div style={{ fontFamily:'Orbitron',letterSpacing:'.18em',fontSize:13,fontWeight:700,color:'#e6e6e6' }}>
          KLARSTONE
        </div>
        
        {/* Center: Main Links */}
        <div style={{ display:'flex',gap:36,alignItems:'center',fontSize:13,color:'rgba(255,255,255,0.55)' }}>
          {t.nav.slice(0,3).map(l => <a key={l} href="#" style={{ color:'inherit',textDecoration:'none' }}>{l}</a>)}
        </div>

        {/* Right: Lang & Login */}
        <div style={{ display:'flex',gap:24,alignItems:'center',justifyContent:'flex-end',fontSize:13,color:'rgba(255,255,255,0.55)' }}>
          <div style={{ display:'flex', gap:6, alignItems:'center', background:'rgba(255,255,255,0.05)', padding:'4px 8px', borderRadius:20 }}>
            <span onClick={()=>setLang('EN')} style={{ cursor:'pointer', color:lang==='EN'?'#fff':'inherit', fontWeight:lang==='EN'?700:400, transition:'color .2s' }}>EN</span>
            <span>/</span>
            <span onClick={()=>setLang('DE')} style={{ cursor:'pointer', color:lang==='DE'?'#fff':'inherit', fontWeight:lang==='DE'?700:400, transition:'color .2s' }}>DE</span>
          </div>
          <a href="#" style={{ color:'inherit',textDecoration:'none' }}>{t.nav[3]}</a>
        </div>
      </nav>

      {/* Scene */}
      <div style={{ position:'fixed',inset:0,zIndex:0,background:'radial-gradient(80% 60% at 50% 50%, #1a1a1a 0%, #0a0a0a 60%, #000 100%)',pointerEvents:'none' }} />
      <div style={{ position:'fixed',inset:0,zIndex:1,pointerEvents:'none',opacity:scrolled?0:1,transition:'opacity 0.8s ease' }}>
        <canvas ref={canvasRef} style={{ position:'absolute',inset:0,width:'100%',height:'100%' }} />
        {/* Vignette */}
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.95) 100%), linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.8) 100%)' }} />
        {/* Grain */}
        <div style={{ position:'absolute',inset:0,opacity:.07,mixBlendMode:'overlay',backgroundImage:"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />
      </div>

      {/* HUD removed */}

      {/* Hero stage */}
      <section style={{ position:'relative',height:'100vh',width:'100%',overflow:'hidden',background:'transparent',display:'flex',alignItems:'center',paddingLeft:'8vw',pointerEvents:'none' }}>
        <div style={{ maxWidth: 840, pointerEvents:'auto', opacity: revealed && !scrolled ? 1 : 0, transition:'opacity 0.8s ease', zIndex:10 }}>
          <div style={{ color:'#66b2b2', fontSize:14, letterSpacing:'0.02em', marginBottom:16, fontFamily:'Inter, sans-serif' }}>
            {t.heroOverline}
          </div>
          <h1 style={{ fontFamily:"'Tachyon', 'Tachyon Regular', sans-serif", fontWeight:400, fontSize:'clamp(48px, 6vw, 92px)', lineHeight:1.05, color:'#fff', letterSpacing:'-0.03em', marginBottom: 40 }}>
            {t.heroTitle}
          </h1>
          <a href="#" style={{ display:'inline-flex',alignItems:'center',gap:12,background:'#fff',color:'#0A0A0A',padding:'14px 24px',borderRadius:8,fontWeight:700,fontSize:14,textDecoration:'none' }}>
            {t.bookBtn}
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
      </section>

      {/* Scroll story */}
      <div style={{ position:'relative',zIndex:8 }}>
        {t.scroll.map((sec, idx) => (
          <ScrollSection key={idx} {...sec} />
        ))}
      </div>

      {/* Trust strip */}
      <div style={{ position:'relative',zIndex:5,borderTop:'1px solid rgba(255,255,255,0.08)',padding:'20px 32px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:24,background:'linear-gradient(180deg, transparent, rgba(255,255,255,.02))',fontSize:12,color:'rgba(255,255,255,0.55)' }}>
        <div style={{ color:'rgba(255,255,255,0.32)',textTransform:'uppercase' as const,letterSpacing:'.18em',fontSize:10,fontFamily:"'JetBrains Mono',monospace" }}>Trusted by operators across</div>
        <div style={{ display:'flex',gap:36,alignItems:'center',color:'rgba(255,255,255,.45)',fontFamily:'Orbitron',fontWeight:600,letterSpacing:'.1em',fontSize:13 }}>
          {['ACME','GLOBEX','SOYUZ','INITECH','UMBRELLA'].map(l => <span key={l}>{l}</span>)}
        </div>
        <div style={{ color:'rgba(255,255,255,0.32)',textTransform:'uppercase' as const,letterSpacing:'.18em',fontSize:10,fontFamily:"'JetBrains Mono',monospace" }}>2,400+ audits delivered</div>
      </div>
    </>
  );
}

function ScrollSection({ n, label, align, title, body }: { n:string; label:string; align:string; title:React.ReactNode; body:string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const justify = (align==='left'?'flex-start':align==='right'?'flex-end':'center') as React.CSSProperties['justifyContent'];
  const marginStyle = align==='left'?{ marginLeft:'max(64px, 6vw)' }:align==='right'?{ marginRight:'max(64px, 6vw)' }:{};

  return (
    <div ref={ref} className={`scene-section${inView?' in':''}`} style={{ position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',padding:'0 32px',justifyContent:justify,pointerEvents:'none' }}>
      <div className="inner" style={{ maxWidth:align==='center'?780:560,pointerEvents:'auto',...marginStyle,textAlign:align==='center'?'center' as const:undefined }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'rgba(255,255,255,.45)',letterSpacing:'.24em',textTransform:'uppercase' as const,marginBottom:18,display:'flex',alignItems:'center',gap:10,justifyContent:align==='center'?'center':'flex-start' }}>
          <span style={{ display:'inline-flex',width:34,height:22,border:'1px solid rgba(255,255,255,.18)',borderRadius:4,alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff' }}>{n}</span>
          {label}
        </div>
        <h2 style={{ fontFamily:'Orbitron',fontWeight:700,fontSize:'clamp(36px,5.4vw,72px)',lineHeight:1.04,letterSpacing:'-.02em',color:'#fff',marginBottom:22 }}>{title}</h2>
        <p style={{ fontSize:17,lineHeight:1.55,color:'rgba(255,255,255,.62)' }}>{body}</p>
        {n==='03' && (
          <div style={{ display:'grid',gap:12,marginTop:30 }}>
            {[['01','Connect','Stripe, Xero, Shopify, ad accounts. Read-only.'],['02','Diagnose','Cross-reference 40+ leak signatures across pricing, churn, costs, ops.'],['03','Fix','Ranked actions with expected impact. Not a dashboard — a plan.']].map(([k,t,d])=>(
              <div key={k} style={{ border:'1px solid rgba(255,255,255,.1)',borderRadius:12,padding:'16px 18px',background:'rgba(10,10,10,.55)',backdropFilter:'blur(8px)',display:'grid',gridTemplateColumns:'auto 1fr',gap:14,alignItems:'center' }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'rgba(255,255,255,.5)',letterSpacing:'.2em' }}>{k}</div>
                <div><div style={{ fontFamily:'Orbitron',fontSize:15,color:'#fff',letterSpacing:'.02em' }}>{t}</div><div style={{ fontSize:12,color:'rgba(255,255,255,.55)',lineHeight:1.5,marginTop:4 }}>{d}</div></div>
              </div>
            ))}
          </div>
        )}
        {n==='04' && (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10,marginTop:28 }}>
            {[['Pricing drift','+8.4%'],['Silent churn','+12%'],['Vendor sprawl','€3.1k/mo'],['Ad waste','31%'],['Refund leakage','+2.1%'],['Stale SKUs','€6.4k']].map(([label,val])=>(
              <div key={label} style={{ border:'1px solid rgba(255,255,255,.1)',borderRadius:10,padding:'12px 14px',background:'rgba(10,10,10,.55)',backdropFilter:'blur(8px)',fontSize:12,display:'flex',justifyContent:'space-between',alignItems:'center',color:'rgba(255,255,255,.7)',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.02em' }}>
                <span>{label}</span><span style={{ color:'#fff',fontWeight:600 }}>{val}</span>
              </div>
            ))}
          </div>
        )}
        {n==='05' && (
          <>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:32,margin:'32px auto 0' }}>
              {[['2,400','Audits'],['€41M','Recovered'],['99.98%','Uptime']].map(([num,lbl])=>(
                <div key={lbl} style={{ textAlign:'center' as const }}>
                  <div style={{ fontFamily:'Orbitron',fontSize:'clamp(40px,5vw,68px)',color:'#fff',fontWeight:700,letterSpacing:'-.02em',lineHeight:1 }}>{num}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'rgba(255,255,255,.45)',letterSpacing:'.2em',textTransform:'uppercase' as const,marginTop:8 }}>{lbl}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex',gap:14,justifyContent:'center',alignItems:'center',marginTop:42,flexWrap:'wrap' as const }}>
              <a href="#" style={{ display:'inline-flex',alignItems:'center',gap:10,borderRadius:10,padding:'14px 22px',fontWeight:600,fontSize:15,textDecoration:'none',background:'#fff',color:'#0A0A0A',border:'1px solid transparent' }}>
                Start free audit
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </a>
              <a href="#" style={{ display:'inline-flex',alignItems:'center',gap:10,borderRadius:10,padding:'14px 22px',fontWeight:600,fontSize:15,textDecoration:'none',background:'transparent',color:'#e6e6e6',border:'1px solid rgba(255,255,255,0.16)' }}>Talk to a human</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

