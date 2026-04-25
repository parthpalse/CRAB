import { motion } from "framer-motion";
import { Activity, ListChecks, TrendingUp, Zap } from "lucide-react";
import { GlassTile } from "./GlassTile";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const tileVariants = {
  hidden: { y: 28, scale: 0.97 },
  visible: {
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

const TILES = [
  {
    icon: Activity,
    title: "Forensic Audit",
    body: "360° health score across revenue, margins, costs, and runway — with clear benchmarks against your sector.",
    tag: "Diagnose",
  },
  {
    icon: ListChecks,
    title: "Ranked Priorities",
    body: "Every recommendation sorted by urgency and projected annual savings. No fluff, no filler.",
    tag: "Prioritize",
  },
  {
    icon: TrendingUp,
    title: "Margin Recovery",
    body: "Average client surfaces €24,000 of recoverable margin in the first audit cycle alone.",
    tag: "Save",
  },
  {
    icon: Zap,
    title: "60-Second Insight",
    body: "Replaces a €5,000 consultant — in minutes. Six questions is all we need to start.",
    tag: "Speed",
  },
];

// Stats strip
const STATS = [
  { k: "2,400+", v: "Audits delivered" },
  { k: "€18M", v: "Savings surfaced" },
  { k: "94%", v: "Recommend to peers" },
  { k: "60s", v: "Time to insight" },
];

export const SectionPitch = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        boxSizing: "border-box",
        gap: 48,
      }}
    >
      {/* Hero headline */}
      <motion.div
        initial={{ y: -24 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: "center", maxWidth: 640 }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 999,
            padding: "6px 14px",
            marginBottom: 24,
          }}
        >
          <Zap size={12} color="#888" />
          <span style={{ fontSize: 11, color: "#888", letterSpacing: "0.05em" }}>
            Replaces a €5,000 consultant — in minutes
          </span>
        </div>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            color: "#EDEDED",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          AI-Powered Business Advisor{" "}
          <span style={{ color: "#555" }}>for Small Businesses</span>
        </h1>
        <p
          style={{
            marginTop: 16,
            color: "#888",
            fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
            lineHeight: 1.6,
            maxWidth: 520,
            margin: "16px auto 0",
          }}
        >
          Get a forensic audit of your finances, costs, and growth levers.
          CRAB.AI diagnoses what's leaking value and tells you exactly how to fix it.
        </p>
      </motion.div>

      {/* 2×2 tile grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(260px, 320px))",
          gap: 16,
        }}
      >
        {TILES.map((tile) => (
          <GlassTile
            key={tile.title}
            variants={tileVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            style={{ padding: 28 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(255,255,255,0.06)",
                marginBottom: 16,
              }}
            >
              <tile.icon size={18} color="#EDEDED" />
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#555",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {tile.tag}
            </div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#EDEDED",
                margin: "0 0 8px",
              }}
            >
              {tile.title}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#666", lineHeight: 1.6, margin: 0 }}>
              {tile.body}
            </p>
          </GlassTile>
        ))}
      </motion.div>

      {/* Stats strip */}
      <motion.div
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{
          display: "flex",
          gap: 40,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: 24,
        }}
      >
        {STATS.map((s) => (
          <div key={s.v} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#EDEDED" }}>{s.k}</div>
            <div style={{ fontSize: "0.7rem", color: "#555", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {s.v}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 10, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Scroll to continue
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          style={{
            width: 1,
            height: 20,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
          }}
        />
      </motion.div>
    </div>
  );
};
