import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'neon' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'btn-primary',
  neon: 'btn-neon',
  ghost: 'bg-transparent text-ink-700 hover:bg-ink-50',
  outline: 'bg-white border border-ink-100 text-ink-800 hover:border-ink-300 hover:bg-ink-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-xl',
};

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none transition',
        variants[variant], sizes[size], className,
      )}
      {...props}
    />
  );
}
