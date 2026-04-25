import { useTransform, motion, type MotionValue } from "framer-motion";

interface EntranceHeroProps {
  scrollYProgress: MotionValue<number>;
}

// Phase 1: white bg hero → fades out revealing the dark tile canvas
export const EntranceHero = ({ scrollYProgress }: EntranceHeroProps) => {
  // Container: zooms out and fades
  const scale   = useTransform(scrollYProgress, [0, 0.12], [1.18, 1.0]);
  const opacity = useTransform(scrollYProgress, [0.06, 0.14], [1, 0]);

  // Dark logo (visible on white bg) → fades out first
  const darkLogoOpacity  = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  // Light logo (EDEDED on dark bg) → fades in as bg darkens
  const lightLogoOpacity = useTransform(scrollYProgress, [0.03, 0.10], [0, 1]);

  return (
    <motion.div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scale,
        opacity,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      {/* Dark logo — shown on white */}
      <motion.div style={{ position: "absolute", opacity: darkLogoOpacity }}>
        <LogoMark textColor="#0A0A0A" subColor="#888" badgeBg="#0A0A0A" letterColor="#EDEDED" />
      </motion.div>

      {/* Light logo — shown on dark */}
      <motion.div style={{ position: "absolute", opacity: lightLogoOpacity }}>
        <LogoMark
          textColor="#EDEDED"
          subColor="#555"
          badgeBg="#EDEDED"
          letterColor="#0A0A0A"
          glow
        />
      </motion.div>
    </motion.div>
  );
};

// ─── Logo primitive ───────────────────────────────────────────────────────────
const LogoMark = ({
  textColor,
  subColor,
  badgeBg,
  letterColor,
  glow = false,
}: {
  textColor: string;
  subColor: string;
  badgeBg: string;
  letterColor: string;
  glow?: boolean;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 18,
      fontFamily: "'Inter','SF Pro Display',-apple-system,sans-serif",
    }}
  >
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: 18,
        background: badgeBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: glow ? "0 0 80px rgba(237,237,237,0.18)" : "none",
      }}
    >
      <span
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: letterColor,
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        C
      </span>
    </div>

    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          color: textColor,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        CRAB<span style={{ color: subColor }}>.AI</span>
      </div>
      <div
        style={{
          fontSize: "0.7rem",
          color: subColor,
          marginTop: 8,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        AI-Powered Business Advisor
      </div>
    </div>
  </div>
);
