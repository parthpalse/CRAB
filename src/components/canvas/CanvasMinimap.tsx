import { useTransform, type MotionValue, motion } from "framer-motion";

interface MinimapProps {
  cameraX: MotionValue<number>;
  cameraY: MotionValue<number>;
  onNavigate: (section: "A" | "B" | "C") => void;
  sectionBY: number;
}

export const CanvasMinimap = ({ cameraX, cameraY, onNavigate, sectionBY }: MinimapProps) => {
  const dotA = useTransform([cameraX, cameraY], ([x, y]) =>
    (x as number) < 50 && (y as number) < sectionBY / 2 ? 1 : 0.25
  );
  const dotB = useTransform([cameraX, cameraY], ([x, y]) =>
    (x as number) < 50 && (y as number) >= sectionBY / 2 ? 1 : 0.25
  );
  const dotC = useTransform(cameraX, (x) => (x > 50 ? 1 : 0.25));

  const dotStyle = (opacity: MotionValue<number>, label: string, section: "A" | "B" | "C") => (
    <motion.button
      onClick={() => onNavigate(section)}
      title={`Go to section ${section}`}
      aria-label={`Navigate to section ${section}: ${label}`}
      style={{
        all: "unset",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <motion.div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#EDEDED",
          opacity,
          boxShadow: "0 0 8px rgba(237,237,237,0.6)",
        }}
      />
      <motion.span
        style={{
          fontSize: 9,
          color: "#888",
          opacity,
          letterSpacing: "0.06em",
          fontFamily: "inherit",
        }}
      >
        {label}
      </motion.span>
    </motion.button>
  );

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "14px 12px",
        backdropFilter: "blur(10px)",
      }}
    >
      {dotStyle(dotA, "Pitch", "A")}
      {/* connector */}
      <div style={{ width: 1, height: 10, background: "rgba(255,255,255,0.1)" }} />
      {dotStyle(dotB, "CTA", "B")}
      {/* connector */}
      <div style={{ width: 1, height: 10, background: "rgba(255,255,255,0.1)" }} />
      {dotStyle(dotC, "Form", "C")}
    </div>
  );
};
