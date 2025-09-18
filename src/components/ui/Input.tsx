// src/components/ui/Input.tsx

import * as React from 'react';

import { cn } from '@/lib/utils';

// CORRECCIÓN: Hacemos que `customProp` sea opcional añadiendo un '?'
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  customProp?: any; // O el tipo que corresponda, pero opcional.
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-neutral-300 bg-white/50 px-4 py-2 text-base text-neutral-800 ring-offset-white",
          "placeholder:text-neutral-400",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-pet-orange focus:ring-opacity-75 focus:border-pet-orange",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };