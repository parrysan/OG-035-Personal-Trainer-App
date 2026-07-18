/**
 * LocalProvider — free tier. All data in localStorage, no registration.
 * One implicit local trainer. Enforces the 3-client cap and text-only
 * exercises (mediaUrl always null). Export/import JSON feeds the cloud
 * upgrade path (SupabaseProvider imports the same shape).
 */

import type {
  Client,
  ClientOnboarding,
  Entitlement,
  Exercise,
  Program,
  ProgramItem,
} from "../domain/types";
import { assertClientLimit, type DataProvider } from "./provider";
import { SEED_EXERCISES } from "./seed-exercises";

const STORAGE_KEY = "og035.data.v1";
const LOCAL_TRAINER_ID = "local-trainer";

interface Store {
  version: 1;
  clients: Client[];
  exercises: Exercise[];
  programs: Program[];
  programItems: ProgramItem[];
}

function emptyStore(): Store {
  return {
    version: 1,
    clients: [],
    exercises: SEED_EXERCISES.map((e, i) => ({
      ...e,
      id: `seed-${i + 1}`,
      ownerId: null,
      curated: true,
      mediaUrl: null,
    })),
    programs: [],
    programItems: [],
  };
}

function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export class LocalProvider implements DataProvider {
  readonly tier = "free" as const;
  private store: Store;

  constructor(storage?: Storage) {
    this.store = this.load(storage);
  }

  private load(storage?: Storage): Store {
    const s = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
    if (!s) return emptyStore();
    try {
      const raw = s.getItem(STORAGE_KEY);
      if (!raw) return emptyStore();
      const parsed = JSON.parse(raw) as Store;
      if (parsed.version !== 1) return emptyStore();
      return parsed;
    } catch {
      return emptyStore();
    }
  }

  private persist(): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.store));
  }

  /** Full export — feeds the cloud import on upgrade. */
  exportJSON(): string {
    return JSON.stringify(this.store, null, 2);
  }

  importJSON(json: string): void {
    const parsed = JSON.parse(json) as Store;
    if (parsed.version !== 1) throw new Error("Unsupported export version");
    this.store = parsed;
    this.persist();
  }

  async getEntitlement(): Promise<Entitlement> {
    return {
      trainerId: LOCAL_TRAINER_ID,
      tier: "free",
      status: "active",
      currentPeriodEnd: null,
    };
  }

  // ── Clients ──────────────────────────────────────────────────────────

  async listClients(): Promise<Client[]> {
    return [...this.store.clients];
  }

  async createClient(
    input: Pick<Client, "name" | "contact"> & { onboarding?: ClientOnboarding | null },
  ): Promise<Client> {
    const active = this.store.clients.filter((c) => c.status === "active").length;
    assertClientLimit(this.tier, active);
    const client: Client = {
      id: uid(),
      trainerId: LOCAL_TRAINER_ID,
      name: input.name,
      contact: input.contact,
      onboarding: input.onboarding ?? null,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    this.store.clients.push(client);
    this.persist();
    return client;
  }

  async updateClient(
    id: string,
    patch: Partial<Omit<Client, "id" | "trainerId" | "createdAt">>,
  ): Promise<Client> {
    const client = this.store.clients.find((c) => c.id === id);
    if (!client) throw new Error(`Client ${id} not found`);
    Object.assign(client, patch);
    this.persist();
    return client;
  }

  async archiveClient(id: string): Promise<void> {
    await this.updateClient(id, { status: "archived" });
  }

  // ── Exercises ────────────────────────────────────────────────────────

  async listExercises(): Promise<Exercise[]> {
    return [...this.store.exercises];
  }

  async createExercise(
    input: Omit<Exercise, "id" | "ownerId" | "curated" | "mediaUrl">,
  ): Promise<Exercise> {
    const exercise: Exercise = {
      ...input,
      id: uid(),
      ownerId: LOCAL_TRAINER_ID,
      curated: false,
      mediaUrl: null, // free tier is text-only
    };
    this.store.exercises.push(exercise);
    this.persist();
    return exercise;
  }

  async updateExercise(id: string, patch: Partial<Omit<Exercise, "id" | "ownerId">>): Promise<Exercise> {
    const exercise = this.store.exercises.find((e) => e.id === id);
    if (!exercise) throw new Error(`Exercise ${id} not found`);
    if (exercise.curated) throw new Error("Curated exercises are read-only");
    Object.assign(exercise, patch, { mediaUrl: null });
    this.persist();
    return exercise;
  }

  async deleteExercise(id: string): Promise<void> {
    const exercise = this.store.exercises.find((e) => e.id === id);
    if (exercise?.curated) throw new Error("Curated exercises are read-only");
    this.store.exercises = this.store.exercises.filter((e) => e.id !== id);
    this.store.programItems = this.store.programItems.filter((p) => p.exerciseId !== id);
    this.persist();
  }

  // ── Programs ─────────────────────────────────────────────────────────

  async listPrograms(clientId?: string): Promise<Program[]> {
    return this.store.programs.filter((p) => !clientId || p.clientId === clientId);
  }

  async getProgramWithItems(
    programId: string,
  ): Promise<{ program: Program; items: (ProgramItem & { exercise: Exercise })[] } | null> {
    const program = this.store.programs.find((p) => p.id === programId);
    if (!program) return null;
    const items = this.store.programItems
      .filter((i) => i.programId === programId)
      .sort((a, b) => a.sort - b.sort)
      .map((i) => {
        const exercise = this.store.exercises.find((e) => e.id === i.exerciseId);
        return exercise ? { ...i, exercise } : null;
      })
      .filter((i): i is ProgramItem & { exercise: Exercise } => i !== null);
    return { program, items };
  }

  async createProgram(input: Pick<Program, "clientId" | "name" | "notes">): Promise<Program> {
    const program: Program = {
      id: uid(),
      clientId: input.clientId,
      name: input.name,
      notes: input.notes,
      status: "draft",
      updatedAt: new Date().toISOString(),
    };
    this.store.programs.push(program);
    this.persist();
    return program;
  }

  async updateProgram(id: string, patch: Partial<Omit<Program, "id" | "clientId">>): Promise<Program> {
    const program = this.store.programs.find((p) => p.id === id);
    if (!program) throw new Error(`Program ${id} not found`);
    Object.assign(program, patch, { updatedAt: new Date().toISOString() });
    this.persist();
    return program;
  }

  async deleteProgram(id: string): Promise<void> {
    this.store.programs = this.store.programs.filter((p) => p.id !== id);
    this.store.programItems = this.store.programItems.filter((i) => i.programId !== id);
    this.persist();
  }

  // ── Program items ────────────────────────────────────────────────────

  async addProgramItem(input: Omit<ProgramItem, "id" | "sort"> & { sort?: number }): Promise<ProgramItem> {
    const maxSort = Math.max(
      0,
      ...this.store.programItems.filter((i) => i.programId === input.programId).map((i) => i.sort),
    );
    const item: ProgramItem = {
      id: uid(),
      programId: input.programId,
      exerciseId: input.exerciseId,
      sort: input.sort ?? maxSort + 1,
      sets: input.sets,
      reps: input.reps,
      restSeconds: input.restSeconds,
      notes: input.notes,
    };
    this.store.programItems.push(item);
    await this.touchProgram(input.programId);
    this.persist();
    return item;
  }

  async updateProgramItem(
    id: string,
    patch: Partial<Omit<ProgramItem, "id" | "programId">>,
  ): Promise<ProgramItem> {
    const item = this.store.programItems.find((i) => i.id === id);
    if (!item) throw new Error(`Program item ${id} not found`);
    Object.assign(item, patch);
    await this.touchProgram(item.programId);
    this.persist();
    return item;
  }

  async removeProgramItem(id: string): Promise<void> {
    const item = this.store.programItems.find((i) => i.id === id);
    this.store.programItems = this.store.programItems.filter((i) => i.id !== id);
    if (item) await this.touchProgram(item.programId);
    this.persist();
  }

  async reorderProgramItems(programId: string, orderedItemIds: string[]): Promise<void> {
    orderedItemIds.forEach((itemId, index) => {
      const item = this.store.programItems.find((i) => i.id === itemId && i.programId === programId);
      if (item) item.sort = index + 1;
    });
    await this.touchProgram(programId);
    this.persist();
  }

  private async touchProgram(programId: string): Promise<void> {
    const program = this.store.programs.find((p) => p.id === programId);
    if (program) program.updatedAt = new Date().toISOString();
  }
}

/** Singleton for client components — one store per browser tab session. */
let instance: LocalProvider | null = null;
export function getLocalProvider(): LocalProvider {
  if (!instance) instance = new LocalProvider();
  return instance;
}
