import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon" | "xs";
  children: ReactNode;
  icon?: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  icon,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center gap-2 font-medium transition-colors justify-center";
  
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 rounded-md",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-md",
    ghost: "text-gray-700 hover:bg-gray-100 rounded-md",
    link: "text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline",
  };

  const sizeClasses = {
      xs: "px-2 py-1 text-xs",
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base",
      icon: "h-9 w-9",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
