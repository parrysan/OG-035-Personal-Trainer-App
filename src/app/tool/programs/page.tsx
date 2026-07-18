"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useProvider } from "@/lib/data/use-provider";
import type { DataProvider } from "@/lib/data/provider";
import type { Client, Exercise, Program, ProgramItem } from "@/lib/domain/types";
import { pl } from "@/lib/copy/pl";
import { EQUIPMENT_LABELS, MUSCLE_LABELS } from "@/lib/copy/taxonomy-labels";

type ItemWithExercise = ProgramItem & { exercise: Exercise };

function ProgramsPageInner() {
  const provider = useProvider();
  const searchParams = useSearchParams();
  const preselectedClient = searchParams.get("client");

  const [clients, setClients] = useState<Client[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(preselectedClient);
  const [openProgramId, setOpenProgramId] = useState<string | null>(null);
  const [openProgramItems, setOpenProgramItems] = useState<ItemWithExercise[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showNewProgram, setShowNewProgram] = useState(false);
  const [newProgramName, setNewProgramName] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const reload = useCallback(async () => {
    if (!provider) return;
    const [cls, exs] = await Promise.all([provider.listClients(), provider.listExercises()]);
    setClients(cls.filter((c) => c.status === "active"));
    setExercises(exs);
    setPrograms(await provider.listPrograms(selectedClientId ?? undefined));
  }, [provider, selectedClientId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const openProgram = useCallback(
    async (programId: string | null) => {
      setOpenProgramId(programId);
      if (!provider || !programId) {
        setOpenProgramItems([]);
        return;
      }
      const view = await provider.getProgramWithItems(programId);
      setOpenProgramItems(view?.items ?? []);
    },
    [provider],
  );

  const createProgram = async () => {
    if (!provider || !selectedClientId || !newProgramName.trim()) return;
    const program = await provider.createProgram({
      clientId: selectedClientId,
      name: newProgramName.trim(),
      notes: "",
    });
    setNewProgramName("");
    setShowNewProgram(false);
    await reload();
    await openProgram(program.id);
  };

  const addExercise = async (exerciseId: string) => {
    if (!provider || !openProgramId) return;
    await provider.addProgramItem({
      programId: openProgramId,
      exerciseId,
      sets: 3,
      reps: "10",
      restSeconds: 60,
      notes: "",
    });
    setPickerOpen(false);
    await openProgram(openProgramId);
  };

  const updateItem = async (id: string, patch: Parameters<DataProvider["updateProgramItem"]>[1]) => {
    if (!provider) return;
    await provider.updateProgramItem(id, patch);
    if (openProgramId) await openProgram(openProgramId);
  };

  const moveItem = async (index: number, direction: -1 | 1) => {
    if (!provider || !openProgramId) return;
    const ids = openProgramItems.map((i) => i.id);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    await provider.reorderProgramItems(openProgramId, ids);
    await openProgram(openProgramId);
  };

  const removeItem = async (id: string) => {
    if (!provider || !openProgramId) return;
    await provider.removeProgramItem(id);
    await openProgram(openProgramId);
  };

  if (!provider) return <p>{pl.common.loading}</p>;

  const openProgramData = programs.find((p) => p.id === openProgramId) ?? null;

  return (
    <div>
      <div className="flex items-center justify-between gap-[var(--spacing-4)] flex-wrap">
        <h1 className="text-[var(--text-2xl)] font-[var(--weight-bold)]">{pl.programs.title}</h1>
        <select
          value={selectedClientId ?? ""}
          onChange={(e) => {
            setSelectedClientId(e.target.value || null);
            void openProgram(null);
          }}
          className="px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]"
        >
          <option value="">{pl.programs.client}: —</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-[var(--spacing-6)] grid gap-[var(--spacing-6)] lg:grid-cols-[280px_1fr]">
        {/* Program list */}
        <aside>
          <div className="flex items-center justify-between">
            <h2 className="text-[var(--text-sm)] font-[var(--weight-semibold)] uppercase tracking-[var(--tracking-caps)] text-[var(--color-text-muted)]">
              {pl.programs.title}
            </h2>
            {selectedClientId && (
              <button
                type="button"
                onClick={() => setShowNewProgram(true)}
                className="text-[var(--text-sm)] text-[var(--color-accent)] hover:underline"
              >
                + {pl.programs.addProgram}
              </button>
            )}
          </div>
          {!selectedClientId ? (
            <p className="mt-[var(--spacing-4)] text-[var(--text-sm)] text-[var(--color-text-secondary)]">
              {pl.programs.client}: —
            </p>
          ) : programs.length === 0 ? (
            <p className="mt-[var(--spacing-4)] text-[var(--text-sm)] text-[var(--color-text-secondary)]">
              {pl.programs.empty}
            </p>
          ) : (
            <ul className="mt-[var(--spacing-3)] space-y-[var(--spacing-2)]">
              {programs.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => void openProgram(p.id)}
                    className={`w-full text-left px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border transition-colors ${
                      p.id === openProgramId
                        ? "border-[var(--color-accent)] bg-[var(--color-bg-secondary)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
                    }`}
                  >
                    <span className="block font-[var(--weight-medium)] text-[var(--text-sm)]">{p.name}</span>
                    <span className="block text-[var(--text-xs)] text-[var(--color-text-muted)]">
                      {pl.programs.status[p.status]} · {pl.programs.updatedAt}{" "}
                      {new Date(p.updatedAt).toLocaleDateString("pl-PL")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {showNewProgram && (
            <div className="mt-[var(--spacing-4)] p-[var(--spacing-3)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
              <input
                value={newProgramName}
                onChange={(e) => setNewProgramName(e.target.value)}
                placeholder={pl.programs.name}
                className="w-full px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)]"
              />
              <div className="mt-[var(--spacing-2)] flex gap-[var(--spacing-2)]">
                <button
                  type="button"
                  onClick={() => void createProgram()}
                  className="flex-1 px-[var(--spacing-3)] py-[var(--spacing-1)] rounded-[var(--radius-md)] bg-[var(--color-cta)] text-[var(--color-text-inverse)] text-[var(--text-sm)] font-[var(--weight-semibold)]"
                >
                  {pl.common.save}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewProgram(false)}
                  className="px-[var(--spacing-3)] py-[var(--spacing-1)] rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--text-sm)]"
                >
                  {pl.common.cancel}
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Builder */}
        <section>
          {!openProgramData ? (
            <p className="text-[var(--color-text-secondary)]">{pl.programs.empty}</p>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-[var(--spacing-3)] flex-wrap">
                <h2 className="text-[var(--text-xl)] font-[var(--weight-bold)]">{openProgramData.name}</h2>
                <div className="flex gap-[var(--spacing-3)]">
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="px-[var(--spacing-4)] py-[var(--spacing-2)] rounded-[var(--radius-md)] bg-[var(--color-cta)] text-[var(--color-text-inverse)] font-[var(--weight-semibold)] hover:bg-[var(--color-cta-hover)] transition-colors"
                  >
                    + {pl.programs.addExercise}
                  </button>
                  <Link
                    href={`/tool/programs/view?id=${openProgramData.id}`}
                    className="px-[var(--spacing-4)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)] hover:bg-[var(--color-bg-muted)] transition-colors"
                  >
                    {pl.programs.clientView} →
                  </Link>
                </div>
              </div>

              {openProgramItems.length === 0 ? (
                <p className="mt-[var(--spacing-6)] text-[var(--color-text-secondary)]">
                  {pl.programs.addExercise} →
                </p>
              ) : (
                <ol className="mt-[var(--spacing-6)] space-y-[var(--spacing-3)]">
                  {openProgramItems.map((item, index) => (
                    <li
                      key={item.id}
                      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-[var(--spacing-4)]"
                    >
                      <div className="flex items-start gap-[var(--spacing-3)]">
                        <div className="flex flex-col gap-[var(--spacing-1)] pt-1">
                          <button
                            type="button"
                            aria-label="up"
                            disabled={index === 0}
                            onClick={() => void moveItem(index, -1)}
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            aria-label="down"
                            disabled={index === openProgramItems.length - 1}
                            onClick={() => void moveItem(index, 1)}
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] disabled:opacity-30"
                          >
                            ▼
                          </button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-[var(--spacing-3)]">
                            <div>
                              <h3 className="font-[var(--weight-semibold)]">{item.exercise.name}</h3>
                              <p className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
                                {item.exercise.primaryMuscles.map((m) => MUSCLE_LABELS[m]).join(", ")} ·{" "}
                                {EQUIPMENT_LABELS[item.exercise.equipment]}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => void removeItem(item.id)}
                              className="text-[var(--text-sm)] text-[var(--color-error)] hover:underline shrink-0"
                            >
                              {pl.common.delete}
                            </button>
                          </div>
                          <div className="mt-[var(--spacing-3)] grid grid-cols-3 gap-[var(--spacing-3)]">
                            <label className="block">
                              <span className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
                                {pl.programs.sets}
                              </span>
                              <input
                                type="number"
                                min={1}
                                value={item.sets}
                                onChange={(e) => void updateItem(item.id, { sets: Number(e.target.value) || 1 })}
                                className="mt-[var(--spacing-1)] w-full px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-md)] border border-[var(--color-border)]"
                              />
                            </label>
                            <label className="block">
                              <span className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
                                {pl.programs.reps}
                              </span>
                              <input
                                value={item.reps}
                                onChange={(e) => void updateItem(item.id, { reps: e.target.value })}
                                className="mt-[var(--spacing-1)] w-full px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-md)] border border-[var(--color-border)]"
                              />
                            </label>
                            <label className="block">
                              <span className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
                                {pl.programs.rest}
                              </span>
                              <input
                                type="number"
                                min={0}
                                value={item.restSeconds ?? ""}
                                onChange={(e) =>
                                  void updateItem(item.id, {
                                    restSeconds: e.target.value === "" ? null : Number(e.target.value),
                                  })
                                }
                                className="mt-[var(--spacing-1)] w-full px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-md)] border border-[var(--color-border)]"
                              />
                            </label>
                          </div>
                          <label className="block mt-[var(--spacing-3)]">
                            <span className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
                              {pl.programs.itemNotes}
                            </span>
                            <input
                              value={item.notes}
                              onChange={(e) => void updateItem(item.id, { notes: e.target.value })}
                              className="mt-[var(--spacing-1)] w-full px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-md)] border border-[var(--color-border)]"
                            />
                          </label>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </section>
      </div>

      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-[var(--spacing-4)]"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="max-w-lg w-full max-h-[80vh] overflow-y-auto rounded-[var(--radius-lg)] bg-[var(--color-bg-card)] p-[var(--spacing-6)] border border-[var(--color-border)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[var(--text-xl)] font-[var(--weight-bold)]">{pl.programs.addExercise}</h2>
            <ul className="mt-[var(--spacing-4)] space-y-[var(--spacing-2)]">
              {exercises.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => void addExercise(e.id)}
                    className="w-full text-left px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
                  >
                    <span className="block font-[var(--weight-medium)] text-[var(--text-sm)]">{e.name}</span>
                    <span className="block text-[var(--text-xs)] text-[var(--color-text-muted)]">
                      {e.primaryMuscles.map((m) => MUSCLE_LABELS[m]).join(", ")} · {EQUIPMENT_LABELS[e.equipment]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <Suspense fallback={<p>{pl.common.loading}</p>}>
      <ProgramsPageInner />
    </Suspense>
  );
}
