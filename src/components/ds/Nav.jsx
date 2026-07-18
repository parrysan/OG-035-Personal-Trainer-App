/**
 * OS-000 Nav Component
 * Responsive navigation with mobile hamburger menu.
 */
'use client';
import { useState } from 'react';
import { Button } from './Button';

export function Nav({
  brand,
  brandHref = '/',
  links = [],
  cta,
  ctaHref,
  className = '',
}) {
  const [open, setOpen] = useState(false);

  return (
    <nav className={`w-full bg-[var(--color-bg)] border-b border-[var(--color-border-subtle)] ${className}`}>
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--spacing-6)] flex items-center justify-between h-16">
        {/* Brand */}
        <a href={brandHref} className="font-[var(--font-primary)] text-[var(--text-xl)] font-[var(--weight-bold)] text-[var(--color-text)] no-underline">
          {brand}
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-[var(--spacing-8)]">
          {links.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-[var(--text-sm)] font-[var(--weight-medium)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors no-underline"
            >
              {label}
            </a>
          ))}
          {cta && <Button href={ctaHref} size="sm">{cta}</Button>}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-[var(--color-text)]"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {open
              ? <path d="M6 6l12 12M6 18L18 6" />
              : <path d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-[var(--spacing-6)] py-[var(--spacing-4)]">
          {links.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="block py-[var(--spacing-3)] text-[var(--text-base)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] no-underline"
            >
              {label}
            </a>
          ))}
          {cta && (
            <div className="pt-[var(--spacing-4)]">
              <Button href={ctaHref} className="w-full">{cta}</Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
