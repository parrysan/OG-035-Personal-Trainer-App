/**
 * Seed exercise library — curated, text-only (free tier).
 * ~20 foundational movements covering all movement patterns and equipment.
 * Names and instructions in Polish (market = PL trainers).
 * Curated exercises are read-only in every tier.
 */

import type { Exercise } from "../domain/types";

type Seed = Omit<Exercise, "id" | "ownerId" | "curated" | "mediaUrl">;

export const SEED_EXERCISES: Seed[] = [
  {
    name: "Przysiad ze sztangą",
    instructions:
      "1. Stań w rozkroku na szerokość barków, sztanga na górnej części pleców.\n2. Utrzymaj klatkę piersiową wysoko i naturalną krzywiznę lędźwi.\n3. Uginaj biodra i kolana, schodząc do momentu równoległości ud z podłogą.\n4. Wróć do pozycji wyjściowej, mocno dociskając stopy do podłogi.",
    primaryMuscles: ["quads", "glutes"],
    movementPattern: "squat",
    equipment: "barbell",
  },
  {
    name: "Martwy ciąg",
    instructions:
      "1. Stań nad sztangą, stopy na szerokość bioder.\n2. Chwyć gryf tuż za kolanami, plecy proste, klatka wysoko.\n3. Prostuj biodra i kolana jednocześnie, prowadząc sztangę blisko ciała.\n4. Odstaw sztangę kontrolowanie, odginając najpierw biodra.",
    primaryMuscles: ["back", "glutes", "hamstrings"],
    movementPattern: "hinge",
    equipment: "barbell",
  },
  {
    name: "Wyciskanie leżąc",
    instructions:
      "1. Połóż się na ławce, stopy płasko na podłodze, łopatki ściągnięte.\n2. Chwyć sztangę nieco szerzej niż barki.\n3. Opuść sztangę do środka klatki piersiowej, łokcie pod kątem ~45°.\n4. Wypchnij sztangę w górę do pełnego wyprostu ramion.",
    primaryMuscles: ["chest", "triceps"],
    movementPattern: "push",
    equipment: "barbell",
  },
  {
    name: "Wiosłowanie sztangą",
    instructions:
      "1. Stań w rozkroku, tułów pochylony ~45°, plecy proste.\n2. Chwyć sztangę nachwytem nieco szerzej niż barki.\n3. Przyciągnij sztangę do dolnej części brzucha, prowadząc łokcie wzdłuż ciała.\n4. Opuść kontrolowanie do pełnego wyprostu ramion.",
    primaryMuscles: ["back", "biceps"],
    movementPattern: "pull",
    equipment: "barbell",
  },
  {
    name: "Pompki",
    instructions:
      "1. Ustaw dłonie pod barkami, ciało w jednej linii od głowy do pięt.\n2. Napnij brzuch i pośladki.\n3. Uginaj łokcie, opuszczając klatkę tuż nad podłogę.\n4. Odepchnij się do pozycji wyjściowej.",
    primaryMuscles: ["chest", "triceps"],
    movementPattern: "push",
    equipment: "bodyweight",
  },
  {
    name: "Podciąganie",
    instructions:
      "1. Chwyć drążek nachwytem na szerokość barków.\n2. Zawieś się swobodnie, napnij brzuch.\n3. Pociągnij ciało w górę, aż broda znajdzie się nad drążkiem.\n4. Opuść się kontrolowanie do pełnego zwisu.",
    primaryMuscles: ["back", "biceps"],
    movementPattern: "pull",
    equipment: "bodyweight",
  },
  {
    name: "Wykroki z hantlami",
    instructions:
      "1. Stań prosto, hantle w dłoniach wzdłuż ciała.\n2. Zrób duży krok naprzód, uginając oba kolana do ~90°.\n3. Tylne kolano zatrzymaj tuż nad podłogą.\n4. Odepchnij się przednią stopą i wróć do pozycji wyjściowej.",
    primaryMuscles: ["quads", "glutes"],
    movementPattern: "lunge",
    equipment: "dumbbells",
  },
  {
    name: "Wyciskanie hantli nad głowę",
    instructions:
      "1. Stań prosto, hantle na wysokości barków, dłonie do przodu.\n2. Napnij brzuch, unikaj przeprostowania lędźwi.\n3. Wypchnij hantle nad głowę do pełnego wyprostu ramion.\n4. Opuść kontrolowanie do wysokości barków.",
    primaryMuscles: ["shoulders", "triceps"],
    movementPattern: "push",
    equipment: "dumbbells",
  },
  {
    name: "Rozpiętki z hantlami na ławce",
    instructions:
      "1. Połóż się na ławce, hantle nad klatką, łokcie lekko ugięte.\n2. Rozwiedź ramiona szeroko, obniżając hantle do wysokości klatki.\n3. Poczuj rozciągnięcie klatki piersiowej.\n4. Zbliż hantle po tej samej trajektorii do góry.",
    primaryMuscles: ["chest"],
    movementPattern: "push",
    equipment: "dumbbells",
  },
  {
    name: "Przysiad bułgarski",
    instructions:
      "1. Oprzyj tylną stopę na ławce za sobą, hantle w dłoniach.\n2. Uginaj przednie kolano, opuszczając biodra pionowo w dół.\n3. Zejdź do momentu równoległości przedniego uda z podłogą.\n4. Odepchnij się piętą przedniej stopy do góry.",
    primaryMuscles: ["quads", "glutes"],
    movementPattern: "squat",
    equipment: "bench",
  },
  {
    name: "Martwy ciąg rumuński z hantlami",
    instructions:
      "1. Stań prosto, hantle przed udami, kolana lekko ugięte.\n2. Odchyl biodra do tyłu, obniżając hantle wzdłuż nóg.\n3. Zejdź do poczucia rozciągania w tylnej stronie ud.\n4. Wróć do pionu, mocno napinając pośladki.",
    primaryMuscles: ["hamstrings", "glutes"],
    movementPattern: "hinge",
    equipment: "dumbbells",
  },
  {
    name: "Kettlebell swing",
    instructions:
      "1. Stań w rozkroku, kettlebell przed tobą na podłodze.\n2. Chwyć rączkę oburącz, odchyl biodra i wykonaj zamach między nogami.\n3. Mocno wyprostuj biodra, wypychając kettlebell do wysokości klatki.\n4. Pozwól ciężarowi swobodnie wrócić i powtórz rytm.",
    primaryMuscles: ["glutes", "hamstrings"],
    movementPattern: "hinge",
    equipment: "kettlebell",
  },
  {
    name: "Deska (plank)",
    instructions:
      "1. Oprzyj się na przedramionach i palcach stóp.\n2. Ustaw ciało w jednej prostej linii od głowy do pięt.\n3. Napnij brzuch i pośladki, oddychaj spokojnie.\n4. Utrzymaj pozycję przez wyznaczony czas.",
    primaryMuscles: ["core"],
    movementPattern: "isometric",
    equipment: "bodyweight",
  },
  {
    name: "Russian twist",
    instructions:
      "1. Usiądź, unieś stopy nad podłogę, tułów odchylony ~45°.\n2. Spleć dłonie przed klatką lub trzymaj ciężar.\n3. Skręcaj tułów na przemian w prawo i w lewo.\n4. Utrzymaj napięcie brzucha przez cały ruch.",
    primaryMuscles: ["core"],
    movementPattern: "rotation",
    equipment: "bodyweight",
  },
  {
    name: "Wiosłowanie z gumą oporową",
    instructions:
      "1. Usiądź prostując nogi, gumę zaczep o stopy.\n2. Chwyć końce gumy, plecy proste.\n3. Przyciągnij gumę do brzucha, ściągając łopatki.\n4. Wróć kontrolowanie do wyprostu ramion.",
    primaryMuscles: ["back", "biceps"],
    movementPattern: "pull",
    equipment: "resistance_bands",
  },
  {
    name: "Wyciskanie na maszynie (leg press)",
    instructions:
      "1. Usiądź w maszynie, stopy na platformie na szerokość bioder.\n2. Odblokuj zabezpieczenia i uginaj kolana do ~90°.\n3. Wypchnij platformę do niemal pełnego wyprostu (bez blokowania kolan).\n4. Opuść kontrolowanie.",
    primaryMuscles: ["quads", "glutes"],
    movementPattern: "squat",
    equipment: "machine",
  },
  {
    name: "Ściąganie drążka wyciągu",
    instructions:
      "1. Usiądź przy wyciągu, uda zablokowane pod wałkami.\n2. Chwyć drążek nachwytem szerzej niż barki.\n3. Pociągnij drążek do górnej części klatki, łokcie w dół i do tyłu.\n4. Wróć kontrolowanie do pełnego wyprostu ramion.",
    primaryMuscles: ["back", "biceps"],
    movementPattern: "pull",
    equipment: "cable",
  },
  {
    name: "Farmer's walk",
    instructions:
      "1. Chwyć ciężkie hantle lub kettlebelle w obie dłonie.\n2. Stań prosto, łopatki ściągnięte, brzuch napięty.\n3. Maszeruj małymi, szybkimi krokami przez wyznaczony dystans.\n4. Odstaw ciężary kontrolowanie, nie okrąglając pleców.",
    primaryMuscles: ["core", "full_body"],
    movementPattern: "carry",
    equipment: "dumbbells",
  },
  {
    name: "Hip thrust",
    instructions:
      "1. Oprzyj górną część pleców o ławkę, sztanga na biodrach.\n2. Stopy na szerokość bioder, pięty pod kolanami.\n3. Unieś biodra do pełnego wyprostu, mocno napinając pośladki.\n4. Opuść kontrolowanie, nie kładąc miednicy na podłodze.",
    primaryMuscles: ["glutes", "hamstrings"],
    movementPattern: "hinge",
    equipment: "bench",
  },
  {
    name: "TRX row",
    instructions:
      "1. Chwyć uchwyty TRX, ciało odchylone w jednej linii.\n2. Ręce wyprostowane, stopy stabilnie na podłodze.\n3. Przyciągnij klatkę do uchwytów, ściągając łopatki.\n4. Wróć kontrolowanie do pozycji wyjściowej.",
    primaryMuscles: ["back", "biceps"],
    movementPattern: "pull",
    equipment: "trx",
  },
];
