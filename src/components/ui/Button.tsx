import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "md" | "lg";
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-blue text-white hover:bg-blue-dark",
  secondary: "bg-navy text-white hover:bg-navy-light",
  outline: "border border-white/30 text-white hover:bg-white/10",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export default function Button({
  href,
  variant = "primary",
  size = "md",
  children,
  className,
  type = "button",
  onClick,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
