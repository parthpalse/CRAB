import { motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroTileProps {
  scrollYProgress: MotionValue<number>;
}

export const HeroTile = ({ scrollYProgress }: HeroTileProps) => {
  // Tile expands width as it becomes fully active
  const tileWidth = useTransform(scrollYProgress, (v) => {
    const maxW = Math.min(900, window.innerWidth * 0.85);
    if (v <= 0.84) return 520;
    if (v >= 1.00) return maxW;
    const t = (v - 0.84) / 0.16;
    return 520 + (maxW - 520) * t;
  });

  return (
    <motion.div
      style={{
        width: tileWidth,
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 24,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Top-edge highlight */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
        }}
      />

      {/* Ambient glow behind CTA */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -80, left: "50%",
          transform: "translateX(-50%)",
          width: 400, height: 200,
          background: "radial-gradient(ellipse, rgba(37,99,235,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ padding: "52px 48px 48px", position: "relative", zIndex: 1 }}>
        {/* Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(37,99,235,0.12)",
            border: "1px solid rgba(37,99,235,0.25)",
            borderRadius: 999,
            padding: "5px 14px",
            marginBottom: 28,
          }}
        >
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#2563EB" }} />
          <span style={{ fontSize: "0.7rem", color: "#2563EB", fontWeight: 600, letterSpacing: "0.06em" }}>
            AI-POWERED BUSINESS ADVISOR
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 800,
            color: "#EDEDED",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            margin: "0 0 20px",
            maxWidth: 560,
          }}
        >
          AI-Powered Business Advisor{" "}
          <span style={{ color: "#444" }}>for Small Businesses</span>
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: "0.95rem",
            color: "#666",
            lineHeight: 1.7,
            margin: "0 0 36px",
            maxWidth: 480,
          }}
        >
          Get a forensic audit of your finances, costs, and growth levers.
          CRAB.AI diagnoses what's leaking value and tells you exactly how to fix it —
          prioritized by savings and urgency.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <Link
            to="/setup"
            id="hero-cta-setup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "#2563EB",
              color: "#FFFFFF",
              borderRadius: 12,
              padding: "14px 26px",
              fontSize: "0.9rem",
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "-0.01em",
              transition: "background 0.2s, box-shadow 0.2s",
              boxShadow: "0 0 0 0 rgba(37,99,235,0)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#1d4ed8";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(37,99,235,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#2563EB";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 rgba(37,99,235,0)";
            }}
          >
            Set up your company profile
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/login"
            id="hero-cta-login"
            style={{
              fontSize: "0.85rem",
              color: "#555",
              textDecoration: "none",
              letterSpacing: "-0.01em",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#888")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#555")}
          >
            I already have an account
          </Link>
        </div>

        {/* Trust micro-text */}
        <p style={{ fontSize: "0.7rem", color: "#3A3A3A", margin: "20px 0 0", letterSpacing: "0.02em" }}>
          No credit card · 6-question quiz · Results in 60 seconds
        </p>
      </div>
    </motion.div>
  );
};
