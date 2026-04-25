import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ROLES,
  type Role,
  saveProfile,
  type CompanyProfile,
} from "@/lib/companyProfile";

const TOTAL = 5;

const CHALLENGES = ["Cash flow", "Margins", "Growth", "Costs", "Hiring", "Retention", "Suppliers", "CAC rising"];
const GOALS = ["Grow revenue 25%+", "Improve margins", "Extend runway", "Reduce costs", "Prepare to raise / sell", "Improve retention"];

const Setup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
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
      case 0:
        return !!(companyName && industry && size && revenue && region);
      case 1:
        return !!role;
      case 2:
        return challenges.length > 0;
      case 3:
        return goals.length > 0;
      case 4:
        return initialData.trim().length > 0;
      default:
        return false;
    }
  }, [step, companyName, industry, size, revenue, region, role, challenges, goals, initialData]);

  const next = () => {
    if (step < TOTAL - 1) {
      setStep(step + 1);
      return;
    }
    const profile: CompanyProfile = {
      companyName,
      industry: industry!,
      size: size!,
      revenue: revenue!,
      region: region!,
      role: role!,
      challenges,
      goals,
      initialData,
      prompt,
      setupAt: new Date().toISOString(),
    };
    saveProfile(profile);
    navigate("/dashboard");
  };

  const back = () => step > 0 && setStep(step - 1);

  const toggle = (list: string[], setList: (v: string[]) => void, v: string) =>
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-white font-sans selection:bg-white/20">
      <header className="border-b border-[#1F1F1F] bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div 
              style={{ display: "flex", alignItems: "center", gap: "8px", transition: "opacity 0.2s", cursor: "pointer" }}
              onMouseOver={(e) => e.currentTarget.style.opacity = "0.85"}
              onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
            >
              <img src="/crab-logo.png" alt="CRAB.AI" style={{ height: "44px", width: "auto", filter: "brightness(0) invert(1)" }} />
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "16px", color: "#FFFFFF" }}>
                CRAB.AI
              </div>
            </div>
            <Link to="/" className="text-[13px] font-medium text-[#888888] hover:text-white transition-colors">
              Save & exit
            </Link>
          </div>
          <div className="mt-5 flex items-center gap-4">
            <div className="h-[2px] w-full bg-[#1F1F1F] rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <span className="whitespace-nowrap text-[13px] font-medium text-[#888888]">
              Step {step + 1} of {TOTAL}
            </span>
          </div>
        </div>
      </header>

      <main className="container flex flex-1 items-center justify-center py-12">
        <Card className="w-full max-w-2xl border border-[#1F1F1F] bg-[#111111] text-white rounded-[16px] shadow-2xl" style={{ boxShadow: "0 0 60px rgba(255,255,255,0.02)" }}>
          <CardContent className="p-8 md:p-10">
            {step === 0 && (
              <StepShell icon={Building2} eyebrow="Company profile" title="Tell us about your company" subtitle="A few basics so we can benchmark you accurately.">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cname" className="text-[#888888] text-[13px]">Company name</Label>
                    <Input id="cname" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Trading Co." className="bg-[#161616] text-white border-[#2A2A2A] rounded-[8px] focus-visible:ring-0 focus-visible:border-[#444444] px-4 py-3 h-auto outline-none" />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-[#888888] text-[13px]">Industry</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger className="bg-[#161616] text-white border-[#2A2A2A] rounded-[8px] focus:ring-0 focus:border-[#444444] px-4 py-3 h-auto outline-none"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent className="bg-[#161616] text-white border-[#2A2A2A] rounded-[8px]">
                          {["Retail", "SaaS", "Hospitality", "Services", "Manufacturing", "Other"].map((i) => (
                            <SelectItem key={i} value={i} className="focus:bg-[#1F1F1F] focus:text-white cursor-pointer rounded-md">{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#888888] text-[13px]">Team size</Label>
                      <Select value={size} onValueChange={setSize}>
                        <SelectTrigger className="bg-[#161616] text-white border-[#2A2A2A] rounded-[8px] focus:ring-0 focus:border-[#444444] px-4 py-3 h-auto outline-none"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent className="bg-[#161616] text-white border-[#2A2A2A] rounded-[8px]">
                          {["Solo", "2–10", "11–50", "51+"].map((s) => (
                            <SelectItem key={s} value={s} className="focus:bg-[#1F1F1F] focus:text-white cursor-pointer rounded-md">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#888888] text-[13px]">Annual revenue</Label>
                      <Select value={revenue} onValueChange={setRevenue}>
                        <SelectTrigger className="bg-[#161616] text-white border-[#2A2A2A] rounded-[8px] focus:ring-0 focus:border-[#444444] px-4 py-3 h-auto outline-none"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent className="bg-[#161616] text-white border-[#2A2A2A] rounded-[8px]">
                          {["Under €100K", "€100K – €500K", "€500K – €2M", "€2M – €10M", "€10M+"].map((r) => (
                            <SelectItem key={r} value={r} className="focus:bg-[#1F1F1F] focus:text-white cursor-pointer rounded-md">{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#888888] text-[13px]">Region</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger className="bg-[#161616] text-white border-[#2A2A2A] rounded-[8px] focus:ring-0 focus:border-[#444444] px-4 py-3 h-auto outline-none"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent className="bg-[#161616] text-white border-[#2A2A2A] rounded-[8px]">
                          {["Europe", "North America", "UK", "DACH", "APAC", "Other"].map((r) => (
                            <SelectItem key={r} value={r} className="focus:bg-[#1F1F1F] focus:text-white cursor-pointer rounded-md">{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </StepShell>
            )}

            {step === 1 && (
              <StepShell icon={Briefcase} eyebrow="Your role" title="What's your role in the company?" subtitle="Your dashboard will be tailored to what you actually own.">
                <div className="grid gap-4 sm:grid-cols-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={cn(
                        "rounded-[12px] border p-5 text-left transition-all duration-200 outline-none",
                        role === r.value
                          ? "border-[#444444] bg-[#161616]"
                          : "border-[#2A2A2A] bg-[#161616] hover:border-[#444444]",
                      )}
                    >
                      <div className="font-semibold text-white">{r.label}</div>
                      <div className="mt-2 text-[13px] text-[#888888] leading-relaxed">{r.blurb}</div>
                    </button>
                  ))}
                </div>
              </StepShell>
            )}

            {step === 2 && (
              <StepShell icon={TrendingDown} eyebrow="Challenges & risks" title="What challenges are you facing?" subtitle="Pick everything that applies — we prioritize accordingly.">
                <ChipGrid options={CHALLENGES} selected={challenges} onToggle={(v) => toggle(challenges, setChallenges, v)} />
              </StepShell>
            )}

            {step === 3 && (
              <StepShell icon={Target} eyebrow="Goals" title="What outcomes matter most this year?" subtitle="We'll align recommendations to these goals.">
                <ChipGrid options={GOALS} selected={goals} onToggle={(v) => toggle(goals, setGoals, v)} />
              </StepShell>
            )}

            {step === 4 && (
              <StepShell icon={ClipboardList} eyebrow="Your data" title="Add initial data & context" subtitle="Paste numbers, KPIs, or anything else worth knowing. The more you share, the sharper the report.">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="data" className="text-[#888888] text-[13px]">Numbers / KPIs</Label>
                    <Textarea
                      id="data"
                      value={initialData}
                      onChange={(e) => setInitialData(e.target.value)}
                      placeholder={"e.g.\nMonthly revenue: €98K\nGross margin: 21%\nHeadcount: 14\nTop 3 costs: payroll, suppliers, SaaS"}
                      className="min-h-[140px] bg-[#161616] text-white border-[#2A2A2A] rounded-[8px] focus-visible:ring-0 focus-visible:border-[#444444] px-4 py-3 outline-none resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prompt" className="text-[#888888] text-[13px]">Anything else? (optional)</Label>
                    <Textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Tell us about pressing situations, recent changes, or what you'd like CRAB.AI to focus on…"
                      className="min-h-[100px] bg-[#161616] text-white border-[#2A2A2A] rounded-[8px] focus-visible:ring-0 focus-visible:border-[#444444] px-4 py-3 outline-none resize-none"
                    />
                  </div>
                  <div className="flex items-start gap-3 rounded-[8px] border border-[#1F1F1F] bg-[#161616] p-4 text-[13px] text-[#888888] leading-relaxed">
                    <Banknote className="mt-0.5 h-5 w-5 text-white shrink-0" />
                    Your data stays on this device for now. We'll regenerate the report each month based on what you add.
                  </div>
                </div>
              </StepShell>
            )}

            <div className="mt-12 flex items-center justify-between pt-6 border-t border-[#1F1F1F]">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={back} 
                disabled={step === 0}
                className="text-[#888888] hover:text-white hover:bg-transparent px-0 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button 
                type="button" 
                onClick={next} 
                disabled={!canNext} 
                className="bg-white text-black hover:bg-white hover:scale-[1.02] transition-all rounded-[8px] font-semibold h-11 px-6 disabled:opacity-50 disabled:hover:scale-100"
              >
                {step === TOTAL - 1 ? "Generate report" : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

const StepShell = ({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="mb-8">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#161616] border border-[#2A2A2A] text-white">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888] mb-3">{eyebrow}</p>
      <h2 className="text-3xl font-bold tracking-tight text-white mb-2">{title}</h2>
      <p className="text-[15px] text-[#888888]">{subtitle}</p>
    </div>
    {children}
  </div>
);

const ChipGrid = ({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) => (
  <div className="flex flex-wrap gap-3">
    {options.map((c) => {
      const active = selected.includes(c);
      return (
        <button
          key={c}
          type="button"
          onClick={() => onToggle(c)}
          className={cn(
            "rounded-full border px-5 py-2.5 text-[14px] font-medium transition-all duration-200 outline-none",
            active
              ? "border-white bg-white text-black"
              : "border-[#2A2A2A] bg-[#161616] text-[#888888] hover:border-[#444444] hover:text-white",
          )}
        >
          {c}
        </button>
      );
    })}
  </div>
);

export default Setup;