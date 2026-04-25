import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Logo from "@/components/Logo";
import {
  currentMonthKey,
  loadProfile,
  monthLabel,
  recentMonthKeys,
  saveMonthlyEntry,
} from "@/lib/companyProfile";

const AddData = () => {
  const navigate = useNavigate();
  const profile = loadProfile();
  const [month, setMonth] = useState(currentMonthKey());
  const [data, setData] = useState("");
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    if (!profile) navigate("/setup");
  }, [profile, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    saveMonthlyEntry({ month, data, prompt, savedAt: new Date().toISOString() });
    navigate(`/dashboard?month=${month}`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-foreground">
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <main className="container flex justify-center py-10">
        <Card className="w-full max-w-2xl border-border/60 shadow-elegant">
          <CardContent className="p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Monthly update</p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
              Add this month's data
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Update figures and context — CRAB.AI will regenerate your role-tailored report.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label>Reporting month</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {recentMonthKeys(12).map((k) => (
                      <SelectItem key={k} value={k}>{monthLabel(k)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Numbers / KPIs for this month</Label>
                <Textarea
                  id="data"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  placeholder={"e.g.\nRevenue: €112K\nCosts: €92K\nNew customers: 18\nChurned: 3"}
                  className="min-h-[160px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Context / prompt (optional)</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Anything specific to focus on this month? Big wins, surprises, decisions you're weighing…"
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button type="button" variant="ghost" asChild>
                  <Link to="/dashboard"><ArrowLeft className="mr-1 h-4 w-4" /> Cancel</Link>
                </Button>
                <Button type="submit" className="bg-gradient-primary shadow-elegant">
                  <Sparkles className="mr-1 h-4 w-4" /> Regenerate report
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddData;