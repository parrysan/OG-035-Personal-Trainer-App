import Link from "next/link";
import { pl } from "@/lib/copy/pl";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-[var(--spacing-6)] py-[var(--spacing-16)] text-center">
      <p className="text-[var(--text-xs)] font-[var(--weight-medium)] uppercase tracking-[var(--tracking-caps)] text-[var(--color-accent)] mb-[var(--spacing-4)]">
        OG-035
      </p>
      <h1 className="font-[var(--font-primary)] text-[var(--text-4xl)] font-[var(--weight-bold)] text-[var(--color-text)] max-w-3xl">
        {pl.landing.headline}
      </h1>
      <p className="mt-[var(--spacing-4)] text-[var(--text-lg)] text-[var(--color-text-secondary)] max-w-xl">
        {pl.landing.subtitle}
      </p>
      <div className="mt-[var(--spacing-8)] flex gap-[var(--spacing-4)]">
        <Link
          href="/tool"
          className="px-[var(--spacing-6)] py-[var(--spacing-3)] rounded-[var(--radius-md)] bg-[var(--color-cta)] text-[var(--color-text-inverse)] font-[var(--weight-semibold)] hover:bg-[var(--color-cta-hover)] transition-colors"
        >
          {pl.landing.downloadCta}
        </Link>
      </div>
    </main>
  );
}
