/**
 * CRAB.AI Neural Hero — React component
 *
 * Drop into Landing.tsx (or any page) like:
 *   import NeuralHero from "@/components/NeuralHero/NeuralHero";
 *   ...
 *   <NeuralHero />
 *
 * Renders a full-page (100vh × 6) scroll-driven hero with a fixed Three.js
 * neural sphere and 6 story sections layered on top.
 */

import { useEffect, useRef, useState } from "react";
import { createScene, type SceneController, type SceneOptions } from "./scene";
import "./NeuralHero.css";

const DEFAULTS: SceneOptions = {
  speed: 1,
  nodes: 380,
  particles: 600,
  rotation: 0.6,
  hue: "white",
  hud: true,
};

export default function NeuralHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctrlRef = useRef<SceneController | null>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [impactFired, setImpactFired] = useState(false);

  // Build/dispose scene
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctrl = createScene(canvasRef.current, DEFAULTS);
    ctrlRef.current = ctrl;
    return () => ctrl.dispose();
  }, []);

  // Scroll handler
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.body.scrollHeight;
      ctrlRef.current?.onScroll(y, h);
      const vh = window.innerHeight;
      const idx = Math.min(5, Math.floor(y / vh));
      setActiveScene(idx);
      // impact ripple at scene 1 entry
      if (idx === 1 && !impactFired) {
        setImpactFired(true);
        fireImpact();
      } else if (idx === 0) {
        setImpactFired(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [impactFired]);

  function fireImpact() {
    ["impact1", "impact2"].forEach((id, k) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.transition = "none";
      el.style.width = "0px";
      el.style.height = "0px";
      el.style.opacity = "0.9";
      void el.offsetWidth;
      el.style.transition =
        "width 1s cubic-bezier(.16,1,.3,1), height 1s cubic-bezier(.16,1,.3,1), opacity 1s ease";
      el.style.width = 300 + k * 220 + "px";
      el.style.height = 300 + k * 220 + "px";
      el.style.opacity = "0";
    });
  }

  function jumpTo(i: number) {
    window.scrollTo({ top: i * window.innerHeight, behavior: "smooth" });
  }

  return (
    <div className="nh">
      <div className="nh-bg" />
      <div className="nh-fixed">
        <canvas ref={canvasRef} className="nh-canvas" />
        <div className="nh-vignette" />
        <div className="nh-grain" />
      </div>

      <div className="nh-corner nh-tl" />
      <div className="nh-corner nh-tr" />
      <div className="nh-corner nh-bl" />
      <div className="nh-corner nh-br" />

      <div className="nh-impact-ring" id="impact1" />
      <div className="nh-impact-ring" id="impact2" />

      <nav className="nh-progress">
        {["Hero", "Impact", "What we are", "How we operate", "What we find", "Proof"].map(
          (label, i) => (
            <button
              key={label}
              className={`nh-pdot ${activeScene === i ? "on" : ""}`}
              onClick={() => jumpTo(i)}
              data-label={label}
              aria-label={`Go to ${label}`}
            />
          )
        )}
      </nav>

      {/* Scene 0 — Hero */}
      <section className="nh-stage">
        <div className="nh-hero-content">
          <div className="nh-hero-inner">
            <span className="nh-pill">
              <span className="nh-dot" /> AI-Powered Business Advisor
            </span>
            <h1 className="nh-headline">
              <span className="nh-row">
                <span>Your business</span>
              </span>
              <span className="nh-row nh-d1">
                <span>
                  has <span className="nh-accent">leaks.</span>
                </span>
              </span>
              <span className="nh-row nh-d2">
                <span>
                  We <span className="nh-glyph">/</span> find them.
                </span>
              </span>
            </h1>
            <p className="nh-sub">
              A consultant-grade audit of your finances, costs, and growth levers — delivered in
              60 seconds. Diagnose what's draining margin, prioritize by impact, fix it fast.
            </p>
            <div className="nh-cta-row">
              <a className="nh-btn nh-btn-primary" href="/setup">
                Start free audit
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <a className="nh-btn nh-btn-ghost" href="#">
                Watch the demo · 90s
              </a>
            </div>
            <div className="nh-meta">
              <span>NO CREDIT CARD</span>
              <span className="nh-sep">·</span>
              <span>6-QUESTION QUIZ</span>
              <span className="nh-sep">·</span>
              <span>RESULTS IN 60s</span>
            </div>
          </div>
        </div>
        <div className="nh-scroll-cue">
          <span>SCROLL</span>
          <span className="nh-line" />
        </div>
      </section>

      {/* Story */}
      <section className={`nh-section nh-center ${activeScene === 1 ? "in" : ""}`}>
        <div className="nh-inner">
          <div className="nh-eyebrow"><span className="nh-num">01</span> Impact</div>
          <h2>The signal <span className="nh-accent">arrives.</span></h2>
          <p className="nh-lede">
            A single thread becomes a network. Every business is a system of connected decisions —
            we map the ones quietly costing you margin.
          </p>
        </div>
      </section>

      <section className={`nh-section nh-left ${activeScene === 2 ? "in" : ""}`}>
        <div className="nh-inner">
          <div className="nh-eyebrow"><span className="nh-num">02</span> What we are</div>
          <h2>An AI advisor that <span className="nh-accent">finds the leaks.</span></h2>
          <p className="nh-lede">
            CRAB.AI is a consultant-grade audit engine for SMBs. It reads your finances, costs, and
            growth signals, and surfaces the few moves that actually move margin.
          </p>
        </div>
      </section>

      <section className={`nh-section nh-right ${activeScene === 3 ? "in" : ""}`}>
        <div className="nh-inner">
          <div className="nh-eyebrow"><span className="nh-num">03</span> How we operate</div>
          <h2>Connect. Diagnose. <span className="nh-accent">Fix.</span></h2>
          <p className="nh-lede">
            Three steps. Sixty seconds. A prioritized plan you can hand to your team Monday morning.
          </p>
          <div className="nh-steps">
            {[
              { k: "01", t: "Connect", d: "Stripe, Xero, Shopify, ad accounts. Read-only." },
              { k: "02", t: "Diagnose", d: "Cross-reference 40+ leak signatures across pricing, churn, costs, ops." },
              { k: "03", t: "Fix", d: "Ranked actions with expected impact. Not a dashboard — a plan." },
            ].map((s) => (
              <div key={s.k} className="nh-step">
                <div className="nh-k">{s.k}</div>
                <div>
                  <div className="nh-t">{s.t}</div>
                  <div className="nh-d">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`nh-section nh-left ${activeScene === 4 ? "in" : ""}`}>
        <div className="nh-inner">
          <div className="nh-eyebrow"><span className="nh-num">04</span> What we find</div>
          <h2>Money <span className="nh-accent">hiding</span> in plain sight.</h2>
          <p className="nh-lede">
            The same patterns surface across thousands of audits. Most operators are leaking from
            two or three of these at once.
          </p>
          <div className="nh-leak-grid">
            {[
              ["Pricing drift", "+8.4%"],
              ["Silent churn", "+12%"],
              ["Vendor sprawl", "€3.1k/mo"],
              ["Ad waste", "31%"],
              ["Refund leakage", "+2.1%"],
              ["Stale SKUs", "€6.4k"],
            ].map(([k, v]) => (
              <div key={k} className="nh-leak">
                <span>{k}</span>
                <span className="nh-v">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`nh-section nh-center ${activeScene === 5 ? "in" : ""}`}>
        <div className="nh-inner">
          <div className="nh-eyebrow" style={{ justifyContent: "center" }}>
            <span className="nh-num">05</span> Proof
          </div>
          <h2>2,400 audits. <span className="nh-accent">€41M recovered.</span></h2>
          <p className="nh-lede" style={{ margin: "0 auto" }}>
            Operators across 14 countries use CRAB.AI to find what their P&amp;L is hiding.
          </p>
          <div className="nh-stats">
            <div className="nh-stat"><div className="nh-n">2,400</div><div className="nh-l">Audits</div></div>
            <div className="nh-stat"><div className="nh-n">€41M</div><div className="nh-l">Recovered</div></div>
            <div className="nh-stat"><div className="nh-n">99.98%</div><div className="nh-l">Uptime</div></div>
          </div>
          <div className="nh-cta-row" style={{ marginTop: 42 }}>
            <a className="nh-btn nh-btn-primary" href="/setup">
              Start free audit
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="nh-btn nh-btn-ghost" href="#">
              Talk to a human
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
