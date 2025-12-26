import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  loading = false,
  className,
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-bridal-gold text-white hover:bg-bridal-gold/90 focus:ring-bridal-gold/50",
    secondary: "bg-white border-2 border-bridal-gold text-bridal-gold hover:bg-bridal-gold/5 focus:ring-bridal-gold/50"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </span>
      ) : children}
    </button>
  );
}
