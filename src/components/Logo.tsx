import { Link } from "react-router-dom";
import crabLogo from "@/assets/crab-logo.png";

interface LogoProps {
  className?: string;
  to?: string;
}

const Logo = ({ className = "", to = "/" }: LogoProps) => {
  return (
    <Link to={to} className={`inline-flex items-center gap-2 font-display font-bold tracking-tight ${className}`}>
      <img src={crabLogo} alt="CRAB.AI logo" className="h-8 w-8 object-contain" />
      <span className="text-lg text-foreground">CRAB.AI</span>
    </Link>
  );
};

export default Logo;