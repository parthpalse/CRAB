import { Link } from "react-router-dom";
import { Activity, ArrowRight, BarChart3, CheckCircle2, ListChecks, ShieldCheck, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/Logo";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild size="sm">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-primary shadow-elegant">
              <Link to="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(60% 50% at 50% 0%, hsl(0 0% 0% / 0.06) 0%, transparent 70%), linear-gradient(180deg, hsl(0 0% 99%) 0%, hsl(0 0% 96%) 100%)",
          }}
        />
        <div className="container py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Replaces a €5,000 consultant — in minutes
            </div>
            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl">
              AI-Powered Business Advisor for{" "}
              <span className="text-muted-foreground">Small Businesses</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Get a forensic audit of your finances, costs, and growth levers. CRAB.AI diagnoses what's leaking value and
              tells you exactly how to fix it — prioritized by savings and urgency.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-gradient-primary shadow-elegant hover:shadow-glow">
                <Link to="/setup">
                  Set up your company profile <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/login">I already have an account</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">No credit card · 6-question quiz · Results in 60 seconds</p>
          </div>
        </div>

        {/* Trust strip */}
        <div className="border-y border-border/60 bg-card/40">
          <div className="container grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
            {[
              { k: "2,400+", v: "Audits delivered" },
              { k: "€18M", v: "Annual savings surfaced" },
              { k: "94%", v: "Recommend to a peer" },
              { k: "60s", v: "Average time to insight" },
            ].map((s) => (
              <div key={s.v} className="text-center">
                <div className="font-display text-2xl font-bold text-foreground md:text-3xl">{s.k}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">What you get</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            A consulting engagement, condensed.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Activity,
              title: "Diagnose",
              body: "A 360° health score across revenue, margins, costs, and runway — with clear benchmarks.",
            },
            {
              icon: ListChecks,
              title: "Prioritize",
              body: "Every recommendation ranked by urgency and projected annual savings — no fluff.",
            },
            {
              icon: Target,
              title: "Save",
              body: "Turn insight into action. Average client surfaces €24,000 of recoverable margin.",
            },
          ].map((f) => (
            <Card key={f.title} className="border-border/60 shadow-card transition-shadow hover:shadow-elegant">
              <CardContent className="p-8">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-subtle py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">Three steps to clarity</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", icon: ShieldCheck, t: "Quick quiz", d: "Tell us about your industry, size, and biggest challenges." },
              { n: "02", icon: BarChart3, t: "AI analysis", d: "We benchmark you against thousands of comparable businesses." },
              { n: "03", icon: CheckCircle2, t: "Action plan", d: "Get a prioritized list of fixes with projected annual savings." },
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-border bg-card p-7 shadow-card">
                <div className="font-display text-xs font-bold tracking-wider text-primary">{s.n}</div>
                <s.icon className="mt-4 h-6 w-6 text-foreground" />
                <h3 className="mt-4 font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-gradient-primary shadow-elegant hover:shadow-glow">
              <Link to="/setup">
                Start your free audit <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <Logo />
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CRAB.AI · Built for operators</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;