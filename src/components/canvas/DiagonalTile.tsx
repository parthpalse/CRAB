import { useTransform, motion, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";

// ─── Track starts at 0.44 — after macro grid crossfades out ──────────────────
const TILE_CONFIG = [
  { es: 0.44, as: 0.52, ae: 0.62, xe: 0.70, first: true,  last: false },
  { es: 0.56, as: 0.64, ae: 0.74, xe: 0.82, first: false, last: false },
  { es: 0.68, as: 0.76, ae: 0.85, xe: 0.92, first: false, last: false },
  { es: 0.78, as: 0.85, ae: 0.93, xe: 1.00, first: false, last: false },
  { es: 0.87, as: 0.93, ae: 1.00, xe: 1.00, first: false, last: true  },
] as const;

const DX = 700;
const DY = 500;

interface DiagonalTileProps {
  index: 0 | 1 | 2 | 3 | 4;
  scrollYProgress: MotionValue<number>;
  asymOffset?: { x: number; y: number };
  children: ReactNode;
}

export const DiagonalTile = ({
  index,
  scrollYProgress,
  asymOffset = { x: 0, y: 0 },
  children,
}: DiagonalTileProps) => {
  const { es, as: aStart, ae, xe, first, last } = TILE_CONFIG[index];
  const ax = asymOffset.x;
  const ay = asymOffset.y;

  const keys = first ? [es, aStart, ae, xe] : last ? [es, aStart, ae] : [es, aStart, ae, xe];

  const xOut = first
    ? [ax, ax, ax, -DX + ax]
    : last
    ? [DX + ax, ax, ax]
    : [DX + ax, ax, ax, -DX + ax];

  const yOut = first
    ? [ay, ay, ay, -DY + ay]
    : last
    ? [DY + ay, ay, ay]
    : [DY + ay, ay, ay, -DY + ay];

  // T0 (first): subtle scale-up on emerge; all others slide in/out at full scale
  const scaleOut = first ? [0.92, 1.0, 1.0, 0.92] : last ? [0.92, 1.0, 1.0] : [0.92, 1.0, 1.0, 0.92];

  const x     = useTransform(scrollYProgress, keys, xOut);
  const y     = useTransform(scrollYProgress, keys, yOut);
  const scale = useTransform(scrollYProgress, keys, scaleOut);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        translateX: "-50%",
        translateY: "-50%",
        x, y, scale,
        willChange: "transform",
        zIndex: 10,
      }}
    >
      {children}
    </motion.div>
  );
};
