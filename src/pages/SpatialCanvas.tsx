import React, { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, animate, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Activity, ListChecks, Zap, TrendingUp } from "lucide-react";

// Standard animation config
const ease = [0.16, 1, 0.3, 1];

const TEXT = ['C', 'R', 'A', 'B', '.', 'A', 'I'];

const Counter = ({ from, to, suffix = "", duration = 2 }: { from: number, to: number, suffix?: string, duration?: number }) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value).toLocaleString() + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [isInView, from, to, duration, suffix]);

  return <span ref={ref}>{from}{suffix}</span>;
}

const SpatialCanvas = () => {
  const [phase, setPhase] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80);
  });

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1900);
    const t3 = setTimeout(() => setPhase(3), 2800);
    const t4 = setTimeout(() => setPhase(4), 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (phase === 1) {
      interval = setInterval(() => {
        setLetterCount(prev => {
          if (prev >= 7) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", color: "rgba(255,255,255,0.55)", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      
      {/* ── Intro Splash Sequence ── */}
      {phase < 4 && (
        <div 
          style={{ 
            position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9999,
            backgroundColor: phase >= 2 ? "#0A0A0A" : "#FFFFFF",
            opacity: phase >= 3 ? 0 : 1,
            transition: "background-color 0.8s ease-in-out, opacity 0.6s ease-in-out"
          }}
        >
          <div style={{
            opacity: phase >= 0 ? 1 : 0,
            transition: "opacity 0.6s ease-in-out"
          }}>
            <img
              src="/crab-logo.png"
              alt="CRAB.AI"
              style={{ 
                width: "180px", height: "auto",
                filter: phase >= 2 ? "brightness(0) invert(1)" : "brightness(1) invert(0)",
                transition: "filter 0.8s ease-in-out"
              }}
            />
          </div>

          <div style={{ marginTop: "32px", height: "90px", display: "flex", justifyContent: "center" }}>
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "72px",
                fontWeight: 800,
                letterSpacing: "0.2em",
                display: "flex",
                color: phase >= 2 ? "#FFFFFF" : "#0A0A0A",
                transition: "color 0.8s ease-in-out"
              }}
            >
              {TEXT.slice(0, letterCount).join('')}
            </div>
          </div>
        </div>
      )}

      {/* ── Navbar ── */}
      <nav style={{ 
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "52px",
        backgroundColor: scrolled ? "rgba(10,10,10,0.85)" : "rgba(10,10,10,0)", 
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 32px",
        transition: "all 300ms ease"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <img src="/crab-logo.png" alt="CRAB.AI" style={{ height: "44px", width: "auto", filter: "brightness(0) invert(1)" }} />
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "#FFFFFF" }}>
            CRAB.AI
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link to="/login" style={{ color: "#888888", fontSize: "14px", fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
            onMouseOver={(e) => e.currentTarget.style.color = "#FFFFFF"}
            onMouseOut={(e) => e.currentTarget.style.color = "#888888"}
          >Sign in</Link>
          <Link to="/setup" style={{ 
            backgroundColor: "#FFFFFF", color: "#000000", padding: "8px 16px", borderRadius: "8px", 
            fontSize: "14px", fontWeight: 600, textDecoration: "none", transition: "transform 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >Start free audit →</Link>
        </div>
      </nav>

      {/* ── Cascade-Style Hero Section ── */}
      <div style={{ 
        paddingTop: "180px", paddingBottom: "100px", display: "flex", flexDirection: "column", alignItems: "center", 
        textAlign: "center", maxWidth: "1000px", margin: "0 auto", paddingLeft: "32px", paddingRight: "32px",
        position: "relative", zIndex: 10
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: phase >= 4 ? 0 : 3.4, ease }}
          style={{ 
            border: "1px solid #1F1F1F", borderRadius: "999px", padding: "8px 16px", 
            marginBottom: "32px", display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: "rgba(255,255,255,0.03)"
          }}
        >
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#FFFFFF" }} />
          <span style={{ fontSize: "12px", color: "#FFFFFF", letterSpacing: "0.1em", fontWeight: 500 }}>AI-POWERED BUSINESS ADVISOR</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: phase >= 4 ? 0.1 : 3.5, ease }}
          style={{ fontSize: "88px", fontWeight: 700, lineHeight: 1.05, marginBottom: "32px", color: "rgba(255,255,255,0.95)", fontFamily: "'Orbitron', sans-serif", letterSpacing: "-0.02em" }}
        >
          Your business has leaks.<br/>We find them.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: phase >= 4 ? 0.2 : 3.6, ease }}
          style={{ color: "#888888", fontSize: "20px", fontFamily: "'Inter', sans-serif", maxWidth: "600px", lineHeight: 1.6, marginBottom: "48px" }}
        >
          CRAB.AI runs a consultant-grade audit in 60 seconds. 
          Diagnose what's draining value, prioritize by impact, fix it fast.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: phase >= 4 ? 0.3 : 3.7, ease }}
          style={{ display: "flex", gap: "20px", alignItems: "center", justifyContent: "center" }}
        >
          <Link to="/setup" style={{ 
            backgroundColor: "#FFFFFF", color: "#000000", padding: "16px 32px", 
            borderRadius: "12px", fontSize: "16px", fontWeight: 600, textDecoration: "none",
            display: "inline-block", transition: "all 0.2s", boxShadow: "0 4px 14px rgba(255,255,255,0.25)"
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Start free audit →
          </Link>
          <Link to="/login" style={{ 
            backgroundColor: "transparent", color: "#FFFFFF", padding: "16px 32px", 
            borderRadius: "12px", fontSize: "16px", fontWeight: 600, textDecoration: "none",
            display: "inline-block", transition: "all 0.2s", border: "1px solid #2A2A2A"
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#111111"; e.currentTarget.style.borderColor = "#444444"; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "#2A2A2A"; }}
          >
            Already have an account
          </Link>
        </motion.div>
        <div style={{ color: "#888888", fontSize: "13px", fontFamily: "'Inter', sans-serif", textAlign: "center", marginTop: "16px" }}>
          No credit card · 6-question quiz · Results in 60 seconds
        </div>
      </div>

      {/* ── Tabbed Feature Showcase ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 32px", display: "flex", gap: "64px", alignItems: "center" }}>
        {/* Left Column 35% */}
        <div style={{ flex: "0 0 35%", display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { id: 0, label: "Diagnose", icon: <Activity size={20} />, desc: "Find the root cause." },
            { id: 1, label: "Prioritize", icon: <ListChecks size={20} />, desc: "Rank by financial impact." },
            { id: 2, label: "Act", icon: <Zap size={20} />, desc: "Execute the action plan." },
            { id: 3, label: "Track", icon: <TrendingUp size={20} />, desc: "Monitor margin recovery." }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <div 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  padding: "20px 24px", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s",
                  border: isActive ? "1px solid #333333" : "1px solid #1F1F1F",
                  backgroundColor: isActive ? "#111111" : "transparent"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", color: isActive ? "#FFFFFF" : "#888888", fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: isActive ? 600 : 400 }}>
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                {isActive && (
                  <div style={{ marginTop: "8px", marginLeft: "32px", color: "#888888", fontSize: "12px", fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>
                    {tab.desc}
                    <div style={{ marginTop: "4px", color: "#888888", cursor: "pointer", textDecoration: "none" }}>Learn more →</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column 65% */}
        <div style={{ flex: "0 0 65%", position: "relative", minHeight: "340px" }}>
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div
                key="tab0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "16px", padding: "32px", position: "absolute", inset: 0 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                  <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#FFFFFF" }} />
                  <div style={{ fontSize: "11px", color: "#888888", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif" }}>PHASE 01 — DIAGNOSE</div>
                </div>
                <h3 style={{ fontSize: "20px", fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF", marginBottom: "32px" }}>
                  360° Business Health
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {[
                    { label: "Revenue Health", val: 82 },
                    { label: "Gross Margin", val: 51 },
                    { label: "Cost Efficiency", val: 67 },
                    { label: "Cash Runway", val: 74 }
                  ].map((metric, i) => (
                    <div key={metric.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                        <span style={{ color: "#888888" }}>{metric.label}</span>
                        <span style={{ fontWeight: 600, color: "#FFFFFF" }}>{metric.val}%</span>
                      </div>
                      <div style={{ height: "4px", backgroundColor: "#1F1F1F", borderRadius: "2px", overflow: "hidden" }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.val}%` }}
                          transition={{ duration: 0.8, delay: 0.1 * i, ease: "easeOut" }}
                          style={{ height: "100%", backgroundColor: "#FFFFFF", borderRadius: "2px" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div
                key="tab1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "16px", padding: "32px", position: "absolute", inset: 0 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                  <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
                  <div style={{ fontSize: "11px", color: "#888888", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif" }}>PHASE 02 — PRIORITIZE</div>
                </div>
                <h3 style={{ fontSize: "20px", fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF", marginBottom: "32px" }}>
                  Ranked by Impact
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { id: "01", label: "Renegotiate supplier contracts", val: "+€8,200/yr" },
                    { id: "02", label: "Cancel redundant SaaS tools", val: "+€4,800/yr" },
                    { id: "03", label: "Optimise payroll scheduling", val: "+€3,100/yr" }
                  ].map((item, i) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * i, ease: "easeOut" }}
                      style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", paddingBottom: "12px", borderBottom: i < 2 ? "1px solid #1F1F1F" : "none" }}
                    >
                      <div style={{ display: "flex", gap: "12px" }}>
                        <span style={{ color: "#444444", fontFamily: "'Orbitron', sans-serif" }}>{item.id}</span>
                        <span style={{ color: "#CCCCCC" }}>{item.label}</span>
                      </div>
                      <span style={{ fontWeight: 600, color: "#FFFFFF" }}>{item.val}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div
                key="tab2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "16px", padding: "32px", position: "absolute", inset: 0 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                  <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#FF5F56" }} />
                  <div style={{ fontSize: "11px", color: "#888888", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif" }}>PHASE 03 — ACT</div>
                </div>
                <h3 style={{ fontSize: "20px", fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF", marginBottom: "32px" }}>
                  Action Plan
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { label: "Contact top 3 suppliers this week", checked: false },
                    { label: "Audit SaaS subscriptions", checked: false },
                    { label: "Review payroll schedule", checked: true }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * i, ease: "easeOut" }}
                      style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: item.checked ? "#444444" : "#CCCCCC", textDecoration: item.checked ? "line-through" : "none" }}
                    >
                      <div style={{ width: "16px", height: "16px", borderRadius: "4px", border: "1px solid", borderColor: item.checked ? "#444444" : "#888888", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: item.checked ? "#444444" : "transparent" }}>
                        {item.checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span>{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 3 && (
              <motion.div
                key="tab3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "16px", padding: "32px", position: "absolute", inset: 0 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                  <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#27C93F" }} />
                  <div style={{ fontSize: "11px", color: "#888888", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif" }}>PHASE 04 — TRACK</div>
                </div>
                <h3 style={{ fontSize: "20px", fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF", marginBottom: "32px" }}>
                  Monthly Progress
                </h3>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "24px", height: "120px", marginBottom: "24px" }}>
                  {[
                    { label: "Jan", height: "40%" },
                    { label: "Feb", height: "55%" },
                    { label: "Mar", height: "70%" },
                    { label: "Apr", height: "85%" }
                  ].map((bar, i) => (
                    <div key={bar.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", height: "100%" }}>
                      <div style={{ width: "100%", height: "100%", backgroundColor: "#1F1F1F", borderRadius: "4px", position: "relative", overflow: "hidden" }}>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: bar.height }}
                          transition={{ duration: 0.6, delay: 0.1 * i, ease: "easeOut" }}
                          style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FFFFFF", borderRadius: "4px" }}
                        />
                      </div>
                      <div style={{ fontSize: "12px", color: "#888888" }}>{bar.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: "14px", color: "#FFFFFF", fontWeight: 500, textAlign: "center" }}>
                  +€6,200 recovered this month
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Dashboard Preview ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px", position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: phase >= 4 ? 0.4 : 3.8, ease }}
          style={{
            backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "24px",
            padding: "40px", boxShadow: "0 20px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
            position: "relative", overflow: "hidden"
          }}
        >
          {/* Subtle Glow */}
          <div style={{ position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "1px solid #1F1F1F", paddingBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#FF5F56" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#27C93F" }} />
            </div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "#FFFFFF", letterSpacing: "0.1em" }}>EXECUTIVE SUMMARY</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
            <div>
              <h3 style={{ fontSize: "28px", fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF", marginBottom: "32px" }}>
                360° Business Health
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {[
                  { label: "Revenue Health", val: 82 },
                  { label: "Gross Margin", val: 51 },
                  { label: "Cost Efficiency", val: 67 },
                  { label: "Cash Runway", val: 74 }
                ].map((metric, i) => (
                  <div key={metric.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "12px" }}>
                      <span style={{ color: "#888888" }}>{metric.label}</span>
                      <span style={{ fontWeight: 600, color: "#FFFFFF" }}>{metric.val}%</span>
                    </div>
                    <div style={{ height: "4px", backgroundColor: "#1F1F1F", borderRadius: "2px", overflow: "hidden" }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={phase >= 4 ? { width: `${metric.val}%` } : { width: 0 }}
                        transition={{ duration: 1.5, delay: phase >= 4 ? 0.6 + (0.1 * i) : 4.0 + (0.1 * i), ease: "easeOut" }}
                        style={{ height: "100%", backgroundColor: "#FFFFFF", borderRadius: "2px" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ backgroundColor: "#161616", border: "1px solid #1F1F1F", borderRadius: "16px", padding: "32px" }}>
              <div style={{ fontSize: "12px", color: "#888888", letterSpacing: "0.1em", marginBottom: "16px" }}>TOP PRIORITY FIX</div>
              <div style={{ fontSize: "20px", color: "#FFFFFF", marginBottom: "12px", fontWeight: 500 }}>Renegotiate supplier contracts</div>
              <div style={{ fontSize: "36px", fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF", fontWeight: 700, marginBottom: "24px" }}>+€8,200/yr</div>
              <p style={{ color: "#888888", fontSize: "14px", lineHeight: 1.6 }}>
                Your cost of goods sold is 14% higher than the industry median. We identified 3 suppliers where bulk discounting terms are not being utilized.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Logo Trust Bar ── */}
      <div style={{ padding: "80px 32px 120px", textAlign: "center", borderBottom: "1px solid #1F1F1F" }}>
        <p style={{ fontSize: "12px", color: "#888888", letterSpacing: "0.1em", marginBottom: "40px", fontWeight: 500 }}>TRUSTED BY FORWARD-THINKING BUSINESSES</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "60px", flexWrap: "wrap", opacity: 0.5 }}>
          {["ACME CORP", "GLOBEX", "SOYUZ", "INITECH", "UMBRELLA"].map((logo) => (
            <div key={logo} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "20px", fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.05em" }}>
              {logo}
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature Cards (The 3 Phases) ── */}
      <div style={{ padding: "160px 32px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <h2 style={{ fontSize: "48px", fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF", fontWeight: 700, marginBottom: "24px" }}>
            The CRAB.AI Method
          </h2>
          <p style={{ color: "#888888", fontSize: "20px", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
            A systematic, ruthless approach to finding and fixing value leaks.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
          {/* Phase 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "24px", padding: "48px 32px", transition: "transform 0.3s", cursor: "default" }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{ fontSize: "14px", fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF", marginBottom: "16px", display: "inline-flex", backgroundColor: "#1F1F1F", padding: "6px 12px", borderRadius: "8px" }}>01</div>
            <h3 style={{ fontSize: "28px", fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF", fontWeight: 700, marginBottom: "16px", lineHeight: 1.2 }}>
              Diagnose
            </h3>
            <p style={{ color: "#888888", fontSize: "16px", lineHeight: 1.6 }}>
              A forensic audit of your entire business. Revenue, margins, costs, runway — every dimension benchmarked against your sector in 60 seconds.
            </p>
          </motion.div>

          {/* Phase 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "24px", padding: "48px 32px", transition: "transform 0.3s", cursor: "default" }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{ fontSize: "14px", fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF", marginBottom: "16px", display: "inline-flex", backgroundColor: "#1F1F1F", padding: "6px 12px", borderRadius: "8px" }}>02</div>
            <h3 style={{ fontSize: "28px", fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF", fontWeight: 700, marginBottom: "16px", lineHeight: 1.2 }}>
              Prioritize
            </h3>
            <p style={{ color: "#888888", fontSize: "16px", lineHeight: 1.6 }}>
              Ranked by urgency & savings. No fluff — every recommendation sorted by projected annual impact. Know exactly what to fix first.
            </p>
          </motion.div>

          {/* Phase 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "24px", padding: "48px 32px", transition: "transform 0.3s", cursor: "default" }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{ fontSize: "14px", fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF", marginBottom: "16px", display: "inline-flex", backgroundColor: "#1F1F1F", padding: "6px 12px", borderRadius: "8px" }}>03</div>
            <h3 style={{ fontSize: "28px", fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF", fontWeight: 700, marginBottom: "16px", lineHeight: 1.2 }}>
              Act
            </h3>
            <p style={{ color: "#888888", fontSize: "16px", lineHeight: 1.6 }}>
              Turn insight into recovered margin. Identify what's leaking value, execute the fix, and measure the financial impact month over month.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Stats / Impact Section (Cascade Split Style) ── */}
      <div style={{ padding: "160px 32px", backgroundColor: "#050505", borderTop: "1px solid #1F1F1F", borderBottom: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <h2 style={{ fontSize: "48px", fontFamily: "'Orbitron', sans-serif", color: "#FFFFFF", fontWeight: 700, marginBottom: "24px", lineHeight: 1.1 }}>
              Real impact,<br/>measured in euros.
            </h2>
            <p style={{ color: "#888888", fontSize: "20px", lineHeight: 1.6, marginBottom: "48px" }}>
              We don't just provide generic advice. We find the specific leaks in your P&L and give you the exact steps to plug them.
            </p>
            <div style={{ display: "flex", gap: "48px" }}>
              <div>
                <div style={{ fontSize: "56px", fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px", lineHeight: 1 }}>
                  €<Counter from={0} to={24} duration={2} />K
                </div>
                <div style={{ color: "#888888", fontSize: "14px", fontWeight: 500 }}>Avg annual recovery</div>
              </div>
              <div>
                <div style={{ fontSize: "56px", fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px", lineHeight: 1 }}>
                  <Counter from={0} to={94} suffix="%" duration={2} />
                </div>
                <div style={{ color: "#888888", fontSize: "14px", fontWeight: 500 }}>Accuracy rate</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            style={{
              backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "24px", padding: "48px",
              boxShadow: "0 20px 80px rgba(0,0,0,0.5)"
            }}
          >
            <div style={{ marginBottom: "32px", display: "flex", gap: "4px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              ))}
            </div>
            <p style={{ fontSize: "24px", color: "#FFFFFF", lineHeight: 1.5, marginBottom: "32px", fontStyle: "italic" }}>
              "CRAB.AI found €12,000 in redundant software subscriptions and a massive discrepancy in our logistics costs within 60 seconds. It's like having a McKinsey partner on speed dial."
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#2A2A2A" }} />
              <div>
                <div style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "16px" }}>Sarah Jenkins</div>
                <div style={{ color: "#888888", fontSize: "14px" }}>CEO, TechFlow Inc.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Final CTA Section ── */}
      <div style={{ padding: "160px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "100%", height: "100%", background: "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 60%)",
          pointerEvents: "none", zIndex: 0
        }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          style={{ position: "relative", zIndex: 1, backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "32px", padding: "80px 40px", maxWidth: "1000px", margin: "0 auto", boxShadow: "0 20px 80px rgba(0,0,0,0.5)" }}
        >
          <h2 style={{ fontSize: "64px", fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#FFFFFF", marginBottom: "24px", letterSpacing: "-0.02em" }}>
            Ready to find your leaks?
          </h2>
          <p style={{ color: "#888888", fontSize: "20px", fontFamily: "'Inter', sans-serif", maxWidth: "600px", margin: "0 auto 48px", lineHeight: 1.6 }}>
            6 questions. 60 seconds. €5,000 worth of insight, free.
          </p>
          <Link to="/setup" style={{ 
            backgroundColor: "#FFFFFF", color: "#000000", padding: "20px 40px", 
            borderRadius: "12px", fontSize: "18px", fontWeight: 700, textDecoration: "none",
            display: "inline-block", transition: "all 0.25s",
            boxShadow: "0 0 0 rgba(255,255,255,0)"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,255,255,0.2)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 0 0 rgba(255,255,255,0)";
          }}
          >
            Start your free audit →
          </Link>
        </motion.div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: "#0A0A0A", borderTop: "1px solid #1F1F1F", padding: "32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src="/crab-logo.png" alt="CRAB.AI" style={{ height: "24px", width: "auto", filter: "brightness(0) invert(1)" }} />
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "#FFFFFF" }}>CRAB.AI</span>
            <span style={{ color: "#888888", fontSize: "12px", fontFamily: "'Inter', sans-serif", marginLeft: "16px" }}>© 2025 CRAB.AI</span>
          </div>
          <div style={{ display: "flex", gap: "24px", color: "#888888", fontSize: "12px", fontFamily: "'Inter', sans-serif" }}>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default SpatialCanvas;
