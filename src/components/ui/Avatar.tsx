import { cn } from '@/lib/utils';
import { initials } from '@/lib/utils';

export function Avatar({ name, color = 'from-ink-700 to-ink-900', size = 'md', className }: { name: string; color?: string; size?: 'xs' | 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { xs: 'size-6 text-[10px]', sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-14 text-base' };
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold text-white bg-gradient-to-br',
        color, sizes[size], className,
      )}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}
