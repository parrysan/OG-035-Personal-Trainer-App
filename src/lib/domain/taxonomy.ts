/**
 * Locked exercise taxonomy (per Gemini PRD §4).
 * Tags are admin-controlled — trainers pick from these lists, never invent.
 * Cloud tier adds a tag-request flow (V2); until then these constants are
 * the only valid values in BOTH tiers.
 *
 * UI labels are Polish (market = trainers in Poland); values stay English
 * so data stays portable.
 */

export const MUSCLE_GROUPS = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "core",
  "glutes",
  "quads",
  "hamstrings",
  "calves",
  "full_body",
] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const MOVEMENT_PATTERNS = [
  "push",
  "pull",
  "hinge",
  "squat",
  "lunge",
  "rotation",
  "carry",
  "isometric",
] as const;
export type MovementPattern = (typeof MOVEMENT_PATTERNS)[number];

export const EQUIPMENT = [
  "bodyweight",
  "dumbbells",
  "barbell",
  "kettlebell",
  "resistance_bands",
  "machine",
  "cable",
  "bench",
  "trx",
] as const;
export type Equipment = (typeof EQUIPMENT)[number];

export function isMuscleGroup(v: string): v is MuscleGroup {
  return (MUSCLE_GROUPS as readonly string[]).includes(v);
}
export function isMovementPattern(v: string): v is MovementPattern {
  return (MOVEMENT_PATTERNS as readonly string[]).includes(v);
}
export function isEquipment(v: string): v is Equipment {
  return (EQUIPMENT as readonly string[]).includes(v);
}
