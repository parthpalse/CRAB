import { Activity, Banknote, ListChecks, TrendingUp, Zap } from "lucide-react";
import { GlassTile } from "./GlassTile";

// ─── Shared primitives ────────────────────────────────────────────────────────
const Eyebrow = ({ label }: { label: string }) => (
  <p
    style={{
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#555",
      margin: "0 0 10px",
    }}
  >
    {label}
  </p>
);

const Headline = ({ children }: { children: React.ReactNode }) => (
  <h2
    style={{
      fontSize: "1.5rem",
      fontWeight: 700,
      color: "#EDEDED",
      letterSpacing: "-0.03em",
      lineHeight: 1.2,
      margin: "0 0 12px",
    }}
  >
    {children}
  </h2>
);

const Body = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: "0.825rem", color: "#666", lineHeight: 1.7, margin: 0 }}>
    {children}
  </p>
);

const IconBadge = ({ icon: Icon }: { icon: React.ComponentType<{ size?: number; color?: string }> }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 44,
      height: 44,
      borderRadius: 14,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.07)",
      marginBottom: 20,
    }}
  >
    <Icon size={20} color="#EDEDED" />
  </div>
);

const Divider = () => (
  <div
    style={{
      height: 1,
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
      margin: "20px 0",
    }}
  />
);

// ─── Tile 0: Diagnose ─────────────────────────────────────────────────────────
const BAR_DATA = [
  { label: "Revenue Health",  pct: 82, color: "#EDEDED" },
  { label: "Gross Margin",    pct: 51, color: "#888" },
  { label: "Cost Efficiency", pct: 67, color: "#EDEDED" },
  { label: "Cash Runway",     pct: 74, color: "#888" },
];

export const TileDiagnose = () => (
  <GlassTile 
    viewport={{ once: true, margin: "0px" }}
    style={{ padding: "36px 40px", width: 480 }}
  >
    <IconBadge icon={Activity} />
    <Eyebrow label="Phase 01 — Diagnose" />
    <Headline>360° business health analysis</Headline>
    <Body>
      A forensic audit across revenue, margins, costs, and runway.
      Every dimension benchmarked against your sector.
    </Body>
    <Divider />
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {BAR_DATA.map(({ label, pct, color }) => (
        <div key={label}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: "0.72rem", color: "#666" }}>{label}</span>
            <span style={{ fontSize: "0.72rem", color, fontWeight: 600 }}>{pct}%</span>
          </div>
          <div
            style={{
              height: 3,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${color}44, ${color})`,
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </GlassTile>
);

// ─── Tile 1: Prioritize ───────────────────────────────────────────────────────
const PRIORITIES = [
  { rank: "01", severity: "#EDEDED", label: "Renegotiate supplier contracts", saving: "+€8,400/yr" },
  { rank: "02", severity: "#888",    label: "Cancel 3 redundant SaaS tools",  saving: "+€3,200/yr" },
  { rank: "03", severity: "#555",    label: "Optimise payroll scheduling",     saving: "+€2,800/yr" },
];

export const TilePrioritize = () => (
  <GlassTile 
    viewport={{ once: true, margin: "0px" }}
    style={{ padding: "36px 40px", width: 480 }}
  >
    <IconBadge icon={ListChecks} />
    <Eyebrow label="Phase 02 — Prioritize" />
    <Headline>Ranked by urgency & savings</Headline>
    <Body>No fluff — every recommendation sorted by projected annual impact.</Body>
    <Divider />
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {PRIORITIES.map(({ rank, severity, label, saving }) => (
        <div
          key={rank}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "12px 16px",
            background: "rgba(255,255,255,0.025)",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: severity, letterSpacing: "0.06em", flexShrink: 0 }}>
            {rank}
          </span>
          <span style={{ fontSize: "0.8rem", color: "#888", flex: 1 }}>{label}</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#EDEDED", flexShrink: 0 }}>{saving}</span>
        </div>
      ))}
    </div>
  </GlassTile>
);

// ─── Tile 2: Save ─────────────────────────────────────────────────────────────
export const TileSave = () => (
  <GlassTile 
    viewport={{ once: true, margin: "0px" }}
    style={{ padding: "36px 40px", width: 480 }}
  >
    <IconBadge icon={TrendingUp} />
    <Eyebrow label="Phase 03 — Save" />
    <Headline>Turn insight into recovered margin</Headline>
    <Body>
      Identify what's leaking value, fix it, and measure the impact —
      month over month.
    </Body>
    <Divider />
    <div style={{ display: "flex", gap: 24, alignItems: "stretch" }}>
      {[
        { stat: "€24K",  label: "Avg. annual savings" },
        { stat: "2,400+", label: "Audits delivered" },
        { stat: "94%",   label: "Recommend to peers" },
      ].map(({ stat, label }) => (
        <div
          key={label}
          style={{
            flex: 1,
            padding: "16px 14px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.05)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#EDEDED", letterSpacing: "-0.03em" }}>
            {stat}
          </div>
          <div style={{ fontSize: "0.65rem", color: "#555", marginTop: 5, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {label}
          </div>
        </div>
      ))}
    </div>
    <div
      style={{
        marginTop: 20,
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "12px 14px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 10,
      }}
    >
      <Banknote size={14} color="#555" style={{ flexShrink: 0, marginTop: 2 }} />
      <p style={{ fontSize: "0.72rem", color: "#555", margin: 0, lineHeight: 1.6 }}>
        Average client surfaces recoverable margin in the first audit cycle — ranked by urgency.
      </p>
    </div>
  </GlassTile>
);

// ─── Tile 3: Speed ────────────────────────────────────────────────────────────
export const TileSpeed = () => (
  <GlassTile 
    viewport={{ once: true, margin: "0px" }}
    style={{ padding: "36px 40px", width: 480 }}
  >
    <IconBadge icon={Zap} />
    <Eyebrow label="Phase 04 — Speed" />
    <Headline>Consultant-grade insight in 60 seconds</Headline>
    <Body>
      Six questions. One minute. Replaces a €5,000 engagement — no scheduling,
      no slides, no waiting.
    </Body>
    <Divider />
    <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <span style={{ fontSize: "1.8rem", fontWeight: 700, color: "#EDEDED", letterSpacing: "-0.04em" }}>60</span>
        <span style={{ fontSize: "0.6rem", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>seconds</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {["No credit card required", "6-question quiz", "Immediate action plan", "No consultant fee"].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#EDEDED", flexShrink: 0 }} />
            <span style={{ fontSize: "0.78rem", color: "#888" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  </GlassTile>
);
