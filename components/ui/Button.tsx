import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
  icon?: ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  icon,
  className = "",
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-50",
  };

  return (
    <button
      className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
