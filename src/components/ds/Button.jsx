/**
 * OS-000 Button Component
 * Variants: primary, outline, ghost, gold
 * Sizes: sm, md, lg
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-md)] border-none cursor-pointer transition-all duration-[var(--transition-base)] no-underline';

  const variants = {
    primary: 'bg-[var(--color-cta)] text-[var(--color-text-inverse)] hover:bg-[var(--color-cta-hover)] hover:-translate-y-0.5',
    outline: 'bg-transparent text-[var(--color-cta)] border border-[var(--color-cta)] hover:bg-[var(--color-cta)] hover:text-[var(--color-text-inverse)]',
    ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]',
    gold: 'bg-[var(--color-highlight)] text-[var(--color-black)] hover:brightness-110 hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[var(--text-sm)]',
    md: 'px-5 py-2.5 text-[var(--text-sm)]',
    lg: 'px-8 py-3.5 text-[var(--text-base)]',
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return <a href={href} className={classes} {...props}>{children}</a>;
  }

  return <button className={classes} {...props}>{children}</button>;
}
