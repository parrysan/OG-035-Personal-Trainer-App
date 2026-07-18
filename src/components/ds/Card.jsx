/**
 * OS-000 Card Component
 * Variants: default, elevated, bordered, ghost
 */
export function Card({
  children,
  variant = 'default',
  hover = true,
  className = '',
  ...props
}) {
  const base = 'rounded-[var(--radius-lg)] p-[var(--spacing-6)] transition-all duration-[var(--transition-base)]';

  const variants = {
    default: 'bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-[var(--shadow-sm)]',
    elevated: 'bg-[var(--color-bg-card)] shadow-[var(--shadow-md)]',
    bordered: 'bg-[var(--color-bg-card)] border-2 border-[var(--color-border)]',
    ghost: 'bg-transparent',
  };

  const hoverClass = hover
    ? 'hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5'
    : '';

  return (
    <div className={`${base} ${variants[variant]} ${hoverClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

/**
 * Card subcomponents for structured content
 */
export function CardImage({ src, alt, className = '' }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full rounded-[var(--radius-md)] mb-[var(--spacing-4)] object-cover ${className}`}
    />
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`font-[var(--font-primary)] text-[var(--text-xl)] font-[var(--weight-bold)] leading-[var(--leading-snug)] text-[var(--color-text)] mb-[var(--spacing-2)] ${className}`}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <p className={`text-[var(--text-base)] text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] ${className}`}>
      {children}
    </p>
  );
}
