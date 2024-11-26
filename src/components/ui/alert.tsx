// components/ui/alert.tsx
import { ReactNode } from 'react';

interface AlertProps {
  variant?: 'default' | 'destructive';
  children: ReactNode;
}

interface AlertTitleProps {
  children: ReactNode;
}

interface AlertDescriptionProps {
  children: ReactNode;
}

export function Alert({ variant = 'default', children }: AlertProps) {
  const baseStyles = "rounded-lg border p-4";
  const variantStyles = {
    default: "bg-gray-800/50 border-gray-700 text-gray-300",
    destructive: "bg-red-500/10 border-red-500/20 text-red-200"
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]}`}>
      {children}
    </div>
  );
}

export function AlertTitle({ children }: AlertTitleProps) {
  return (
    <h5 className="mb-1 font-medium leading-none tracking-tight">
      {children}
    </h5>
  );
}

export function AlertDescription({ children }: AlertDescriptionProps) {
  return (
    <div className="text-sm opacity-90">
      {children}
    </div>
  );
}