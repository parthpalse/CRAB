import { motion, type MotionProps } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

interface GlassTileProps extends MotionProps {
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  accent?: boolean;        // lighter CTA variant
  glow?: boolean;          // subtle ambient glow ring
  style?: CSSProperties;
  className?: string;
}

export const GlassTile = ({
  children,
  width,
  height,
  accent = false,
  glow = false,
  style,
  className,
  ...motionProps
}: GlassTileProps) => {
  const base: CSSProperties = {
    position: "relative",
    width: width ?? "auto",
    height: height ?? "auto",
    background: accent ? "rgba(42,42,42,1)" : "rgba(26,26,26,1)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    overflow: "hidden",
    ...style,
  };

  return (
    <motion.div style={base} className={className} {...motionProps}>
      {/* subtle inner highlight on top edge */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 20,
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />
      {/* optional ambient glow ring */}
      {glow && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: -1,
            borderRadius: 22,
            boxShadow: "0 0 40px 4px rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
        {children}
      </div>
    </motion.div>
  );
};
