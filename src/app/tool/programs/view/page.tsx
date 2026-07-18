"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useProvider } from "@/lib/data/use-provider";
import type { Client, Exercise, Program, ProgramItem } from "@/lib/domain/types";
import { pl } from "@/lib/copy/pl";
import { EQUIPMENT_LABELS, MUSCLE_LABELS } from "@/lib/copy/taxonomy-labels";

type ItemWithExercise = ProgramItem & { exercise: Exercise };

function ClientViewInner() {
  const provider = useProvider();
  const searchParams = useSearchParams();
  const programId = searchParams.get("id");

  const [data, setData] = useState<{ program: Program; items: ItemWithExercise[] } | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!provider || !programId) return;
    const view = await provider.getProgramWithItems(programId);
    if (!view) {
      setNotFound(true);
      return;
    }
    setData(view);
    const clients = await provider.listClients();
    setClient(clients.find((c) => c.id === view.program.clientId) ?? null);
  }, [provider, programId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!provider) return <p className="print:hidden">{pl.common.loading}</p>;
  if (notFound)
    return (
      <p className="print:hidden">
        <Link href="/tool/programs" className="text-[var(--color-accent)] hover:underline">
          ← {pl.programs.title}
        </Link>
      </p>
    );
  if (!data) return <p className="print:hidden">{pl.common.loading}</p>;

  return (
    <div className="client-view">
      <div className="print:hidden mb-[var(--spacing-6)] flex items-center justify-between gap-[var(--spacing-3)] flex-wrap">
        <Link href="/tool/programs" className="text-[var(--color-accent)] hover:underline">
          ← {pl.programs.title}
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="px-[var(--spacing-4)] py-[var(--spacing-2)] rounded-[var(--radius-md)] bg-[var(--color-cta)] text-[var(--color-text-inverse)] font-[var(--weight-semibold)] hover:bg-[var(--color-cta-hover)] transition-colors"
        >
          {pl.programs.print}
        </button>
      </div>

      <header className="border-b-2 border-[var(--color-text)] pb-[var(--spacing-4)]">
        <h1 className="text-[var(--text-3xl)] font-[var(--weight-bold)]">{data.program.name}</h1>
        <p className="mt-[var(--spacing-2)] text-[var(--color-text-secondary)]">
          {client?.name} · {new Date(data.program.updatedAt).toLocaleDateString("pl-PL")}
        </p>
        {data.program.notes && <p className="mt-[var(--spacing-2)]">{data.program.notes}</p>}
      </header>

      <ol className="mt-[var(--spacing-6)] space-y-[var(--spacing-5)]">
        {data.items.map((item, index) => (
          <li
            key={item.id}
            className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-[var(--spacing-5)] break-inside-avoid"
          >
            <div className="flex items-baseline gap-[var(--spacing-3)]">
              <span className="text-[var(--text-2xl)] font-[var(--weight-bold)] text-[var(--color-accent)]">
                {index + 1}
              </span>
              <div className="flex-1">
                <h2 className="text-[var(--text-xl)] font-[var(--weight-bold)]">{item.exercise.name}</h2>
                <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
                  {item.exercise.primaryMuscles.map((m) => MUSCLE_LABELS[m]).join(", ")} ·{" "}
                  {EQUIPMENT_LABELS[item.exercise.equipment]}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[var(--text-lg)] font-[var(--weight-bold)]">
                  {item.sets} × {item.reps}
                </p>
                {item.restSeconds !== null && (
                  <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
                    {pl.programs.rest}: {item.restSeconds}s
                  </p>
                )}
              </div>
            </div>
            <p className="mt-[var(--spacing-3)] text-[var(--text-sm)] text-[var(--color-text-secondary)] whitespace-pre-line">
              {item.exercise.instructions}
            </p>
            {item.notes && (
              <p className="mt-[var(--spacing-2)] text-[var(--text-sm)] italic text-[var(--color-text-secondary)]">
                {item.notes}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ClientViewPage() {
  return (
    <Suspense fallback={<p>{pl.common.loading}</p>}>
      <ClientViewInner />
    </Suspense>
  );
}
