import React, { useEffect, useRef, useState } from 'react';
import { initHeroScene } from './heroScene';

export default function AntigravityHero() {
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
        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'rgba(255,255,255,.45)',letterSpacing:'.3em' }}>CRAB.AI / INITIALIZING</div>
        <div style={{ width:160,height:1,background:'rgba(255,255,255,.1)',position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',inset:0,width:'40%',background:'#fff',animation:'load 1.2s ease-in-out infinite',boxShadow:'0 0 12px rgba(255,255,255,.4)' }} />
        </div>
      </div>

      {/* Nav */}
      <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:40,height:64,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 32px',transition:'backdrop-filter .3s ease,background .3s ease,border-color .3s ease',borderBottom:`1px solid ${scrolled?'rgba(255,255,255,0.08)':'transparent'}`,backdropFilter:scrolled?'blur(14px)':'none',background:scrolled?'rgba(10,10,10,.78)':'transparent' }}>
        <div style={{ display:'flex',alignItems:'center',gap:10,fontFamily:'Orbitron',letterSpacing:'.18em',fontSize:13,fontWeight:700,color:'#e6e6e6' }}>
          <span style={{ width:22,height:22,border:'1.5px solid #e6e6e6',borderRadius:6,display:'inline-flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 10px rgba(255,255,255,.18)',position:'relative' }}>
            <span style={{ width:8,height:8,background:'#e6e6e6',borderRadius:2,transform:'rotate(45deg)',boxShadow:'0 0 6px rgba(255,255,255,.35)',display:'block' }} />
          </span>
          CRAB.AI
        </div>
        <div style={{ display:'flex',gap:28,alignItems:'center',fontSize:13,color:'rgba(255,255,255,0.55)' }}>
          {['Method','Pricing','Customers','Login'].map(l => <a key={l} href="#" style={{ color:'inherit',textDecoration:'none' }}>{l}</a>)}
          <a href="#" style={{ display:'inline-flex',alignItems:'center',gap:8,background:'#fff',color:'#0A0A0A',padding:'9px 16px',borderRadius:8,fontWeight:700,fontSize:13,textDecoration:'none' }}>
            Start free audit
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
      </nav>

      {/* Scene */}
      <div style={{ position:'fixed',inset:0,zIndex:0,background:'radial-gradient(80% 60% at 50% 50%, #1a1a1a 0%, #0a0a0a 60%, #000 100%)',pointerEvents:'none' }} />
      <div style={{ position:'fixed',inset:0,zIndex:1,pointerEvents:'none' }}>
        <canvas ref={canvasRef} style={{ position:'absolute',inset:0,width:'100%',height:'100%' }} />
        {/* Vignette */}
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.95) 100%), linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.8) 100%)' }} />
        {/* Grain */}
        <div style={{ position:'absolute',inset:0,opacity:.07,mixBlendMode:'overlay',backgroundImage:"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />
      </div>

      {/* HUD */}
      {['tl','tr','bl','br'].map(pos => (
        <div key={pos} style={{ position:'fixed',zIndex:20,color:'rgba(255,255,255,.55)',fontFamily:"'JetBrains Mono',monospace",fontSize:11,letterSpacing:'.06em',pointerEvents:'none',opacity:revealed?1:0,transition:'opacity 1.2s ease 1.2s',...(pos==='tl'?{top:96,left:32}:pos==='tr'?{top:96,right:32,textAlign:'right' as const}:pos==='bl'?{bottom:32,left:32}:{bottom:32,right:32,textAlign:'right' as const}) }}>
          {pos==='tl'&&<><div style={{display:'flex',alignItems:'center',gap:8}}><span style={{width:6,height:6,background:'#fff',borderRadius:'50%',display:'inline-block',animation:'blink 1.6s ease-in-out infinite',boxShadow:'0 0 6px rgba(255,255,255,.7)'}}/><span>NEURAL CORE ONLINE</span></div><div style={{marginTop:6}}><span style={{color:'rgba(255,255,255,.32)'}}>SECTOR</span>&nbsp; SMB · EU</div><div><span style={{color:'rgba(255,255,255,.32)'}}>MODEL</span>&nbsp; CRAB-04</div></>}
          {pos==='tr'&&<><div><span style={{color:'rgba(255,255,255,.32)'}}>NODES</span>&nbsp; 360</div><div><span style={{color:'rgba(255,255,255,.32)'}}>UPTIME</span>&nbsp; 99.982%</div></>}
          {pos==='bl'&&<><div><span style={{color:'rgba(255,255,255,.32)'}}>LEAKS DETECTED</span>&nbsp; 7</div><div><span style={{color:'rgba(255,255,255,.32)'}}>RECOVERED</span>&nbsp; €24K</div></>}
          {pos==='br'&&<><div>v4.2.0 / build 2026.04</div></>}
        </div>
      ))}

      {/* Hero stage */}
      <section style={{ position:'relative',height:'100vh',width:'100%',overflow:'hidden',background:'transparent' }}>
        <div style={{ position:'absolute',inset:0,zIndex:10,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'0 32px',pointerEvents:'none' }}>
          <div style={{ maxWidth:980,width:'100%',textAlign:'center',pointerEvents:'auto',opacity:revealed?1:0,transform:revealed?'none':'translateY(16px)',transition:'opacity 1s ease, transform 1s ease' }}>
            <span style={{ display:'inline-flex',alignItems:'center',gap:10,border:'1px solid rgba(255,255,255,0.16)',borderRadius:999,padding:'7px 14px',fontSize:11,letterSpacing:'.18em',textTransform:'uppercase' as const,color:'#e6e6e6',background:'rgba(255,255,255,.04)',fontWeight:500 }}>
              <span style={{ width:6,height:6,borderRadius:'50%',background:'#fff',animation:'pulse 2.4s ease-in-out infinite',display:'inline-block' }} />
              AI-Powered Business Advisor
            </span>
            <h1 style={{ fontFamily:'Orbitron',fontWeight:700,fontSize:'clamp(48px, 7.6vw, 112px)',lineHeight:.98,letterSpacing:'-.02em',margin:'28px 0 22px',color:'#fff' }}>
              <span className="row" style={{ display:'block',overflow:'hidden' }}><span>Your business</span></span>
              <span className="row delay" style={{ display:'block',overflow:'hidden' }}><span>has <span style={{ color:'rgba(255,255,255,.45)' }}>leaks.</span></span></span>
              <span className="row delay-2" style={{ display:'block',overflow:'hidden' }}><span>We <span style={{ fontFamily:'Inter',fontWeight:300,color:'rgba(255,255,255,.5)' }}>/</span> find them.</span></span>
            </h1>
            <p style={{ maxWidth:640,margin:'0 auto',color:'rgba(255,255,255,0.55)',fontSize:18,lineHeight:1.55 }}>
              A consultant-grade audit of your finances, costs, and growth levers — delivered in 60 seconds. Diagnose what's draining margin, prioritize by impact, fix it fast.
            </p>
            <div style={{ display:'flex',gap:14,justifyContent:'center',alignItems:'center',marginTop:36,flexWrap:'wrap' as const }}>
              <a href="#" style={{ display:'inline-flex',alignItems:'center',gap:10,borderRadius:10,padding:'14px 22px',fontWeight:600,fontSize:15,textDecoration:'none',background:'#fff',color:'#0A0A0A',boxShadow:'0 6px 32px rgba(255,255,255,.18)',border:'1px solid transparent' }}>
                Start free audit
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </a>
              <a href="#" style={{ display:'inline-flex',alignItems:'center',gap:10,borderRadius:10,padding:'14px 22px',fontWeight:600,fontSize:15,textDecoration:'none',background:'transparent',color:'#e6e6e6',border:'1px solid rgba(255,255,255,0.16)' }}>
                Watch the demo · 90s
              </a>
            </div>
            <div style={{ display:'flex',gap:18,justifyContent:'center',color:'rgba(255,255,255,0.32)',fontSize:12,letterSpacing:'.04em',marginTop:18,fontFamily:"'JetBrains Mono',monospace" }}>
              <span>NO CREDIT CARD</span><span style={{ opacity:.5 }}>·</span><span>6-QUESTION QUIZ</span><span style={{ opacity:.5 }}>·</span><span>RESULTS IN 60s</span>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position:'absolute',bottom:36,left:'50%',transform:'translateX(-50%)',zIndex:20,display:'flex',flexDirection:'column',alignItems:'center',gap:10,color:'rgba(255,255,255,0.32)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'.18em',textTransform:'uppercase' as const,opacity:revealed?1:0,transition:'opacity 1s ease 1.6s',pointerEvents:'none' }}>
          <span>SCROLL</span>
          <span className="scroll-line" style={{ width:1,height:38,background:'linear-gradient(180deg, rgba(255,255,255,.55), transparent)',position:'relative',overflow:'hidden',display:'block' }} />
        </div>
      </section>

      {/* Scroll story */}
      <div style={{ position:'relative',zIndex:8 }}>
        {[
          { n:'01', label:'Impact', align:'center', title:<>The signal <span style={{color:'rgba(255,255,255,.4)'}}>arrives.</span></>, body:'A single thread becomes a network. Every business is a system of connected decisions — we map the ones quietly costing you margin.' },
          { n:'02', label:'What we are', align:'left', title:<>An AI advisor that <span style={{color:'rgba(255,255,255,.4)'}}>finds the leaks.</span></>, body:'CRAB.AI is a consultant-grade audit engine for SMBs. It reads your finances, costs, and growth signals, and surfaces the few moves that actually move margin.' },
          { n:'03', label:'How we operate', align:'right', title:<>Connect. Diagnose. <span style={{color:'rgba(255,255,255,.4)'}}>Fix.</span></>, body:'Three steps. Sixty seconds. A prioritized plan you can hand to your team Monday morning.' },
          { n:'04', label:'What we find', align:'left', title:<>Money <span style={{color:'rgba(255,255,255,.4)'}}>hiding</span> in plain sight.</>, body:'The same patterns surface across thousands of audits. Most operators are leaking from two or three of these at once.' },
          { n:'05', label:'Proof', align:'center', title:<>2,400 audits. <span style={{color:'rgba(255,255,255,.4)'}}>€41M recovered.</span></>, body:'Operators across 14 countries use CRAB.AI to find what their P&L is hiding.' },
        ].map((sec, idx) => (
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

