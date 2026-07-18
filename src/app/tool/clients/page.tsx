"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useProvider } from "@/lib/data/use-provider";
import { TierLimitError } from "@/lib/data/provider";
import type { Client, ClientOnboarding } from "@/lib/domain/types";
import { pl } from "@/lib/copy/pl";
import { TeaserGate } from "@/components/tool/TeaserGate";

const EMPTY_ONBOARDING: ClientOnboarding = {
  healthHistory: "",
  goals: "",
  preferences: "",
  injuries: "",
  experienceLevel: null,
  notes: "",
};

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  onboarding: EMPTY_ONBOARDING,
};

export default function ClientsPage() {
  const provider = useProvider();
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [showLimitTeaser, setShowLimitTeaser] = useState(false);

  const reload = useCallback(async () => {
    if (!provider) return;
    setClients(await provider.listClients());
  }, [provider]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (c: Client) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      email: c.contact.email ?? "",
      phone: c.contact.phone ?? "",
      onboarding: c.onboarding ?? EMPTY_ONBOARDING,
    });
    setError(null);
    setShowForm(true);
  };

  const save = async () => {
    if (!provider) return;
    if (!form.name.trim()) {
      setError("Imię i nazwisko jest wymagane.");
      return;
    }
    const input = {
      name: form.name.trim(),
      contact: {
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
        ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
      },
      onboarding: form.onboarding,
    };
    try {
      if (editingId) {
        await provider.updateClient(editingId, input);
      } else {
        await provider.createClient(input);
      }
      setShowForm(false);
      await reload();
    } catch (err) {
      if (err instanceof TierLimitError) {
        setShowForm(false);
        setShowLimitTeaser(true);
      } else {
        setError(err instanceof Error ? err.message : String(err));
      }
    }
  };

  const archive = async (id: string) => {
    if (!provider || !window.confirm(pl.common.confirmDelete)) return;
    await provider.archiveClient(id);
    await reload();
  };

  if (!provider) return <p>{pl.common.loading}</p>;

  const activeClients = clients.filter((c) => c.status === "active");
  const archivedClients = clients.filter((c) => c.status === "archived");

  return (
    <div>
      <div className="flex items-center justify-between gap-[var(--spacing-4)] flex-wrap">
        <h1 className="text-[var(--text-2xl)] font-[var(--weight-bold)]">
          {pl.clients.title}{" "}
          <span className="text-[var(--text-base)] font-[var(--weight-regular)] text-[var(--color-text-muted)]">
            {activeClients.length}/3
          </span>
        </h1>
        <button
          type="button"
          onClick={openCreate}
          className="px-[var(--spacing-4)] py-[var(--spacing-2)] rounded-[var(--radius-md)] bg-[var(--color-cta)] text-[var(--color-text-inverse)] font-[var(--weight-semibold)] hover:bg-[var(--color-cta-hover)] transition-colors"
        >
          + {pl.clients.addClient}
        </button>
      </div>

      {clients.length === 0 ? (
        <p className="mt-[var(--spacing-8)] text-[var(--color-text-secondary)]">{pl.clients.empty}</p>
      ) : (
        <>
          <ul className="mt-[var(--spacing-6)] grid gap-[var(--spacing-4)] md:grid-cols-2">
            {activeClients.map((c) => (
              <li
                key={c.id}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-[var(--spacing-5)]"
              >
                <div className="flex items-start justify-between gap-[var(--spacing-3)]">
                  <div>
                    <h3 className="font-[var(--weight-semibold)] text-[var(--color-text)]">{c.name}</h3>
                    <p className="mt-[var(--spacing-1)] text-[var(--text-xs)] text-[var(--color-text-muted)]">
                      {[c.contact.email, c.contact.phone].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  <div className="flex gap-[var(--spacing-2)] shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="text-[var(--text-sm)] text-[var(--color-accent)] hover:underline"
                    >
                      {pl.common.edit}
                    </button>
                    <button
                      type="button"
                      onClick={() => void archive(c.id)}
                      className="text-[var(--text-sm)] text-[var(--color-error)] hover:underline"
                    >
                      {pl.common.delete}
                    </button>
                  </div>
                </div>
                {c.onboarding?.goals && (
                  <p className="mt-[var(--spacing-3)] text-[var(--text-sm)] text-[var(--color-text-secondary)]">
                    <strong>{pl.clients.onboarding.goals}:</strong> {c.onboarding.goals}
                  </p>
                )}
                <Link
                  href={`/tool/programs?client=${c.id}`}
                  className="mt-[var(--spacing-3)] inline-block text-[var(--text-sm)] text-[var(--color-accent)] hover:underline"
                >
                  {pl.programs.title} →
                </Link>
              </li>
            ))}
          </ul>
          {archivedClients.length > 0 && (
            <details className="mt-[var(--spacing-8)]">
              <summary className="cursor-pointer text-[var(--text-sm)] text-[var(--color-text-muted)]">
                {pl.clients.status.archived} ({archivedClients.length})
              </summary>
              <ul className="mt-[var(--spacing-3)] space-y-[var(--spacing-2)]">
                {archivedClients.map((c) => (
                  <li key={c.id} className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
                    {c.name}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </>
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
              {editingId ? pl.clients.editClient : pl.clients.addClient}
            </h2>
            <div className="mt-[var(--spacing-4)] space-y-[var(--spacing-4)]">
              <label className="block">
                <span className="text-[var(--text-sm)] font-[var(--weight-medium)]">{pl.clients.name}</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-[var(--spacing-1)] w-full px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)]"
                />
              </label>
              <div className="grid grid-cols-2 gap-[var(--spacing-4)]">
                <label className="block">
                  <span className="text-[var(--text-sm)] font-[var(--weight-medium)]">{pl.clients.email}</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="mt-[var(--spacing-1)] w-full px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)]"
                  />
                </label>
                <label className="block">
                  <span className="text-[var(--text-sm)] font-[var(--weight-medium)]">{pl.clients.phone}</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="mt-[var(--spacing-1)] w-full px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)]"
                  />
                </label>
              </div>

              <fieldset className="border-t border-[var(--color-border-subtle)] pt-[var(--spacing-4)]">
                <legend className="text-[var(--text-sm)] font-[var(--weight-semibold)] px-[var(--spacing-2)] -ml-[var(--spacing-2)]">
                  {pl.clients.onboardingTitle}
                </legend>
                <div className="space-y-[var(--spacing-4)]">
                  {(
                    [
                      ["healthHistory", pl.clients.onboarding.healthHistory],
                      ["goals", pl.clients.onboarding.goals],
                      ["injuries", pl.clients.onboarding.injuries],
                      ["preferences", pl.clients.onboarding.preferences],
                      ["notes", pl.clients.onboarding.notes],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="block">
                      <span className="text-[var(--text-sm)] font-[var(--weight-medium)]">{label}</span>
                      <textarea
                        value={form.onboarding[key]}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            onboarding: { ...f.onboarding, [key]: e.target.value },
                          }))
                        }
                        rows={2}
                        className="mt-[var(--spacing-1)] w-full px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)]"
                      />
                    </label>
                  ))}
                  <label className="block">
                    <span className="text-[var(--text-sm)] font-[var(--weight-medium)]">
                      {pl.clients.onboarding.experienceLevel}
                    </span>
                    <select
                      value={form.onboarding.experienceLevel ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          onboarding: {
                            ...f.onboarding,
                            experienceLevel: (e.target.value || null) as ClientOnboarding["experienceLevel"],
                          },
                        }))
                      }
                      className="mt-[var(--spacing-1)] w-full px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border border-[var(--color-border)]"
                    >
                      <option value="">—</option>
                      <option value="beginner">{pl.clients.onboarding.levels.beginner}</option>
                      <option value="intermediate">{pl.clients.onboarding.levels.intermediate}</option>
                      <option value="advanced">{pl.clients.onboarding.levels.advanced}</option>
                    </select>
                  </label>
                </div>
              </fieldset>

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

      {showLimitTeaser && (
        <TeaserGate
          title={pl.teaser.lockedClientsTitle}
          body={pl.teaser.lockedClientsBody}
          onClose={() => setShowLimitTeaser(false)}
        />
      )}
    </div>
  );
}
