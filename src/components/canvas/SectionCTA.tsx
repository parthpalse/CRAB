import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { GlassTile } from "./GlassTile";

interface SectionCTAProps {
  onNavigateToForm: () => void;
}

export const SectionCTA = ({ onNavigateToForm }: SectionCTAProps) => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        boxSizing: "border-box",
        gap: 20,
      }}
    >
      {/* Label above tile */}
      <motion.p
        initial={{ y: 12 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}
      >
        Ready?
      </motion.p>

      <GlassTile
        accent
        glow
        initial={{ scale: 0.96, y: 20 }}
        whileInView={{ scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.1 }}
        style={{
          width: "min(600px, 90vw)",
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          textAlign: "center",
        }}
      >
        {/* Icon badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 52,
            height: 52,
            borderRadius: 16,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Sparkles size={22} color="#EDEDED" />
        </div>

        <div style={{ maxWidth: 440 }}>
          <p style={{ fontSize: 11, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            Find the leaks
          </p>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              fontWeight: 700,
              color: "#EDEDED",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Set up your company profile
          </h2>
          <p style={{ marginTop: 14, color: "#666", fontSize: "0.875rem", lineHeight: 1.7 }}>
            Six questions. Sixty seconds. A forensic audit that surfaces recoverable margin —
            ranked by urgency so you know exactly where to start.
          </p>
        </div>

        {/* Bullets */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          {["No credit card", "6-question quiz", "Results in 60s"].map((b) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#555" }} />
              <span style={{ fontSize: "0.75rem", color: "#666" }}>{b}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          onClick={onNavigateToForm}
          whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(237,237,237,0.12)" }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#EDEDED",
            color: "#0A0A0A",
            border: "none",
            borderRadius: 12,
            padding: "14px 28px",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "-0.01em",
            marginTop: 4,
          }}
          id="cta-setup-button"
          aria-label="Set up your company profile"
        >
          Get started — it's free
          <ArrowRight size={16} />
        </motion.button>
      </GlassTile>

      {/* Hint */}
      <motion.p
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        style={{ fontSize: "0.7rem", color: "#3A3A3A", margin: 0 }}
      >
        Already have an account?{" "}
        <a href="/login" style={{ color: "#666", textDecoration: "underline" }}>
          Sign in
        </a>
      </motion.p>
    </div>
  );
};
