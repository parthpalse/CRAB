import type { Role } from "@/lib/companyProfile";
import type { Urgency } from "@/data/mockAudit";

export type RoleInsight = { title: string; detail: string; metric?: string };
export type MarketOpportunity = { title: string; detail: string; potential: string };
export type RoleFix = { fix: string; why: string; savings: string; urgency: Urgency };
export type AvoidItem = { title: string; detail: string };

export type RoleReport = {
  headline: string;
  focus: string;
  insights: RoleInsight[];
  market: MarketOpportunity[];
  fixes: RoleFix[];
  avoid: AvoidItem[];
};

export const roleReports: Record<Role, RoleReport> = {
  CEO: {
    headline: "Balanced executive briefing across the business.",
    focus: "Strategic priorities, cross-functional risks, capital allocation.",
    insights: [
      { title: "Revenue growth outpacing margin", detail: "Top-line +12.4% YoY but gross margin slipping 3.2pp — growth is being bought, not earned.", metric: "+12.4% / -3.2pp" },
      { title: "Cash conversion weakening", detail: "DSO at 42 days (industry 28). Working capital trapped in receivables.", metric: "42 days DSO" },
      { title: "Customer concentration risk", detail: "Top 2 customers = 38% of revenue. Single-account loss = -€236K hit.", metric: "38% concentration" },
    ],
    market: [
      { title: "Move upmarket on existing wedge", detail: "Current top-decile customers spend 3.4× the average — productize what they buy.", potential: "+€180K/yr" },
      { title: "Bundle services into recurring tier", detail: "Convert one-off projects into a retainer to smooth revenue.", potential: "+€90K/yr" },
      { title: "Geographic expansion (DACH)", detail: "Comparable peers see 22% lift entering DACH within 12 months.", potential: "+€220K/yr" },
    ],
    fixes: [
      { fix: "Diversify top-customer revenue below 25%", why: "38% concentration is a structural risk to enterprise value.", savings: "Risk avoided", urgency: "Critical" },
      { fix: "Renegotiate top 3 supplier contracts", why: "Volume justifies 8–12% rebate; current terms expired.", savings: "€18,400/yr", urgency: "Critical" },
      { fix: "Introduce quarterly OKR reviews", why: "No common scoreboard between functions slows decisions.", savings: "Operational", urgency: "High" },
      { fix: "Tighten payment terms to Net-15", why: "Frees ~€60K working capital immediately.", savings: "€5,200/yr", urgency: "Medium" },
    ],
    avoid: [
      { title: "Don't fund growth from margin", detail: "Discounting to win logos while costs rise compounds the margin hole." },
      { title: "Avoid hiring against unproven channels", detail: "Validate CAC payback under 12 months before adding fixed cost." },
      { title: "No new tooling without sunset plan", detail: "SaaS sprawl is already at 11 overlapping tools." },
    ],
  },
  CFO: {
    headline: "Finance health: margins compressing, runway shortening.",
    focus: "Cash, margins, working capital, cost discipline.",
    insights: [
      { title: "Gross margin down 3.2pp in 6 months", detail: "Pricing has not tracked input cost increases since Q3.", metric: "20.5% GM" },
      { title: "Cash runway 7.8 months", detail: "Net burn accelerated 22% in Q1. Trigger zone is 6 months.", metric: "7.8 mo" },
      { title: "DSO 42 days vs. industry 28", detail: "~€60K of cash trapped in receivables that should be liquid.", metric: "+14 days" },
      { title: "OpEx growing 1.5× faster than revenue", detail: "Operating costs +18.1% vs. revenue +12.4% — operating leverage is reversing.", metric: "1.46×" },
    ],
    market: [
      { title: "Refinance variable debt", detail: "Current rates make a 24-month fixed line cheaper at scale.", potential: "+€12K/yr" },
      { title: "R&D tax credit reclaim", detail: "Eligible spend not previously claimed last 2 fiscal years.", potential: "€28K one-off" },
      { title: "FX hedging on EUR/USD exposure", detail: "Smoothing 6-month forwards saves on volatility.", potential: "+€8K/yr" },
    ],
    fixes: [
      { fix: "Reprice slow-moving SKUs (+6%)", why: "Demand inelastic in core categories; immediate margin lift.", savings: "€14,200/yr", urgency: "Critical" },
      { fix: "Renegotiate top 3 supplier contracts", why: "Volume justifies 8–12% rebate; terms expired.", savings: "€18,400/yr", urgency: "Critical" },
      { fix: "Tighten payment terms to Net-15", why: "DSO at 42 vs. industry 28. Frees ~€60K working capital.", savings: "€5,200/yr", urgency: "High" },
      { fix: "Consolidate SaaS subscriptions", why: "11 overlapping tools across teams.", savings: "€7,800/yr", urgency: "High" },
    ],
    avoid: [
      { title: "No discretionary spend until runway > 9 mo", detail: "Tooling, events, perks should pause until burn normalizes." },
      { title: "Avoid blanket discounts to hit quarter", detail: "Every 1% discount = ~€12K of foregone gross profit." },
      { title: "Don't extend payment terms with weak suppliers", detail: "Single-source partners may stop ship — fragility risk." },
    ],
  },
  HR: {
    headline: "People cost ratio is high; retention risk is rising.",
    focus: "Headcount, payroll efficiency, retention, structure.",
    insights: [
      { title: "People cost is 41% of revenue", detail: "Industry median is 32–35%. Productivity per FTE trailing peers.", metric: "41%" },
      { title: "Salary bands are inconsistent", detail: "Variance of ±28% within same role/level — pay equity risk.", metric: "±28%" },
      { title: "No structured 1:1 cadence", detail: "Exit interviews cite 'lack of growth conversations' in 4 of last 5.", metric: "4 / 5 exits" },
      { title: "Manager span of control too wide", detail: "Average 9 direct reports vs. healthy 5–7.", metric: "9:1" },
    ],
    market: [
      { title: "Hire-from-within program", detail: "Internal mobility cuts replacement cost by ~€18K/role.", potential: "+€36K/yr" },
      { title: "Apprenticeship / junior pipeline", detail: "State-subsidized in your region — covers 40% of salary year 1.", potential: "+€22K/yr" },
      { title: "Remote-first for non-core roles", detail: "Widens talent pool, reduces facility cost per head.", potential: "+€15K/yr" },
    ],
    fixes: [
      { fix: "Standardize salary bands by level", why: "Removes pay equity risk and unblocks fair promotion decisions.", savings: "Risk avoided", urgency: "Critical" },
      { fix: "Introduce quarterly 1:1 + growth plans", why: "Top retention lever — costs nothing, prevents €18K/exit.", savings: "€18K per save", urgency: "High" },
      { fix: "Restructure manager spans to 5–7", why: "Improves coaching quality and reduces silent attrition.", savings: "Operational", urgency: "High" },
      { fix: "Audit overtime in operations team", why: "OT spend up 24% YoY — likely staffing imbalance, not demand.", savings: "€11,200/yr", urgency: "Medium" },
    ],
    avoid: [
      { title: "Don't give across-the-board raises", detail: "Use performance tiers — flat raises reward median performers and lose top talent." },
      { title: "Avoid hiring to fix process gaps", detail: "If two new hires would solve it, fix the workflow first." },
      { title: "No counter-offers for resigners", detail: "82% leave within 12 months anyway — costly and signals to others." },
    ],
  },
  Marketing: {
    headline: "Channel mix is unbalanced; CAC trending up.",
    focus: "Acquisition channels, CAC/LTV, brand vs. performance.",
    insights: [
      { title: "Blended CAC up 31% YoY", detail: "Paid social efficiency collapsed in Q1 — auction prices, not creative.", metric: "+31% CAC" },
      { title: "LTV:CAC ratio down to 2.4×", detail: "Healthy threshold is 3×. Below 2× is unprofitable acquisition.", metric: "2.4×" },
      { title: "Organic = 12% of pipeline", detail: "Heavy paid dependency. SEO + content underinvested.", metric: "12% organic" },
      { title: "Email nurture conversion 0.8%", detail: "Industry benchmark 2.4% — segmentation and timing are the gap.", metric: "0.8% CR" },
    ],
    market: [
      { title: "SEO investment in bottom-funnel queries", detail: "12 commercial-intent keywords reachable in 6 months.", potential: "+€140K/yr pipeline" },
      { title: "Partner/affiliate program", detail: "Adjacent SaaS tools serve same buyer — co-marketing leverage.", potential: "+€85K/yr" },
      { title: "Lifecycle email automation", detail: "Behavioral triggers convert 3× cold blasts.", potential: "+€48K/yr" },
    ],
    fixes: [
      { fix: "Cap paid social at 40% of budget", why: "Concentration in declining channel destroys efficiency.", savings: "€22,000/yr", urgency: "Critical" },
      { fix: "Launch SEO content engine (8 posts/mo)", why: "Compounds for 18 months; only durable channel under current CAC.", savings: "€140K pipeline", urgency: "High" },
      { fix: "Implement lifecycle email program", why: "Existing list of 14K is dormant — 3× lift on warm audience.", savings: "€48,000/yr", urgency: "High" },
      { fix: "Kill underperforming PPC keywords", why: "Bottom-quartile keywords spend 28% of budget for 6% of conversions.", savings: "€9,200/yr", urgency: "Medium" },
    ],
    avoid: [
      { title: "Don't chase reach-only metrics", detail: "Impressions, followers, and views without pipeline tie-back are vanity." },
      { title: "Avoid agency retainers without scorecards", detail: "Tie 30% of fee to pipeline-sourced revenue, not deliverables." },
      { title: "No new channels until 2 are profitable", detail: "Spreading thinly across channels is the #1 cause of CAC inflation." },
    ],
  },
  Operations: {
    headline: "Supplier risk and process slack are the biggest leaks.",
    focus: "Suppliers, logistics, throughput, process efficiency.",
    insights: [
      { title: "Supplier costs up 18% YoY", detail: "Top 3 suppliers driving 64% of cost growth.", metric: "+18% / 64%" },
      { title: "Single-source on 2 critical inputs", detail: "Production stops if either supplier slips — no backup contracts.", metric: "2 SKUs" },
      { title: "Inventory turns at 4.2", detail: "Industry 6.0+. ~€85K capital tied up in slow stock.", metric: "4.2× turns" },
      { title: "Order-to-cash cycle 14 days", detail: "Manual handoffs add 4–6 days that should be automated.", metric: "14 days" },
    ],
    market: [
      { title: "Backup supplier qualification", detail: "Removes single-source risk; 3% volume to 2nd source secures continuity.", potential: "Risk avoided" },
      { title: "3PL renegotiation on volume", detail: "Current bands triggered 4 months ago — rate card stale.", potential: "+€12K/yr" },
      { title: "Process automation (OTC)", detail: "Cut 6 manual steps in order-to-cash with low-code tooling.", potential: "+€18K/yr" },
    ],
    fixes: [
      { fix: "Renegotiate top 3 supplier contracts", why: "Volume justifies 8–12% rebate; current terms expired.", savings: "€18,400/yr", urgency: "Critical" },
      { fix: "Qualify backup supplier for 2 critical SKUs", why: "Production-stop risk if either single source fails.", savings: "Risk avoided", urgency: "Critical" },
      { fix: "Liquidate bottom-decile inventory", why: "Frees ~€85K cash; clears warehouse for higher-velocity SKUs.", savings: "€85K cash", urgency: "High" },
      { fix: "Automate order-to-cash workflow", why: "Cuts cycle from 14 to 8 days; lowers error rate.", savings: "€18,000/yr", urgency: "Medium" },
    ],
    avoid: [
      { title: "Don't accept supplier price hikes silently", detail: "Every quote increase should trigger a benchmark RFQ within 30 days." },
      { title: "Avoid stocking 'just in case'", detail: "Slow stock is locked cash and a tax on the warehouse footprint." },
      { title: "No process changes without measurement", detail: "Define cycle-time baseline before introducing tooling." },
    ],
  },
  Sales: {
    headline: "Pipeline coverage thin; deal velocity slowing.",
    focus: "Pipeline, win-rate, deal velocity, customer mix.",
    insights: [
      { title: "Pipeline coverage 1.8× quota", detail: "Healthy is 3×. Quarter at risk if even 2 deals slip.", metric: "1.8×" },
      { title: "Sales cycle stretched to 78 days", detail: "Up from 54 days last year — likely buyer-side procurement, not seller skill.", metric: "+24 days" },
      { title: "Win rate dropped 8pp in mid-market", detail: "Top reason in CRM notes: 'budget' — pricing or value framing issue.", metric: "-8pp" },
      { title: "Top 2 customers = 38% of revenue", detail: "Single-account loss = -€236K. Dependency risk is real.", metric: "38%" },
    ],
    market: [
      { title: "Land-and-expand on existing accounts", detail: "Current customers use 1.8 of 5 modules on average.", potential: "+€120K/yr" },
      { title: "Verticalize playbook for top 2 industries", detail: "Win rate 2.3× higher in named verticals — double down.", potential: "+€95K/yr" },
      { title: "Partner-sourced pipeline", detail: "Channel partners can add 18–25% pipeline at lower CAC.", potential: "+€85K/yr" },
    ],
    fixes: [
      { fix: "Build pipeline coverage to 3× quota", why: "Below 2× = quarter at material risk; trigger lead-gen sprint.", savings: "Quota security", urgency: "Critical" },
      { fix: "Diversify revenue: top-customer < 25%", why: "38% concentration is a deal-killing risk in any future raise/sale.", savings: "Risk avoided", urgency: "Critical" },
      { fix: "Standardize discounting governance", why: "Reps giving up to 22% with no approval — margin leak.", savings: "€16,800/yr", urgency: "High" },
      { fix: "Tighten qualification (BANT/MEDDIC)", why: "Cycle bloat is mostly unqualified deals lingering in stage 2.", savings: "Velocity 30%", urgency: "Medium" },
    ],
    avoid: [
      { title: "Don't compete on price in commodity slots", detail: "Win-rate uplift comes from value framing, not discount." },
      { title: "Avoid one-shot prospecting blitzes", detail: "Pipeline is a daily habit; sprints create boom-bust quarters." },
      { title: "No commission accelerators on poor-fit deals", detail: "Incentivizing wrong-ICP wins inflates churn 12 months later." },
    ],
  },
};

export const getReportForRole = (role: Role): RoleReport => roleReports[role];