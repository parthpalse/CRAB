import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { loadProfile } from "@/lib/companyProfile";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(loadProfile() ? "/dashboard" : "/setup");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-subtle px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card className="border-border/60 shadow-elegant">
          <CardContent className="p-8">
            <div className="mb-6 text-center">
              <h1 className="font-display text-2xl font-bold tracking-tight">Welcome back</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to view your audit</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary shadow-elegant">
                Sign in
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              No account?{" "}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;