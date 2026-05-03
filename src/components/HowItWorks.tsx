import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { n: '01', title: 'Ask a Question', sub: 'Start with your business problem', text: '"Why are sales declining?"' },
  { n: '02', title: 'Add Context', sub: 'Answer a few smart follow-up questions', text: 'Synthesizing Context.' },
  { n: '03', title: 'AI Analyzes', sub: 'Data + context → clear diagnosis', text: 'Identifying Root Causes.' },
  { n: '04', title: 'Get Recommendations', sub: 'What to do. What to avoid.', text: 'Actionable Insights.' },
  { n: '05', title: 'View Dashboard', sub: 'Key insights, KPIs, and trends', text: 'Live Intelligence.' },
  { n: '06', title: 'Download Report', sub: 'Consulting-style strategy report', text: 'Your Plan. Ready.' },
];

const W = 800;
const H = 500;

const nodePositions: [number, number][][] = [
  [[120,100],[680,90],[200,200],[600,180],[350,300],[150,380],[700,350],[400,430]],
  [[100,120],[720,80],[180,220],[640,200],[360,280],[120,400],[680,370],[410,450]],
  [[300,80],[500,80],[200,220],[600,220],[350,300],[250,400],[450,400],[400,240]],
  [[150,100],[650,100],[200,250],[600,250],[350,180],[350,380],[250,320],[450,320]],
  [[100,150],[700,150],[200,250],[600,250],[350,120],[350,420],[150,350],[650,350]],
  [[120,100],[680,100],[180,200],[620,200],[350,160],[350,380],[200,300],[600,300]],
];

const pathDs = [
  'M120,100 C200,80 500,140 680,90 C720,80 740,200 700,350 C680,420 500,440 400,430',
  'M100,120 C150,100 300,180 640,200 C700,210 730,300 680,370 C650,410 500,450 410,450',
  'M300,80 C350,120 370,200 350,300 C330,370 280,390 250,400 C350,400 420,400 450,400',
  'M150,100 C200,130 280,180 350,180 C420,180 500,200 600,250 C630,270 580,340 450,320',
  'M100,150 C180,140 280,130 350,120 C420,110 550,120 700,150 C720,200 680,300 650,350',
  'M120,100 C200,110 290,150 350,160 C410,170 520,140 680,100 C720,120 700,250 600,300',
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const nodeRefs = useRef<(SVGCircleElement | null)[][]>([]);
  const groupRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // hide all groups initially
      groupRefs.current.forEach(g => { if (g) gsap.set(g, { opacity: 0 }); });
      stepRefs.current.forEach(s => { if (s) gsap.set(s, { opacity: 0, y: 40 }); });

      steps.forEach((_, i) => {

        // ScrollTrigger for each step
        ScrollTrigger.create({
          trigger: stepRefs.current[i],
          start: 'top 65%',
          end: 'bottom 35%',
          onEnter: () => playStep(i),
          onEnterBack: () => playStep(i),
          onLeave: () => hideStep(i),
          onLeaveBack: () => hideStep(i),
        });
      });

      function playStep(i: number) {
        // hide all other groups first
        groupRefs.current.forEach((g, idx) => {
          if (idx !== i && g) gsap.to(g, { opacity: 0, duration: 0.3 });
        });
        stepRefs.current.forEach((s, idx) => {
          if (idx !== i && s) gsap.to(s, { opacity: 0, y: 40, duration: 0.3 });
        });

        // show this step text
        gsap.to(stepRefs.current[i], { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });

        // show this group
        const group = groupRefs.current[i];
        if (group) gsap.set(group, { opacity: 1 });

        // animate path
        const path = pathRefs.current[i];
        if (path) {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
          gsap.to(path, { strokeDashoffset: 0, opacity: 1, duration: 1.4, ease: 'power2.inOut' });
        }

        // animate nodes
        const nodes = nodeRefs.current[i] || [];
        nodes.forEach((node, ni) => {
          if (!node) return;
          gsap.set(node, { opacity: 0, scale: 0, transformOrigin: 'center center' });
          gsap.to(node, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)', delay: 0.1 + ni * 0.07 });
          gsap.to(node, {
            y: ni % 2 === 0 ? -6 : 6,
            duration: 2 + ni * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 0.5 + ni * 0.2,
          });
        });
      }

      function hideStep(i: number) {
        gsap.to(stepRefs.current[i], { opacity: 0, y: 40, duration: 0.4 });
        if (groupRefs.current[i]) gsap.to(groupRefs.current[i], { opacity: 0, duration: 0.4 });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ position: 'relative', background: '#0A0A0A', width: '100%' }}>

      {/* sticky SVG canvas */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ccff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffaa00" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="nodeGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {steps.map((_, i) => (
            <g key={i} ref={el => { groupRefs.current[i] = el; }} style={{ opacity: 0 }}>
              <path
                ref={el => { pathRefs.current[i] = el; }}
                d={pathDs[i]}
                stroke="url(#lineGrad)"
                strokeWidth="1.8"
                fill="none"
                filter="url(#glow)"
              />
              {nodePositions[i].map(([cx, cy], ni) => {
                if (!nodeRefs.current[i]) nodeRefs.current[i] = [];
                return (
                  <circle
                    key={ni}
                    ref={el => { nodeRefs.current[i][ni] = el; }}
                    cx={cx}
                    cy={cy}
                    r={ni === 0 || ni === 7 ? 5.5 : 3.5}
                    fill={ni % 3 === 0 ? '#00ccff' : '#ffffff'}
                    filter="url(#nodeGlow)"
                  />
                );
              })}
            </g>
          ))}
        </svg>
      </div>

      {/* scroll steps */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: '-100vh' }}>
        {steps.map((step, i) => (
          <div
            key={i}
            ref={el => { stepRefs.current[i] = el; }}
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              padding: '0 8vw',
              justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end',
            }}
          >
            <div style={{ maxWidth: 420 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'rgba(0,204,255,0.6)', letterSpacing: '.3em', textTransform: 'uppercase', marginBottom: 12 }}>
                {step.n}
              </div>
              <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 'clamp(28px,4vw,52px)', color: '#fff', letterSpacing: '-.02em', lineHeight: 1.1, marginBottom: 12 }}>
                {step.title}
              </h2>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 20 }}>
                {step.sub}
              </p>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: 'rgba(0,204,255,0.8)', borderLeft: '2px solid rgba(0,204,255,0.3)', paddingLeft: 14, letterSpacing: '.04em' }}>
                {step.text}
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
