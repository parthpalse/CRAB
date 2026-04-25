import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Banknote, Building2, DollarSign, Target, TrendingDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

type Answers = {
  industry?: string;
  size?: string;
  revenue?: string;
  challenge?: string;
  costConcerns: string[];
  goal?: string;
};

const TOTAL = 6;

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ costConcerns: [] });

  const progress = ((step + 1) / TOTAL) * 100;

  const canNext = useMemo(() => {
    switch (step) {
      case 0:
        return !!answers.industry;
      case 1:
        return !!answers.size;
      case 2:
        return !!answers.revenue;
      case 3:
        return !!answers.challenge;
      case 4:
        return answers.costConcerns.length > 0;
      case 5:
        return !!answers.goal;
      default:
        return false;
    }
  }, [step, answers]);

  const next = () => {
    if (step < TOTAL - 1) setStep(step + 1);
    else navigate("/dashboard");
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleConcern = (c: string) => {
    setAnswers((a) => ({
      ...a,
      costConcerns: a.costConcerns.includes(c)
        ? a.costConcerns.filter((x) => x !== c)
        : [...a.costConcerns, c],
    }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-subtle">
      {/* Header w/ progress */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
              Save & exit
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Progress value={progress} className="h-1.5" />
            <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
              Step {step + 1} of {TOTAL}
            </span>
          </div>
        </div>
      </header>

      <main className="container flex flex-1 items-center justify-center py-10">
        <Card className="w-full max-w-2xl border-border/60 shadow-elegant">
          <CardContent className="p-8 md:p-10">
            {/* Step 0: Industry */}
            {step === 0 && (
              <StepShell
                icon={Building2}
                eyebrow="About your business"
                title="What industry are you in?"
                subtitle="We'll benchmark you against companies in the same vertical."
              >
                <Select
                  value={answers.industry}
                  onValueChange={(v) => setAnswers((a) => ({ ...a, industry: v }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Retail", "SaaS", "Hospitality", "Services", "Manufacturing", "Other"].map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </StepShell>
            )}

            {/* Step 1: Size */}
            {step === 1 && (
              <StepShell
                icon={Users}
                eyebrow="Team"
                title="How big is your team?"
                subtitle="Including yourself and any contractors."
              >
                <RadioGroup
                  value={answers.size}
                  onValueChange={(v) => setAnswers((a) => ({ ...a, size: v }))}
                  className="grid gap-3"
                >
                  {["Solo", "2–10", "11–50", "51+"].map((s) => (
                    <RadioOption key={s} value={s} label={s} selected={answers.size === s} />
                  ))}
                </RadioGroup>
              </StepShell>
            )}

            {/* Step 2: Revenue */}
            {step === 2 && (
              <StepShell
                icon={DollarSign}
                eyebrow="Revenue"
                title="What's your annual revenue?"
                subtitle="Approximate range is fine."
              >
                <RadioGroup
                  value={answers.revenue}
                  onValueChange={(v) => setAnswers((a) => ({ ...a, revenue: v }))}
                  className="grid gap-3"
                >
                  {["Under €100K", "€100K – €500K", "€500K – €2M", "€2M – €10M", "€10M+"].map((r) => (
                    <RadioOption key={r} value={r} label={r} selected={answers.revenue === r} />
                  ))}
                </RadioGroup>
              </StepShell>
            )}

            {/* Step 3: Challenge */}
            {step === 3 && (
              <StepShell
                icon={TrendingDown}
                eyebrow="Challenges"
                title="What's your biggest challenge right now?"
                subtitle="Pick the one that's keeping you up at night."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { v: "Cash flow", d: "Timing of money in vs. out" },
                    { v: "Margins", d: "Profitability per sale" },
                    { v: "Growth", d: "Acquiring new customers" },
                    { v: "Costs", d: "Spending too much" },
                    { v: "Hiring", d: "Finding & keeping talent" },
                  ].map((c) => (
                    <button
                      key={c.v}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, challenge: c.v }))}
                      className={cn(
                        "rounded-xl border p-4 text-left transition-all",
                        answers.challenge === c.v
                          ? "border-primary bg-accent shadow-elegant"
                          : "border-border bg-card hover:border-primary/40 hover:bg-accent/40",
                      )}
                    >
                      <div className="font-medium text-foreground">{c.v}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{c.d}</div>
                    </button>
                  ))}
                </div>
              </StepShell>
            )}

            {/* Step 4: Cost concerns multi */}
            {step === 4 && (
              <StepShell
                icon={Banknote}
                eyebrow="Costs"
                title="Which costs concern you most?"
                subtitle="Select all that apply."
              >
                <div className="flex flex-wrap gap-2">
                  {[
                    "Suppliers",
                    "Payroll",
                    "Rent",
                    "SaaS tools",
                    "Marketing",
                    "Logistics",
                    "Taxes",
                    "Other",
                  ].map((c) => {
                    const active = answers.costConcerns.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleConcern(c)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                          active
                            ? "border-primary bg-primary text-primary-foreground shadow-elegant"
                            : "border-border bg-card text-foreground hover:border-primary/40",
                        )}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </StepShell>
            )}

            {/* Step 5: Goal */}
            {step === 5 && (
              <StepShell
                icon={Target}
                eyebrow="Goal"
                title="What's your top goal in the next 12 months?"
                subtitle="We'll tailor recommendations to this outcome."
              >
                <RadioGroup
                  value={answers.goal}
                  onValueChange={(v) => setAnswers((a) => ({ ...a, goal: v }))}
                  className="grid gap-3"
                >
                  {[
                    "Grow revenue 25%+",
                    "Improve profit margins",
                    "Extend cash runway",
                    "Reduce operating costs",
                    "Prepare to raise / sell",
                  ].map((g) => (
                    <RadioOption key={g} value={g} label={g} selected={answers.goal === g} />
                  ))}
                </RadioGroup>
              </StepShell>
            )}

            {/* Nav */}
            <div className="mt-10 flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={back} disabled={step === 0}>
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <Button
                type="button"
                onClick={next}
                disabled={!canNext}
                className="bg-gradient-primary shadow-elegant"
              >
                {step === TOTAL - 1 ? "Generate audit" : "Next"} <ArrowRight className="ml-1 h-4 w-4" />
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
    <div className="mb-6">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
    </div>
    {children}
  </div>
);

const RadioOption = ({ value, label, selected }: { value: string; label: string; selected: boolean }) => (
  <Label
    htmlFor={value}
    className={cn(
      "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all",
      selected
        ? "border-primary bg-accent shadow-elegant"
        : "border-border bg-card hover:border-primary/40 hover:bg-accent/40",
    )}
  >
    <RadioGroupItem value={value} id={value} />
    <span className="text-sm font-medium text-foreground">{label}</span>
  </Label>
);

export default Onboarding;