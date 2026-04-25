export const businessProfile = {
  name: "Northwind Trading Co.",
  industry: "Retail",
  size: "11–50 employees",
  generatedOn: "Today",
};

export const healthScore = {
  score: 72,
  verdict: "Healthy with risks",
  summary:
    "Strong revenue trajectory, but margins and cash conversion are leaking value. Three urgent fixes could unlock €48,200/yr.",
};

export const kpis = [
  { label: "Revenue (TTM)", value: "€1.24M", delta: "+12.4%", positive: true },
  { label: "Operating Costs", value: "€986K", delta: "+18.1%", positive: false },
  { label: "Gross Margin", value: "20.5%", delta: "-3.2pp", positive: false },
  { label: "Cash Runway", value: "7.8 mo", delta: "-1.4 mo", positive: false },
];

export const monthlyFinancials = [
  { month: "May", revenue: 82, costs: 65 },
  { month: "Jun", revenue: 88, costs: 68 },
  { month: "Jul", revenue: 91, costs: 72 },
  { month: "Aug", revenue: 95, costs: 78 },
  { month: "Sep", revenue: 102, costs: 84 },
  { month: "Oct", revenue: 108, costs: 89 },
  { month: "Nov", revenue: 112, costs: 92 },
  { month: "Dec", revenue: 124, costs: 101 },
  { month: "Jan", revenue: 98, costs: 88 },
  { month: "Feb", revenue: 104, costs: 91 },
  { month: "Mar", revenue: 116, costs: 96 },
  { month: "Apr", revenue: 121, costs: 102 },
];

export const profitTrend = monthlyFinancials.map((m) => ({
  month: m.month,
  profit: m.revenue - m.costs,
}));

export type Severity = "high" | "medium" | "low";

export const alerts: { title: string; detail: string; severity: Severity }[] = [
  {
    title: "Supplier costs up 18% YoY",
    detail: "Top 3 suppliers driving 64% of cost growth — renegotiation overdue.",
    severity: "high",
  },
  {
    title: "Cash runway dropping",
    detail: "Net burn accelerated 22% in Q1. Runway down to 7.8 months.",
    severity: "high",
  },
  {
    title: "Gross margin compression",
    detail: "Margins down 3.2pp in 6 months. Pricing has not tracked input costs.",
    severity: "medium",
  },
  {
    title: "Customer concentration risk",
    detail: "Top 2 customers = 38% of revenue. Diversification needed.",
    severity: "medium",
  },
];

export type Urgency = "Critical" | "High" | "Medium" | "Low";

export const recommendations: {
  fix: string;
  why: string;
  savings: string;
  urgency: Urgency;
}[] = [
  {
    fix: "Renegotiate top 3 supplier contracts",
    why: "Volume justifies 8–12% rebate; current terms expired.",
    savings: "€18,400/yr",
    urgency: "Critical",
  },
  {
    fix: "Reprice slow-moving SKUs (+6%)",
    why: "Demand inelastic in core categories; margin lift immediate.",
    savings: "€14,200/yr",
    urgency: "High",
  },
  {
    fix: "Consolidate SaaS subscriptions",
    why: "Audit shows 11 overlapping tools across teams.",
    savings: "€7,800/yr",
    urgency: "High",
  },
  {
    fix: "Tighten payment terms to Net-15",
    why: "DSO at 42 days vs. industry 28. Frees ~€60K working capital.",
    savings: "€5,200/yr",
    urgency: "Medium",
  },
  {
    fix: "Diversify top-customer revenue",
    why: "38% concentration is a structural risk. Target <25%.",
    savings: "€2,600/yr",
    urgency: "Medium",
  },
];