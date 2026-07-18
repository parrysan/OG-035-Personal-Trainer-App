"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useProvider } from "@/lib/data/use-provider";
import { TierLimitError } from "@/lib/data/provider";
import type { Exercise } from "@/lib/domain/types";
import {
  EQUIPMENT,
  MOVEMENT_PATTERNS,
  MUSCLE_GROUPS,
  type Equipment,
  type MovementPattern,
  type MuscleGroup,
} from "@/lib/domain/taxonomy";
import { pl } from "@/lib/copy/pl";
import { EQUIPMENT_LABELS, MUSCLE_LABELS, PATTERN_LABELS } from "@/lib/copy/taxonomy-labels";
import { TeaserGate } from "@/components/tool/TeaserGate";

const EMPTY_FORM = {
  name: "",
  instructions: "",
  primaryMuscles: [] as MuscleGroup[],
  movementPattern: "push" as MovementPattern,
  equipment: "bodyweight" as Equipment,
};

export default function LibraryPage() {
  const provider = useProvider();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<string>(pl.library.filterAll);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [showVisualTeaser, setShowVisualTeaser] = useState(false);

  const reload = useCallback(async () => {
    if (!provider) return;
    setExercises(await provider.listExercises());
  }, [provider]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const filtered = useMemo(() => {
    return exercises.filter((e) => {
      const q = search.trim().toLowerCase();
      if (q && !e.name.toLowerCase().includes(q)) return false;
      if (muscleFilter !== pl.library.filterAll && !e.primaryMuscles.includes(muscleFilter as MuscleGroup))
        return false;
      return true;
    });
  }, [exercises, search, muscleFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (e: Exercise) => {
    setEditingId(e.id);
    setForm({
      name: e.name,
      instructions: e.instructions,
      primaryMuscles: e.primaryMuscles,
      movementPattern: e.movementPattern,
      equipment: e.equipment,
    });
    setError(null);
    setShowForm(true);
  };

  const save = async () => {
    if (!provider) return;
    if (!form.name.trim() || form.primaryMuscles.length === 0) {
      setError("Nazwa i co najmniej jedna partia mięśniowa są wymagane.");
      return;
    }
    try {
      if (editingId) {
        await provider.updateExercise(editingId, form);
      } else {
        await provider.createExercise(form);
      }
      setShowForm(false);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const remove = async (id: string) => {
    if (!provider || !window.confirm(pl.common.confirmDelete)) return;
    try {
      await provider.deleteExercise(id);
      await reload();
    } catch (err) {
      if (err instanceof TierLimitError) return;
      window.alert(err instanceof Error ? err.message : String(err));
    }
  };

  const toggleMuscle = (m: MuscleGroup) => {
    setForm((f) => ({
      ...f,
      primaryMuscles: f.primaryMuscles.includes(m)
        ? f.primaryMuscles.filter((x) => x !== m)
        : [...f.primaryMuscles, m],
    }));
  };

  if (!provider) return <p>{pl.common.loading}</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-[var(--spacing-4)] flex-wrap">
        <h1 className="text-[var(--text-2xl)] font-[var(--weight-bold)]">{pl.library.title}</h1>
        <button
          type="button"
          onClick={openCreate}
          className="px-[var(--spacing-4)] py-[var(--spacing-2)] rounded-[var(--radius-md)] bg-[var(--color-cta)] text-[var(--color-text-inverse)] font-[var(--weight-semibold)] hover:bg-[var(--color-cta-hover)] transition-colors"
        >
          + {pl.library.addExercise}
        </button>
      </div>

      <div className="mt-[var(--spacing-6)] flex gap-[var(--spacing-3)] flex-wrap">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={pl.common.search}
          className="flex-1 min-w-48 px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]"
        />
        <select
          value={muscleFilter}
          onChange={(e) => setMuscleFilter(e.target.value)}
          className="px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]"
        >
          <option>{pl.library.filterAll}</option>
          {MUSCLE_GROUPS.map((m) => (
            <option key={m} value={m}>
              {MUSCLE_LABELS[m]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowVisualTeaser(true)}
          className="px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-dashed border-[var(--color-highlight)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
          title={pl.teaser.lockedVisualTitle}
        >
          🖼 🔒 {pl.teaser.lockedVisualTitle}
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-[var(--spacing-8)] text-[var(--color-text-secondary)]">{pl.library.empty}</p>
      ) : (
        <ul className="mt-[var(--spacing-6)] grid gap-[var(--spacing-4)] md:grid-cols-2">
          {filtered.map((e) => (
            <li
              key={e.id}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-[var(--spacing-5)]"
            >
              <div className="flex items-start justify-between gap-[var(--spacing-3)]">
                <div>
                  <h3 className="font-[var(--weight-semibold)] text-[var(--color-text)]">{e.name}</h3>
                  <p className="mt-[var(--spacing-1)] text-[var(--text-xs)] text-[var(--color-text-muted)]">
                    {e.curated ? pl.library.curated : pl.library.custom} ·{" "}
                    {e.primaryMuscles.map((m) => MUSCLE_LABELS[m]).join(", ")} ·{" "}
                    {PATTERN_LABELS[e.movementPattern]} · {EQUIPMENT_LABELS[e.equipment]}
                  </p>
                </div>
                {!e.curated && (
                  <div className="flex gap-[var(--spacing-2)] shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(e)}
                      className="text-[var(--text-sm)] text-[var(--color-accent)] hover:underline"
                    >
                      {pl.common.edit}
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(e.id)}
                      className="text-[var(--text-sm)] text-[var(--color-error)] hover:underline"
                    >
                      {pl.common.delete}
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-[var(--spacing-3)] text-[var(--text-sm)] text-[var(--color-text-secondary)] whitespace-pre-line line-clamp-4">
                {e.instructions}
              </p>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-[var(--spacing-4)]"
          onClick={() => setShowForm(false)}
        >
          <div
            className="max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-[var(--radius-lg)] bg-[var(--color-bg-card)] p-[var(--spacing-6)] border border-[var(--color-border)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[var(--text-xl)] font-[var(--weight-bold)]">
              {editingId ? pl.library.editExercise : pl.library.addExercise}
            </h2>
            <div className="mt-[var(--spacing-4)] space-y-[var(--spacing-4)]">
              <label className="block">
                <span className="text-[var(--text-sm)] font-[var(--weight-medium)]">{pl.library.name}</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-[var(--spacing-1)] w-full px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)]"
                />
              </label>
              <label className="block">
                <span className="text-[var(--text-sm)] font-[var(--weight-medium)]">{pl.library.instructions}</span>
                <textarea
                  value={form.instructions}
                  onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
                  rows={5}
                  className="mt-[var(--spacing-1)] w-full px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)]"
                />
              </label>
              <fieldset>
                <legend className="text-[var(--text-sm)] font-[var(--weight-medium)]">
                  {pl.library.primaryMuscles}
                </legend>
                <div className="mt-[var(--spacing-2)] flex flex-wrap gap-[var(--spacing-2)]">
                  {MUSCLE_GROUPS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMuscle(m)}
                      className={`px-[var(--spacing-3)] py-[var(--spacing-1)] rounded-[var(--radius-full)] text-[var(--text-sm)] border transition-colors ${
                        form.primaryMuscles.includes(m)
                          ? "bg-[var(--color-accent)] text-[var(--color-text-inverse)] border-[var(--color-accent)]"
                          : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]"
                      }`}
                    >
                      {MUSCLE_LABELS[m]}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="grid grid-cols-2 gap-[var(--spacing-4)]">
                <label className="block">
                  <span className="text-[var(--text-sm)] font-[var(--weight-medium)]">{pl.library.movementPattern}</span>
                  <select
                    value={form.movementPattern}
                    onChange={(e) => setForm((f) => ({ ...f, movementPattern: e.target.value as MovementPattern }))}
                    className="mt-[var(--spacing-1)] w-full px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)]"
                  >
                    {MOVEMENT_PATTERNS.map((p) => (
                      <option key={p} value={p}>
                        {PATTERN_LABELS[p]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[var(--text-sm)] font-[var(--weight-medium)]">{pl.library.equipment}</span>
                  <select
                    value={form.equipment}
                    onChange={(e) => setForm((f) => ({ ...f, equipment: e.target.value as Equipment }))}
                    className="mt-[var(--spacing-1)] w-full px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)]"
                  >
                    {EQUIPMENT.map((eq) => (
                      <option key={eq} value={eq}>
                        {EQUIPMENT_LABELS[eq]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {error && <p className="text-[var(--text-sm)] text-[var(--color-error)]">{error}</p>}
              <div className="flex gap-[var(--spacing-3)]">
                <button
                  type="button"
                  onClick={() => void save()}
                  className="flex-1 px-[var(--spacing-4)] py-[var(--spacing-2)] rounded-[var(--radius-md)] bg-[var(--color-cta)] text-[var(--color-text-inverse)] font-[var(--weight-semibold)] hover:bg-[var(--color-cta-hover)] transition-colors"
                >
                  {pl.common.save}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-[var(--spacing-4)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)] hover:bg-[var(--color-bg-muted)] transition-colors"
                >
                  {pl.common.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showVisualTeaser && (
        <TeaserGate
          title={pl.teaser.lockedVisualTitle}
          body={pl.teaser.lockedVisualBody}
          onClose={() => setShowVisualTeaser(false)}
        />
      )}
    </div>
  );
}
