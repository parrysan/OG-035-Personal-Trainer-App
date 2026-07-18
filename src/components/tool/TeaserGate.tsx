"use client";

import { pl } from "@/lib/copy/pl";

/**
 * TeaserGate — the Helium-10 upgrade hook. Shows a locked-feature
 * panel with an upgrade CTA. Used for: 4th client, visual library,
 * cloud sync. Upgrade URL points at the landing page (cloud waitlist
 * until Phase 2 billing lands).
 */
export function TeaserGate({
  title,
  body,
  onClose,
}: {
  title: string;
  body: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-[var(--spacing-4)]"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-w-md w-full rounded-[var(--radius-lg)] bg-[var(--color-bg-card)] p-[var(--spacing-8)] shadow-[var(--shadow-lg)] border border-[var(--color-border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-3xl mb-[var(--spacing-3)]" aria-hidden>
          🔒
        </div>
        <h3 className="text-[var(--text-xl)] font-[var(--weight-bold)] text-[var(--color-text)]">
          {title}
        </h3>
        <p className="mt-[var(--spacing-3)] text-[var(--text-base)] text-[var(--color-text-secondary)]">
          {body}
        </p>
        <div className="mt-[var(--spacing-6)] flex gap-[var(--spacing-3)]">
          <a
            href="/"
            className="flex-1 text-center px-[var(--spacing-4)] py-[var(--spacing-3)] rounded-[var(--radius-md)] bg-[var(--color-cta)] text-[var(--color-text-inverse)] font-[var(--weight-semibold)] hover:bg-[var(--color-cta-hover)] transition-colors"
          >
            {pl.teaser.upgradeCta}
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-[var(--spacing-4)] py-[var(--spacing-3)] rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-muted)] transition-colors"
          >
            {pl.common.back}
          </button>
        </div>
      </div>
    </div>
  );
}
