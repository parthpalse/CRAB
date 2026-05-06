import { useEffect, useRef, useState } from "react";

const steps = [
  {
    n: "01",
    title: "Ask a Question",
    sub: "Start with your business problem",
    text: '"Why are sales declining?"',
  },
  {
    n: "02",
    title: "Add Context",
    sub: "Answer a few smart follow-up questions",
    text: "Synthesizing Context.",
  },
  {
    n: "03",
    title: "AI Analyzes",
    sub: "Data + context → clear diagnosis",
    text: "Identifying Root Causes.",
  },
  {
    n: "04",
    title: "Get Recommendations",
    sub: "What to do. What to avoid.",
    text: "Actionable Insights.",
  },
  {
    n: "05",
    title: "View Dashboard",
    sub: "Key insights, KPIs, and trends",
    text: "Live Intelligence.",
  },
  {
    n: "06",
    title: "Download Report",
    sub: "Consulting-style strategy report",
    text: "Your Plan. Ready.",
  },
];

/* ──────────────────────────────────────────────────────────────
   APPROACH (v4 — fixed sticky, no translation):
   - Sticky SVG fills the viewport. Nothing translates.
   - 6 nodes are positioned in svg-% along the full height,
     evenly spaced from 12% to 88% Y, alternating X (left/right).
   - Static "ghost" path shows the full road at low opacity.
   - A second "drawn" path on top has strokeDashoffset keyed to
     the section's scroll progress — fills in as user scrolls.
   - Text panels scroll normally, each pinned at the same Y as
     its node so it visually sits beside the node when active.
   ────────────────────────────────────────────────────────────── */

const W = 1000;
const H = 1000;
const PAD_TOP = 120;
const PAD_BOT = 120;
const NX = (i: number) => (i % 2 === 0 ? 200 : 800);
const NY = (i: number) =>
  PAD_TOP + (i / (steps.length - 1)) * (H - PAD_TOP - PAD_BOT);

const NODES: [number, number][] = steps.map((_, i) => [NX(i), NY(i)]);
const PATH_D = NODES.reduce(
  (acc, [x, y], i) => acc + (i === 0 ? `M${x},${y}` : ` L${x},${y}`),
  "",
);

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const drawnPathRef = useRef<SVGPathElement | null>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const path = drawnPathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);

    const onScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
      path.style.strokeDashoffset = String(len * (1 - p));

      // node + ring states
      nodeRefs.current.forEach((g, i) => {
        if (!g) return;
        const nodeP = i / (steps.length - 1);
        const isReached = p >= nodeP - 0.02;
        const isActive = Math.abs(p - nodeP) < 1 / (steps.length * 2);
        const ring = g.querySelector(".nh-ring") as SVGCircleElement | null;
        const fill = g.querySelector(".nh-fill") as SVGCircleElement | null;
        if (ring)
          ring.style.opacity = String(isReached ? (isActive ? 1 : 0.85) : 0.4);
        if (fill)
          fill.style.opacity = String(isReached ? (isActive ? 1 : 0.9) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#0A0A0A",
        width: "100%",
        minHeight: `${steps.length * 80}vh`,
        zIndex: 5,
      }}
    >
      {/* Sticky SVG — never translates, just sits there */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          zIndex: 1,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="nhPathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ccff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffaa00" stopOpacity="0.95" />
            </linearGradient>
            <filter
              id="nhPathGlow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="nhNodeGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ghost path — the full road, dim */}
          <path
            d={PATH_D}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* drawn path — fills in with scroll */}
          <path
            ref={drawnPathRef}
            d={PATH_D}
            stroke="url(#nhPathGrad)"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#nhPathGlow)"
          />

          {NODES.map(([cx, cy], i) => (
            <g
              key={i}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
            >
              <circle
                className="nh-ring"
                cx={cx}
                cy={cy}
                r={11}
                fill="none"
                stroke={i % 3 === 0 ? "#00ccff" : "#ffffff"}
                strokeWidth="1.4"
                filter="url(#nhNodeGlow)"
                style={{ opacity: 0.4 }}
              />
              <circle
                className="nh-fill"
                cx={cx}
                cy={cy}
                r={5}
                fill={i % 3 === 0 ? "#00ccff" : "#ffffff"}
                filter="url(#nhNodeGlow)"
                style={{ opacity: 0 }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Scroll text — each step pinned at the same Y as its node.
          Layered on top of the sticky SVG so they line up visually. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        {steps.map((step, i) => {
          const nodeP = i / (steps.length - 1);
          // total scrollable distance of section
          const isLeft = i % 2 === 0;
          const topPx = `calc(${nodeP * 100}% - 50vh + ${(NY(i) / H) * 100}vh)`;
          // simpler: place each text panel at section progress nodeP, vertically
          // centered in the viewport at that scroll point
          const sectionProgress = nodeP; // 0..1
          // active state visually
          const isActive =
            Math.abs(progress - sectionProgress) < 1 / (steps.length * 2);
          const isReached = progress >= sectionProgress - 0.02;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `calc(${nodeP * (steps.length * 80 - 100)}vh + ${(NY(i) / H) * 100}vh - ${(NY(i) / H) * 100}vh)`,
                left: 0,
                right: 0,
                height: "100vh",
                display: "flex",
                alignItems: "center",
                padding: "0 8vw",
                justifyContent: isLeft ? "flex-start" : "flex-end",
                pointerEvents: "auto",
                opacity: isActive ? 1 : isReached ? 0.5 : 0.3,
                transition: "opacity 0.4s ease",
              }}
            >
              <div
                style={{ maxWidth: 420, textAlign: isLeft ? "left" : "right" }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11,
                    color: "rgba(0,204,255,0.6)",
                    letterSpacing: ".3em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  {step.n}
                </div>
                <h2
                  style={{
                    fontFamily: "'Orbitron',sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(28px,4vw,52px)",
                    color: "#fff",
                    letterSpacing: "-.02em",
                    lineHeight: 1.1,
                    marginBottom: 12,
                  }}
                >
                  {step.title}
                </h2>
                <p
                  style={{
                    fontFamily: "Inter,sans-serif",
                    fontSize: 16,
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.6,
                    marginBottom: 20,
                  }}
                >
                  {step.sub}
                </p>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 13,
                    color: "rgba(0,204,255,0.8)",
                    borderLeft: isLeft
                      ? "2px solid rgba(0,204,255,0.3)"
                      : "none",
                    borderRight: isLeft
                      ? "none"
                      : "2px solid rgba(0,204,255,0.3)",
                    paddingLeft: isLeft ? 14 : 0,
                    paddingRight: isLeft ? 0 : 14,
                    letterSpacing: ".04em",
                    display: "inline-block",
                  }}
                >
                  {step.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
