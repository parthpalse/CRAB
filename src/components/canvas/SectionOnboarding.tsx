import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Briefcase,
  Building2,
  ClipboardList,
  Target,
  TrendingDown,
} from "lucide-react";
import { ROLES, type Role, saveProfile, type CompanyProfile } from "@/lib/companyProfile";
import { GlassTile } from "./GlassTile";

interface SectionOnboardingProps {
  onBack: () => void;
}

const TOTAL = 5;
const CHALLENGES = ["Cash flow", "Margins", "Growth", "Costs", "Hiring", "Retention", "Suppliers", "CAC rising"];
const GOALS = ["Grow revenue 25%+", "Improve margins", "Extend runway", "Reduce costs", "Prepare to raise / sell", "Improve retention"];

// --- Reusable micro-components styled for the dark canvas ---

const CanvasInput = ({
  id,
  value,
  onChange,
  placeholder,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <input
    id={id}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      width: "100%",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10,
      padding: "12px 14px",
      color: "#EDEDED",
      fontSize: "0.875rem",
      outline: "none",
      boxSizing: "border-box",
      fontFamily: "inherit",
    }}
    onFocus={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
    }}
    onBlur={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
    }}
  />
);

const CanvasTextarea = ({
  id,
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) => (
  <textarea
    id={id}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    style={{
      width: "100%",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10,
      padding: "12px 14px",
      color: "#EDEDED",
      fontSize: "0.875rem",
      outline: "none",
      resize: "vertical",
      boxSizing: "border-box",
      fontFamily: "inherit",
    }}
    onFocus={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
    }}
    onBlur={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
    }}
  />
);

const CanvasSelect = ({
  value,
  onChange,
  placeholder,
  options,
}: {
  value?: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) => (
  <select
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    style={{
      width: "100%",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10,
      padding: "12px 14px",
      color: value ? "#EDEDED" : "#555",
      fontSize: "0.875rem",
      outline: "none",
      cursor: "pointer",
      fontFamily: "inherit",
      appearance: "none",
    }}
  >
    <option value="" disabled style={{ background: "#1A1A1A", color: "#555" }}>
      {placeholder}
    </option>
    {options.map((o) => (
      <option key={o} value={o} style={{ background: "#1A1A1A", color: "#EDEDED" }}>
        {o}
      </option>
    ))}
  </select>
);

const ChoiceButton = ({
  label,
  sublabel,
  selected,
  onClick,
}: {
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    style={{
      background: selected ? "rgba(237,237,237,0.08)" : "rgba(255,255,255,0.02)",
      border: selected ? "1px solid rgba(237,237,237,0.25)" : "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
      padding: "14px 16px",
      cursor: "pointer",
      textAlign: "left",
      color: "#EDEDED",
      fontFamily: "inherit",
      transition: "border-color 0.15s, background 0.15s",
    }}
  >
    <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{label}</div>
    {sublabel && <div style={{ fontSize: "0.75rem", color: "#555", marginTop: 2 }}>{sublabel}</div>}
  </motion.button>
);

const ChipButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    style={{
      background: active ? "rgba(237,237,237,0.12)" : "rgba(255,255,255,0.03)",
      border: active ? "1px solid rgba(237,237,237,0.3)" : "1px solid rgba(255,255,255,0.07)",
      borderRadius: 999,
      padding: "8px 18px",
      fontSize: "0.8rem",
      color: active ? "#EDEDED" : "#666",
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all 0.15s",
    }}
  >
    {label}
  </motion.button>
);

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label
    htmlFor={htmlFor}
    style={{ fontSize: "0.75rem", color: "#666", letterSpacing: "0.04em", display: "block", marginBottom: 8 }}
  >
    {children}
  </label>
);

const ProgressBar = ({ value }: { value: number }) => (
  <div
    style={{
      width: "100%",
      height: 2,
      background: "rgba(255,255,255,0.06)",
      borderRadius: 1,
      overflow: "hidden",
    }}
  >
    <motion.div
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ height: "100%", background: "#EDEDED", borderRadius: 1 }}
    />
  </div>
);

// Page wrapper with slide animation
const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 24 : -24 }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? -24 : 24 }),
};

export const SectionOnboarding = ({ onBack }: SectionOnboardingProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState<string>();
  const [size, setSize] = useState<string>();
  const [revenue, setRevenue] = useState<string>();
  const [region, setRegion] = useState<string>();
  const [role, setRole] = useState<Role | undefined>();
  const [challenges, setChallenges] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [initialData, setInitialData] = useState("");
  const [prompt, setPrompt] = useState("");

  const progress = ((step + 1) / TOTAL) * 100;

  const canNext = useMemo(() => {
    switch (step) {
      case 0: return !!(companyName && industry && size && revenue && region);
      case 1: return !!role;
      case 2: return challenges.length > 0;
      case 3: return goals.length > 0;
      case 4: return initialData.trim().length > 0;
      default: return false;
    }
  }, [step, companyName, industry, size, revenue, region, role, challenges, goals, initialData]);

  const goNext = () => {
    if (step < TOTAL - 1) { setDir(1); setStep(step + 1); return; }
    const profile: CompanyProfile = {
      companyName, industry: industry!, size: size!, revenue: revenue!,
      region: region!, role: role!, challenges, goals, initialData, prompt,
      setupAt: new Date().toISOString(),
    };
    saveProfile(profile);
    navigate("/dashboard");
  };

  const goBack = () => {
    if (step > 0) { setDir(-1); setStep(step - 1); } else { onBack(); }
  };

  const toggle = (list: string[], setList: (v: string[]) => void, v: string) =>
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const ICONS = [Building2, Briefcase, TrendingDown, Target, ClipboardList];
  const CurIcon = ICONS[step];

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 24px",
        boxSizing: "border-box",
        gap: 24,
      }}
    >
      {/* Back button */}
      <div
        style={{ width: "min(640px, 90vw)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <button
          onClick={goBack}
          style={{
            background: "none",
            border: "none",
            color: "#555",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.8rem",
            fontFamily: "inherit",
            padding: 0,
          }}
        >
          <ArrowLeft size={14} /> {step === 0 ? "Back to pitch" : "Back"}
        </button>
        <span style={{ fontSize: "0.75rem", color: "#444" }}>
          Step {step + 1} of {TOTAL}
        </span>
      </motion.div>

      {/* Modal Container */}
      <motion.div
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 18 }}
        style={{
          width: "min(640px, 90vw)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {/* Progress bar at very top */}
        <ProgressBar value={progress} />

        <div style={{ padding: "32px 36px 36px", display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Step header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(255,255,255,0.06)",
                flexShrink: 0,
              }}
            >
              <CurIcon size={18} color="#EDEDED" />
            </div>
            <div>
              <p style={{ fontSize: 10, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>
                {["Company profile", "Your role", "Challenges", "Goals", "Your data"][step]}
              </p>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#EDEDED", margin: 0, letterSpacing: "-0.02em" }}>
                {[
                  "Tell us about your company",
                  "What's your role?",
                  "What challenges are you facing?",
                  "What outcomes matter most?",
                  "Add your initial data",
                ][step]}
              </h2>
            </div>
          </div>

          {/* Step content — slides between steps */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              {/* STEP 0 — Company basics */}
              {step === 0 && (
                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <Label htmlFor="cname">Company name</Label>
                    <CanvasInput id="cname" value={companyName} onChange={setCompanyName} placeholder="Acme Trading Co." />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <Label>Industry</Label>
                      <CanvasSelect value={industry} onChange={setIndustry} placeholder="Select" options={["Retail","SaaS","Hospitality","Services","Manufacturing","Other"]} />
                    </div>
                    <div>
                      <Label>Team size</Label>
                      <CanvasSelect value={size} onChange={setSize} placeholder="Select" options={["Solo","2–10","11–50","51+"]} />
                    </div>
                    <div>
                      <Label>Annual revenue</Label>
                      <CanvasSelect value={revenue} onChange={setRevenue} placeholder="Select" options={["Under €100K","€100K – €500K","€500K – €2M","€2M – €10M","€10M+"]} />
                    </div>
                    <div>
                      <Label>Region</Label>
                      <CanvasSelect value={region} onChange={setRegion} placeholder="Select" options={["Europe","North America","UK","DACH","APAC","Other"]} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1 — Role */}
              {step === 1 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {ROLES.map((r) => (
                    <ChoiceButton
                      key={r.value}
                      label={r.label}
                      sublabel={r.blurb}
                      selected={role === r.value}
                      onClick={() => setRole(r.value)}
                    />
                  ))}
                </div>
              )}

              {/* STEP 2 — Challenges */}
              {step === 2 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {CHALLENGES.map((c) => (
                    <ChipButton
                      key={c}
                      label={c}
                      active={challenges.includes(c)}
                      onClick={() => toggle(challenges, setChallenges, c)}
                    />
                  ))}
                </div>
              )}

              {/* STEP 3 — Goals */}
              {step === 3 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {GOALS.map((g) => (
                    <ChipButton
                      key={g}
                      label={g}
                      active={goals.includes(g)}
                      onClick={() => toggle(goals, setGoals, g)}
                    />
                  ))}
                </div>
              )}

              {/* STEP 4 — Data */}
              {step === 4 && (
                <div style={{ display: "grid", gap: 14 }}>
                  <div>
                    <Label htmlFor="kpis">Numbers / KPIs</Label>
                    <CanvasTextarea
                      id="kpis"
                      value={initialData}
                      onChange={setInitialData}
                      rows={5}
                      placeholder={"e.g.\nMonthly revenue: €98K\nGross margin: 21%\nHeadcount: 14\nTop 3 costs: payroll, suppliers, SaaS"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="extra">Anything else? (optional)</Label>
                    <CanvasTextarea
                      id="extra"
                      value={prompt}
                      onChange={setPrompt}
                      rows={3}
                      placeholder="Tell us about pressing situations or what you'd like CRAB.AI to focus on…"
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: 10,
                      padding: "10px 14px",
                    }}
                  >
                    <Banknote size={14} color="#555" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: "0.72rem", color: "#555", margin: 0, lineHeight: 1.6 }}>
                      Your data stays on this device. We regenerate the report monthly based on what you add.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <motion.button
              onClick={goNext}
              disabled={!canNext}
              whileHover={canNext ? { scale: 1.03 } : {}}
              whileTap={canNext ? { scale: 0.97 } : {}}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: canNext ? "#EDEDED" : "rgba(255,255,255,0.05)",
                color: canNext ? "#0A0A0A" : "#444",
                border: "none",
                borderRadius: 10,
                padding: "12px 22px",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: canNext ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                transition: "background 0.2s, color 0.2s",
              }}
              id={`onboarding-next-step-${step}`}
            >
              {step === TOTAL - 1 ? "Generate report" : "Next"}
              <ArrowRight size={15} />
            </motion.button>
          </div>
        </div>
      </GlassTile>
    </div>
  );
};
