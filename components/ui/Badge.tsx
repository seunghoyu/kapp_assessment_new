interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "yellow" | "purple" | "gray";
  size?: "sm" | "md";
}

export default function Badge({
  children,
  variant = "blue",
  size = "sm",
}: BadgeProps) {
  const variantClasses = {
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    purple: "bg-purple-100 text-purple-700",
    gray: "bg-gray-100 text-gray-700",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center rounded font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
}
