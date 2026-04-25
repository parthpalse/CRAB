import { motion, useTransform, type MotionValue } from "framer-motion";
import { Activity, ListChecks, TrendingUp, Zap, BarChart3, Sparkles } from "lucide-react";
import { GlassTile } from "./GlassTile";

// ─── Layout matching reference: 2 / 3 / 1 tile rows ─────────────────────────
// World canvas: 1200×700
// Row 1 (y=0,   h=260): 2 tiles — Diagnose 480w, Prioritize 700w
// Row 2 (y=280, h=220): 3 equal tiles — Speed, Save, €18M  each ~386w
// Row 3 (y=520, h=180): 1 full-width tile — Setup 1200w
const GAP = 20;

const WORLD_TILES = [
  // Row 1 — 2 tiles
  { icon: Activity, label: "Diagnose", sub: "360° health score", colSpan: "col-span-1" },
  { icon: ListChecks, label: "Prioritize", sub: "Ranked by savings", colSpan: "col-span-1" },
  // Row 2 — 3 equal tiles
  { icon: Zap, label: "Speed", sub: "60-second insight", colSpan: "col-span-1" },
  { icon: TrendingUp, label: "Save", sub: "€24K avg recovery", colSpan: "col-span-1" },
  { icon: BarChart3, label: "€18M", sub: "Savings surfaced", colSpan: "col-span-1" },
  // Row 3 — 1 full-width tile
  { icon: Sparkles, label: "Setup", sub: "6 questions to start", colSpan: "col-span-1" },
] as const;

// ─── Camera constants ─────────────────────────────────────────────────────────
// MACRO_SCALE=0.62 → grid renders at ~744×434px on screen (~44% of 1707px width)
const MACRO_SCALE = 0.62;

// Grid centre (average of all 6 tile centres)
// CX: (240+850+193+599+1006+600)/6 ≈ 581
// CY: (130+130+390+390+390+610)/6  ≈ 340
const GRID_CX = 581;
const GRID_CY = 340;

// T0 zoom target (Diagnose tile centre)
const T0_CX = 240;  // 0 + 480/2
const T0_CY = 130;  // 0 + 260/2

interface GridCameraProps {
  scrollYProgress: MotionValue<number>;
}

export const GridCamera = ({ scrollYProgress }: GridCameraProps) => {
  // Zoom window: grid macro → zoom into T0 during [0.22, 0.34]
  const worldX = useTransform(scrollYProgress, (v) => {
    const W = window.innerWidth;
    const macroX = W / 2 - GRID_CX * MACRO_SCALE;
    const zoomX = W / 2 - T0_CX;
    if (v <= 0.22) return macroX;
    if (v >= 0.34) return zoomX;
    const t = (v - 0.22) / 0.12;
    return macroX + (zoomX - macroX) * t;
  });

  const worldY = useTransform(scrollYProgress, (v) => {
    const H = window.innerHeight;
    const macroY = H / 2 - GRID_CY * MACRO_SCALE;
    const zoomY = H / 2 - T0_CY;
    if (v <= 0.22) return macroY;
    if (v >= 0.34) return zoomY;
    const t = (v - 0.22) / 0.12;
    return macroY + (zoomY - macroY) * t;
  });

  // Scale: MACRO_SCALE during grid reveal, zooms to 1.0 during Phase 3
  const worldScale = useTransform(
    scrollYProgress,
    [0.12, 0.22, 0.34],
    [MACRO_SCALE, MACRO_SCALE, 1.0]
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        transformOrigin: "0 0",
        x: worldX,
        y: worldY,
        scale: worldScale,
        willChange: "transform",
        display: "flex",
        flexDirection: "column",
        gap: "1rem", // gap-4
        padding: "1rem", // p-4
        boxSizing: "border-box",
      }}
    >
      {/* Row 1 */}
      <div className="grid grid-cols-2 gap-4 flex-1 w-full min-h-0">
        {WORLD_TILES.slice(0, 2).map((tile, i) => (
          <GlassTile
            key={tile.label}
            style={{
              width: "100%",
              height: "100%",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            glow={i === 0}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  marginBottom: 14,
                }}
              >
                <tile.icon size={16} color="#EDEDED" />
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#EDEDED", letterSpacing: "-0.02em" }}>
                {tile.label}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#555", marginTop: 5 }}>
                {tile.sub}
              </div>
            </div>
            {i === 0 && <MiniHealthBars />}
            {i === 1 && <MiniPriorityList />}
          </GlassTile>
        ))}
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-4 flex-1 w-full min-h-0">
        {WORLD_TILES.slice(2, 5).map((tile, i) => (
          <GlassTile
            key={tile.label}
            style={{
              width: "100%",
              height: "100%",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  marginBottom: 14,
                }}
              >
                <tile.icon size={16} color="#EDEDED" />
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#EDEDED", letterSpacing: "-0.02em" }}>
                {tile.label}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#555", marginTop: 5 }}>
                {tile.sub}
              </div>
            </div>
            {i === 0 && <MiniStat value="60s" label="time to insight" />}
            {i === 1 && <MiniStat value="€24K" label="avg annual savings" />}
            {i === 2 && <MiniStat value="€18M" label="total surfaced" />}
          </GlassTile>
        ))}
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 gap-4 flex-1 w-full min-h-0">
        {WORLD_TILES.slice(5, 6).map((tile) => (
          <GlassTile
            key={tile.label}
            style={{
              width: "100%",
              height: "100%",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  marginBottom: 14,
                }}
              >
                <tile.icon size={16} color="#EDEDED" />
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#EDEDED", letterSpacing: "-0.02em" }}>
                {tile.label}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#555", marginTop: 5 }}>
                {tile.sub}
              </div>
            </div>
            <MiniStat value="6" label="questions to start" />
          </GlassTile>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Mini card visuals ─────────────────────────────────────────────────────────
const MiniBar = ({ pct }: { pct: number }) => (
  <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1, overflow: "hidden", marginBottom: 7 }}>
    <div style={{ width: `${pct}%`, height: "100%", background: "#EDEDED", borderRadius: 1 }} />
  </div>
);
const MiniHealthBars = () => (
  <div>{[82, 51, 67, 74].map((p) => <MiniBar key={p} pct={p} />)}</div>
);
const MiniPriorityList = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {["Supplier costs", "SaaS overlap", "Payroll timing"].map((l, i) => (
      <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "0.62rem", fontWeight: 700, color: ["#EDEDED", "#888", "#555"][i] }}>
          0{i + 1}
        </span>
        <span style={{ fontSize: "0.68rem", color: "#666" }}>{l}</span>
      </div>
    ))}
  </div>
);
const MiniStat = ({ value, label }: { value: string; label: string }) => (
  <div>
    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#EDEDED", letterSpacing: "-0.03em" }}>{value}</div>
    <div style={{ fontSize: "0.65rem", color: "#555", marginTop: 3 }}>{label}</div>
  </div>
);
