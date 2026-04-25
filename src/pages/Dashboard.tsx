import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Download,
  Lightbulb,
  PlusCircle,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Wrench,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import {
  healthScore,
  kpis,
  monthlyFinancials,
  profitTrend,
  type Urgency,
} from "@/data/mockAudit";
import {
  currentMonthKey,
  loadMonthlyEntries,
  loadProfile,
  monthLabel,
  recentMonthKeys,
  ROLES,
} from "@/lib/companyProfile";
import { getReportForRole } from "@/data/roleReports";

const scoreColor = (s: number) => {
  if (s >= 75) return "hsl(var(--foreground))";
  if (s >= 50) return "hsl(var(--primary-glow))";
  return "hsl(var(--muted-foreground))";
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const profile = loadProfile();
  const entries = loadMonthlyEntries();

  useEffect(() => {
    if (!profile) navigate("/setup");
  }, [profile, navigate]);

  const initialMonth = searchParams.get("month") ?? currentMonthKey();
  const [month, setMonth] = useState(initialMonth);

  const onMonthChange = (m: string) => {
    setMonth(m);
    setSearchParams({ month: m });
  };

  const monthOptions = useMemo(() => {
    const keys = new Set<string>([currentMonthKey(), ...recentMonthKeys(6), ...entries.map((e) => e.month)]);
    return Array.from(keys).sort((a, b) => (a < b ? 1 : -1));
  }, [entries]);

  if (!profile) return null;

  const report = getReportForRole(profile.role);
  const roleLabel = ROLES.find((r) => r.value === profile.role)?.label ?? profile.role;
  const score = healthScore.score;
  const ringColor = scoreColor(score);

  return (
    <div className="min-h-screen bg-gradient-subtle font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-4">
            <Logo />
            <div className="hidden h-6 w-px bg-border md:block" />
            <div className="hidden min-w-0 md:block">
              <div className="truncate text-sm font-semibold leading-tight">{profile.companyName}</div>
              <div className="truncate text-xs text-muted-foreground">
                {profile.industry} · {profile.size} · {profile.region}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/data"><PlusCircle className="h-4 w-4" /> Add data</Link>
            </Button>
            <Button size="sm" variant="ghost" className="hidden sm:inline-flex">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>
      </header>

      <main className="container space-y-6 py-8">
        {/* Title & controls */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-accent text-accent-foreground hover:bg-accent">
                <Briefcase className="h-3 w-3" /> {roleLabel}
              </Badge>
              <Badge variant="outline" className="border-border text-muted-foreground">
                Report · {monthLabel(month)}
              </Badge>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              {report.headline}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">{report.focus}</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={month} onValueChange={onMonthChange}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {monthOptions.map((k) => (
                  <SelectItem key={k} value={k}>{monthLabel(k)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild className="bg-gradient-primary shadow-elegant">
              <Link to="/data"><Sparkles className="h-4 w-4" /> Generate report</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="h-auto flex-wrap justify-start gap-1 bg-muted/60 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="market">Market possibilities</TabsTrigger>
            <TabsTrigger value="fixes">What to do</TabsTrigger>
            <TabsTrigger value="avoid">What to avoid</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-border/60 shadow-card lg:col-span-1">
                <CardContent className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Health Score
                  </p>
                  <div className="relative mx-auto mt-2 h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        innerRadius="75%"
                        outerRadius="100%"
                        data={[{ name: "score", value: score, fill: ringColor }]}
                        startAngle={210}
                        endAngle={-30}
                      >
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <RadialBar background={{ fill: "hsl(var(--muted))" }} dataKey="value" cornerRadius={20} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-4">
                      <div className="font-display text-5xl font-bold tracking-tight">{score}</div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">out of 100</div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <Badge className="bg-accent text-accent-foreground hover:bg-accent">
                      {healthScore.verdict}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-gradient-hero text-primary-foreground shadow-elegant lg:col-span-2">
                <CardContent className="flex h-full flex-col justify-between gap-6 p-8">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
                      <Sparkles className="h-3.5 w-3.5" /> CRAB.AI verdict for {roleLabel}
                    </div>
                    <p className="mt-4 font-display text-2xl font-semibold leading-snug md:text-3xl">
                      {healthScore.summary}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-primary-foreground/15 pt-6 sm:grid-cols-4">
                    {kpis.map((k) => (
                      <div key={k.label}>
                        <div className="text-xs uppercase tracking-wider text-primary-foreground/70">{k.label}</div>
                        <div className="mt-1 font-display text-xl font-bold">{k.value}</div>
                        <div
                          className={cn(
                            "mt-0.5 inline-flex items-center gap-1 text-xs font-medium",
                            k.positive ? "text-primary-foreground" : "text-primary-foreground/60",
                          )}
                        >
                          {k.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {k.delta}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-border/60 shadow-card lg:col-span-2">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-lg font-semibold">Revenue vs. Costs</h2>
                      <p className="text-xs text-muted-foreground">Last 12 months · €K</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-sm bg-primary" /> Revenue
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-sm bg-muted-foreground/60" /> Costs
                      </span>
                    </div>
                  </div>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyFinancials} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="costs" fill="hsl(var(--muted-foreground) / 0.5)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-card">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h2 className="font-display text-lg font-semibold">Profit Trend</h2>
                    <p className="text-xs text-muted-foreground">Net monthly · €K</p>
                  </div>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={profitTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2.5}
                          dot={{ r: 3, fill: "hsl(var(--primary))" }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* INSIGHTS */}
          <TabsContent value="insights" className="space-y-4">
            <SectionHead icon={Lightbulb} title="Insights for your role" subtitle={`Tailored to ${roleLabel} priorities.`} />
            <div className="grid gap-3 md:grid-cols-2">
              {report.insights.map((i) => (
                <Card key={i.title} className="border-border/60 shadow-card transition-shadow hover:shadow-elegant">
                  <CardContent className="space-y-2 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-base font-semibold leading-snug">{i.title}</h3>
                      {i.metric && (
                        <Badge variant="outline" className="border-primary/30 bg-accent text-accent-foreground">
                          {i.metric}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{i.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* MARKET */}
          <TabsContent value="market" className="space-y-4">
            <SectionHead icon={Target} title="Market possibilities" subtitle="Opportunities worth considering this quarter." />
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {report.market.map((m) => (
                <Card key={m.title} className="border-border/60 shadow-card transition-shadow hover:shadow-elegant">
                  <CardContent className="space-y-3 p-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                      <TrendingUp className="h-3 w-3" /> {m.potential}
                    </div>
                    <h3 className="font-display text-base font-semibold leading-snug">{m.title}</h3>
                    <p className="text-sm text-muted-foreground">{m.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FIXES */}
          <TabsContent value="fixes" className="space-y-4">
            <SectionHead icon={Wrench} title="What to do — prioritized fixes" subtitle="Sorted by urgency. Act top-down." />

            <div className="grid gap-3 md:hidden">
              {report.fixes.map((r) => (
                <Card key={r.fix} className="border-border/60 shadow-card">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base font-semibold leading-snug">{r.fix}</h3>
                      <UrgencyBadge urgency={r.urgency} />
                    </div>
                    <p className="text-sm text-muted-foreground">{r.why}</p>
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">Savings</span>
                      <span className="font-display text-lg font-bold text-primary">{r.savings}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="hidden border-border/60 shadow-card md:block">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Fix</TableHead>
                      <TableHead>Why</TableHead>
                      <TableHead className="text-right">Savings</TableHead>
                      <TableHead className="text-right">Urgency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.fixes.map((r) => (
                      <TableRow key={r.fix}>
                        <TableCell className="font-medium">{r.fix}</TableCell>
                        <TableCell className="max-w-md text-sm text-muted-foreground">{r.why}</TableCell>
                        <TableCell className="text-right font-display text-base font-bold text-primary">
                          {r.savings}
                        </TableCell>
                        <TableCell className="text-right">
                          <UrgencyBadge urgency={r.urgency} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AVOID */}
          <TabsContent value="avoid" className="space-y-4">
            <SectionHead icon={ShieldAlert} title="What to avoid" subtitle="Anti-patterns and risks specific to your role." />
            <div className="grid gap-3 md:grid-cols-2">
              {report.avoid.map((a) => (
                <Card key={a.title} className="border-foreground/20 bg-muted/40 shadow-card">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-foreground/20 bg-foreground text-background">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-base font-semibold leading-snug">{a.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{a.detail}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="py-6 text-center text-xs text-muted-foreground">
          Powered by CRAB.AI · Report tailored for {roleLabel} · {monthLabel(month)}
        </div>
      </main>
    </div>
  );
};

const SectionHead = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  </div>
);

const UrgencyBadge = ({ urgency }: { urgency: Urgency }) => {
  const map: Record<Urgency, string> = {
    Critical: "bg-foreground text-background border-transparent",
    High: "bg-primary-glow text-primary-foreground border-transparent",
    Medium: "bg-accent text-accent-foreground border border-border",
    Low: "bg-transparent text-muted-foreground border-border",
  };
  return (
    <Badge variant="outline" className={cn("text-[10px] font-semibold uppercase tracking-wider", map[urgency])}>
      {urgency}
    </Badge>
  );
};

export default Dashboard;