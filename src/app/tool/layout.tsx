"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { pl } from "@/lib/copy/pl";
import { TeaserGate } from "@/components/tool/TeaserGate";

const TABS = [
  { href: "/tool/library", label: pl.nav.library },
  { href: "/tool/clients", label: pl.nav.clients },
  { href: "/tool/programs", label: pl.nav.programs },
];

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showSyncTeaser, setShowSyncTeaser] = useState(false);
  return (
    <div className="min-h-full flex flex-col bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]">
        <div className="max-w-[var(--container-max)] mx-auto px-[var(--spacing-6)] py-[var(--spacing-4)] flex items-center justify-between">
          <Link href="/" className="font-[var(--weight-bold)] text-[var(--color-text)]">
            OG-035 <span className="text-[var(--color-accent)]">Trener</span>
          </Link>
          <div className="flex items-center gap-[var(--spacing-3)]">
            <button
              type="button"
              onClick={() => setShowSyncTeaser(true)}
              className="text-[var(--text-xs)] px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-full)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              title={pl.teaser.lockedSyncTitle}
            >
              ☁ 🔒
            </button>
            <span className="text-[var(--text-xs)] px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-full)] border border-[var(--color-highlight)] text-[var(--color-text-secondary)]">
              FREE
            </span>
          </div>
        </div>
        <nav className="max-w-[var(--container-max)] mx-auto px-[var(--spacing-6)] flex gap-[var(--spacing-1)]">
          {TABS.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-[var(--spacing-4)] py-[var(--spacing-3)] text-[var(--text-sm)] font-[var(--weight-medium)] border-b-2 transition-colors ${
                  active
                    ? "border-[var(--color-accent)] text-[var(--color-text)]"
                    : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="flex-1 max-w-[var(--container-max)] w-full mx-auto px-[var(--spacing-6)] py-[var(--spacing-8)]">
        {children}
      </main>
      {showSyncTeaser && (
        <TeaserGate
          title={pl.teaser.lockedSyncTitle}
          body={pl.teaser.lockedSyncBody}
          onClose={() => setShowSyncTeaser(false)}
        />
      )}
    </div>
  );
}
