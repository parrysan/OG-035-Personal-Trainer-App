import { describe, expect, it } from "vitest";
import { LocalProvider } from "../src/lib/data/local";
import { TierLimitError } from "../src/lib/data/provider";
import { isEquipment, isMovementPattern, isMuscleGroup } from "../src/lib/domain/taxonomy";
import { SEED_EXERCISES } from "../src/lib/data/seed-exercises";

function makeProvider(): LocalProvider {
  // In-memory Storage stub — no browser in tests
  const map = new Map<string, string>();
  const storage = {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
    key: () => null,
    get length() {
      return map.size;
    },
  } as Storage;
  return new LocalProvider(storage);
}

describe("LocalProvider — free tier gates", () => {
  it("caps active clients at 3", async () => {
    const p = makeProvider();
    for (const name of ["A", "B", "C"]) {
      await p.createClient({ name, contact: {} });
    }
    await expect(p.createClient({ name: "D", contact: {} })).rejects.toThrow(TierLimitError);
  });

  it("archiving a client frees a slot", async () => {
    const p = makeProvider();
    const clients = [];
    for (const name of ["A", "B", "C"]) clients.push(await p.createClient({ name, contact: {} }));
    await p.archiveClient(clients[0].id);
    await expect(p.createClient({ name: "D", contact: {} })).resolves.toBeTruthy();
  });

  it("custom exercises are always text-only (mediaUrl null)", async () => {
    const p = makeProvider();
    const ex = await p.createExercise({
      name: "Test",
      instructions: "Steps",
      primaryMuscles: ["chest"],
      movementPattern: "push",
      equipment: "bodyweight",
    });
    expect(ex.mediaUrl).toBeNull();
  });

  it("curated seed exercises are read-only", async () => {
    const p = makeProvider();
    const exercises = await p.listExercises();
    const seed = exercises.find((e) => e.curated)!;
    await expect(p.updateExercise(seed.id, { name: "Hacked" })).rejects.toThrow();
    await expect(p.deleteExercise(seed.id)).rejects.toThrow();
  });
});

describe("program builder", () => {
  it("adds, reorders and removes items", async () => {
    const p = makeProvider();
    const client = await p.createClient({ name: "A", contact: {} });
    const program = await p.createProgram({ clientId: client.id, name: "P1", notes: "" });
    const exercises = await p.listExercises();

    const i1 = await p.addProgramItem({
      programId: program.id,
      exerciseId: exercises[0].id,
      sets: 3,
      reps: "10",
      restSeconds: 60,
      notes: "",
    });
    const i2 = await p.addProgramItem({
      programId: program.id,
      exerciseId: exercises[1].id,
      sets: 4,
      reps: "8",
      restSeconds: 90,
      notes: "",
    });

    let view = await p.getProgramWithItems(program.id);
    expect(view!.items.map((i) => i.id)).toEqual([i1.id, i2.id]);

    await p.reorderProgramItems(program.id, [i2.id, i1.id]);
    view = await p.getProgramWithItems(program.id);
    expect(view!.items.map((i) => i.id)).toEqual([i2.id, i1.id]);
    expect(view!.items[0].exercise.name).toBe(exercises[1].name);

    await p.removeProgramItem(i1.id);
    view = await p.getProgramWithItems(program.id);
    expect(view!.items).toHaveLength(1);
  });

  it("deleting a custom exercise removes it from programs", async () => {
    const p = makeProvider();
    const client = await p.createClient({ name: "A", contact: {} });
    const program = await p.createProgram({ clientId: client.id, name: "P1", notes: "" });
    const ex = await p.createExercise({
      name: "Temp",
      instructions: "x",
      primaryMuscles: ["core"],
      movementPattern: "isometric",
      equipment: "bodyweight",
    });
    await p.addProgramItem({ programId: program.id, exerciseId: ex.id, sets: 1, reps: "1", restSeconds: null, notes: "" });
    await p.deleteExercise(ex.id);
    const view = await p.getProgramWithItems(program.id);
    expect(view!.items).toHaveLength(0);
  });
});

describe("taxonomy", () => {
  it("seed exercises only use locked taxonomy values", () => {
    for (const ex of SEED_EXERCISES) {
      for (const m of ex.primaryMuscles) expect(isMuscleGroup(m)).toBe(true);
      expect(isMovementPattern(ex.movementPattern)).toBe(true);
      expect(isEquipment(ex.equipment)).toBe(true);
    }
  });

  it("covers every movement pattern", () => {
    const patterns = new Set(SEED_EXERCISES.map((e) => e.movementPattern));
    for (const p of ["push", "pull", "hinge", "squat", "lunge", "rotation", "carry", "isometric"]) {
      expect(patterns.has(p as never), `missing pattern: ${p}`).toBe(true);
    }
  });
});
