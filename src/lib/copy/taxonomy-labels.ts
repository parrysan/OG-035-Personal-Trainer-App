/**
 * Polish display labels for the locked taxonomy values.
 * Shared by library, program builder, and client view.
 */

import type { Equipment, MovementPattern, MuscleGroup } from "../domain/taxonomy";

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: "Klatka",
  back: "Plecy",
  shoulders: "Barki",
  biceps: "Biceps",
  triceps: "Triceps",
  core: "Brzuch",
  glutes: "Pośladki",
  quads: "Czworogłowe",
  hamstrings: "Dwugłowe",
  calves: "Łydki",
  full_body: "Całe ciało",
};

export const PATTERN_LABELS: Record<MovementPattern, string> = {
  push: "Pchanie",
  pull: "Ciągnięcie",
  hinge: "Hinge",
  squat: "Przysiad",
  lunge: "Wykrok",
  rotation: "Rotacja",
  carry: "Noszenie",
  isometric: "Izometria",
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  bodyweight: "Masa ciała",
  dumbbells: "Hantle",
  barbell: "Sztanga",
  kettlebell: "Kettlebell",
  resistance_bands: "Gumy oporowe",
  machine: "Maszyna",
  cable: "Wyciąg",
  bench: "Ławka",
  trx: "TRX",
};
