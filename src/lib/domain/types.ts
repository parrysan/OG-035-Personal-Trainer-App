/**
 * OG-035 domain types — single source of truth for both data providers
 * (LocalProvider for the free offline build, SupabaseProvider for cloud).
 * Field names mirror the Supabase schema 1:1 so import/export is lossless.
 */

import type { Equipment, MovementPattern, MuscleGroup } from "./taxonomy";

export interface Trainer {
  id: string;
  name: string;
  slug: string | null;
  stripeCustomerId: string | null;
  createdAt: string; // ISO 8601
}

export interface ClientOnboarding {
  healthHistory: string;
  goals: string;
  preferences: string;
  injuries: string;
  experienceLevel: "beginner" | "intermediate" | "advanced" | null;
  notes: string;
}

export interface Client {
  id: string;
  trainerId: string;
  name: string;
  contact: { email?: string; phone?: string };
  onboarding: ClientOnboarding | null;
  status: "active" | "archived";
  createdAt: string;
}

export interface Exercise {
  id: string;
  /** null = curated (platform library); trainerId = trainer's custom exercise */
  ownerId: string | null;
  name: string;
  /** Step-by-step execution instructions, plain text, one step per line */
  instructions: string;
  primaryMuscles: MuscleGroup[];
  movementPattern: MovementPattern;
  equipment: Equipment;
  /** null = text-only (free tier); set for curated visual library (paid) */
  mediaUrl: string | null;
  curated: boolean;
}

export interface Program {
  id: string;
  clientId: string;
  name: string;
  notes: string;
  status: "draft" | "active" | "archived";
  updatedAt: string;
}

export interface ProgramItem {
  id: string;
  programId: string;
  exerciseId: string;
  sort: number;
  sets: number;
  reps: string; // free text: "10", "8-12", "30s" — trainers think in ranges
  restSeconds: number | null;
  notes: string;
}

export interface Entitlement {
  trainerId: string;
  tier: "free" | "pro";
  status: "active" | "past_due" | "canceled";
  currentPeriodEnd: string | null;
}

/** Feature gates — enforced identically in both providers */
export const TIER_LIMITS = {
  free: { maxClients: 3, visualLibrary: false, cloudSync: false },
  pro: { maxClients: Infinity, visualLibrary: true, cloudSync: true },
} as const;

export type Tier = keyof typeof TIER_LIMITS;
