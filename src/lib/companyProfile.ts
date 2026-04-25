export type Role = "CEO" | "CFO" | "HR" | "Marketing" | "Operations" | "Sales";

export const ROLES: { value: Role; label: string; blurb: string }[] = [
  { value: "CEO", label: "CEO / Founder", blurb: "Top-level view across the entire business" },
  { value: "CFO", label: "CFO / Finance", blurb: "Cash, margins, runway and cost structure" },
  { value: "HR", label: "HR / People", blurb: "Headcount, payroll, retention and culture" },
  { value: "Marketing", label: "Marketing", blurb: "Acquisition, channels, brand and CAC/LTV" },
  { value: "Operations", label: "Operations", blurb: "Suppliers, logistics, processes, efficiency" },
  { value: "Sales", label: "Sales", blurb: "Pipeline, conversion, deal velocity, customers" },
];

export type CompanyProfile = {
  companyName: string;
  industry: string;
  size: string;
  revenue: string;
  region: string;
  role: Role;
  challenges: string[];
  goals: string[];
  initialData: string;
  prompt: string;
  setupAt: string;
};

export type MonthlyEntry = {
  month: string; // e.g. "2025-04"
  data: string;
  prompt: string;
  savedAt: string;
};

const PROFILE_KEY = "crab.companyProfile";
const ENTRIES_KEY = "crab.monthlyEntries";

export const saveProfile = (p: CompanyProfile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
};

export const loadProfile = (): CompanyProfile | null => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as CompanyProfile) : null;
  } catch {
    return null;
  }
};

export const clearProfile = () => localStorage.removeItem(PROFILE_KEY);

export const saveMonthlyEntry = (entry: MonthlyEntry) => {
  const list = loadMonthlyEntries().filter((e) => e.month !== entry.month);
  list.push(entry);
  list.sort((a, b) => (a.month < b.month ? 1 : -1));
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(list));
};

export const loadMonthlyEntries = (): MonthlyEntry[] => {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    return raw ? (JSON.parse(raw) as MonthlyEntry[]) : [];
  } catch {
    return [];
  }
};

export const monthLabel = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  if (!y || !m) return key;
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
};

export const currentMonthKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const recentMonthKeys = (n = 6): string[] => {
  const out: string[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
};