/**
 * OS-000 Footer Component
 * Variants: simple (one-line), columns (multi-column links)
 */
export function Footer({
  brand,
  year = new Date().getFullYear(),
  columns = [],
  variant = 'simple',
  className = '',
}) {
  if (variant === 'simple') {
    return (
      <footer className={`w-full border-t border-[var(--color-border-subtle)] bg-[var(--color-bg)] py-[var(--spacing-8)] px-[var(--spacing-6)] ${className}`}>
        <div className="max-w-[var(--container-max)] mx-auto flex flex-col sm:flex-row items-center justify-between gap-[var(--spacing-4)]">
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
            &copy; {year} {brand}. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`w-full border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] py-[var(--spacing-12)] px-[var(--spacing-6)] ${className}`}>
      <div className="max-w-[var(--container-max)] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--spacing-8)] mb-[var(--spacing-12)]">
          {columns.map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-[var(--font-primary)] text-[var(--text-sm)] font-[var(--weight-bold)] text-[var(--color-text)] mb-[var(--spacing-4)] uppercase tracking-[var(--tracking-caps)]">
                {title}
              </h4>
              <ul className="list-none p-0 m-0 space-y-[var(--spacing-2)]">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <a href={href} className="text-[var(--text-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] no-underline transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--color-border-subtle)] pt-[var(--spacing-6)]">
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
            &copy; {year} {brand}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
