/**
 * Data provider interface — the seam between the free offline build
 * (LocalProvider, localStorage) and the paid cloud build (SupabaseProvider).
 *
 * All tier/feature gates live here so they're enforced identically
 * regardless of backend. Throws TierLimitError when a gate is hit;
 * the UI catches it and shows the teaser/upgrade prompt.
 */

import type {
  Client,
  ClientOnboarding,
  Entitlement,
  Exercise,
  Program,
  ProgramItem,
  Tier,
} from "../domain/types";
import { TIER_LIMITS } from "../domain/types";

export class TierLimitError extends Error {
  constructor(
    public readonly gate: "maxClients" | "visualLibrary" | "cloudSync",
    message: string,
  ) {
    super(message);
    this.name = "TierLimitError";
  }
}

export interface DataProvider {
  readonly tier: Tier;

  getEntitlement(): Promise<Entitlement>;

  // Clients
  listClients(): Promise<Client[]>;
  createClient(
    input: Pick<Client, "name" | "contact"> & { onboarding?: ClientOnboarding | null },
  ): Promise<Client>;
  updateClient(id: string, patch: Partial<Omit<Client, "id" | "trainerId" | "createdAt">>): Promise<Client>;
  archiveClient(id: string): Promise<void>;

  // Exercises
  listExercises(): Promise<Exercise[]>;
  createExercise(
    input: Omit<Exercise, "id" | "ownerId" | "curated" | "mediaUrl">,
  ): Promise<Exercise>;
  updateExercise(id: string, patch: Partial<Omit<Exercise, "id" | "ownerId">>): Promise<Exercise>;
  deleteExercise(id: string): Promise<void>;

  // Programs
  listPrograms(clientId?: string): Promise<Program[]>;
  getProgramWithItems(
    programId: string,
  ): Promise<{ program: Program; items: (ProgramItem & { exercise: Exercise })[] } | null>;
  createProgram(input: Pick<Program, "clientId" | "name" | "notes">): Promise<Program>;
  updateProgram(id: string, patch: Partial<Omit<Program, "id" | "clientId">>): Promise<Program>;
  deleteProgram(id: string): Promise<void>;

  // Program items
  addProgramItem(
    input: Omit<ProgramItem, "id" | "sort"> & { sort?: number },
  ): Promise<ProgramItem>;
  updateProgramItem(id: string, patch: Partial<Omit<ProgramItem, "id" | "programId">>): Promise<ProgramItem>;
  removeProgramItem(id: string): Promise<void>;
  reorderProgramItems(programId: string, orderedItemIds: string[]): Promise<void>;
}

/** Shared gate check used by both providers before client creation. */
export function assertClientLimit(tier: Tier, currentActiveCount: number): void {
  const max = TIER_LIMITS[tier].maxClients;
  if (currentActiveCount >= max) {
    throw new TierLimitError("maxClients", `Tier '${tier}' allows at most ${max} active clients`);
  }
}
