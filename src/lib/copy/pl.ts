/**
 * Polish UI strings — the single copy module (market = trainers in Poland).
 * Structure allows adding `en.ts` later with the same shape.
 */

export const pl = {
  common: {
    save: "Zapisz",
    cancel: "Anuluj",
    delete: "Usuń",
    edit: "Edytuj",
    add: "Dodaj",
    back: "Wstecz",
    search: "Szukaj…",
    loading: "Ładowanie…",
    confirmDelete: "Na pewno usunąć? Tej operacji nie można cofnąć.",
  },
  nav: {
    library: "Baza ćwiczeń",
    clients: "Klienci",
    programs: "Programy",
    designSystem: "Design system",
  },
  library: {
    title: "Baza ćwiczeń",
    addExercise: "Dodaj ćwiczenie",
    editExercise: "Edytuj ćwiczenie",
    name: "Nazwa ćwiczenia",
    instructions: "Instrukcja wykonania (krok po kroku)",
    primaryMuscles: "Partie mięśniowe",
    movementPattern: "Wzorzec ruchu",
    equipment: "Sprzęt",
    curated: "Biblioteka platformy",
    custom: "Własne",
    empty: "Brak ćwiczeń. Dodaj pierwsze ćwiczenie do swojej bazy.",
    filterAll: "Wszystkie",
  },
  clients: {
    title: "Klienci",
    addClient: "Dodaj klienta",
    editClient: "Edytuj klienta",
    name: "Imię i nazwisko",
    email: "E-mail",
    phone: "Telefon",
    status: { active: "Aktywny", archived: "Zarchiwizowany" },
    empty: "Brak klientów. Dodaj pierwszego klienta.",
    onboardingTitle: "Ankieta onboardingowa",
    onboarding: {
      healthHistory: "Historia zdrowia",
      goals: "Cele treningowe",
      preferences: "Preferencje",
      injuries: "Kontuzje i ograniczenia",
      experienceLevel: "Poziom zaawansowania",
      levels: {
        beginner: "Początkujący",
        intermediate: "Średniozaawansowany",
        advanced: "Zaawansowany",
      },
      notes: "Notatki",
    },
  },
  programs: {
    title: "Programy",
    addProgram: "Nowy program",
    editProgram: "Edytuj program",
    name: "Nazwa programu",
    notes: "Notatki",
    client: "Klient",
    status: { draft: "Szkic", active: "Aktywny", archived: "Zarchiwizowany" },
    empty: "Brak programów. Utwórz pierwszy program.",
    addExercise: "Dodaj ćwiczenie do programu",
    sets: "Serie",
    reps: "Powtórzenia",
    rest: "Przerwa (s)",
    itemNotes: "Notatki do ćwiczenia",
    clientView: "Widok klienta",
    print: "Drukuj",
    updatedAt: "Zaktualizowano",
  },
  teaser: {
    lockedClientsTitle: "Limit 3 klientów osiągnięty",
    lockedClientsBody:
      "Wersja darmowa obsługuje maksymalnie 3 klientów. Przejdź na Pro, aby zarządzać nieograniczoną liczbą klientów — z kopią zapasową w chmurze.",
    lockedVisualTitle: "Ilustracje ćwiczeń — funkcja Pro",
    lockedVisualBody:
      "Wersja Pro odblokowuje bibliotekę przejrzystych ilustracji liniowych z dokładnymi instrukcjami wykonania.",
    lockedSyncTitle: "Synchronizacja w chmurze — funkcja Pro",
    lockedSyncBody:
      "Twoje dane są przechowywane tylko na tym urządzeniu. Wersja Pro zapewnia kopię zapasową i dostęp z każdego urządzenia.",
    upgradeCta: "Przejdź na Pro",
    learnMore: "Dowiedz się więcej",
  },
  landing: {
    headline: "Cyfrowe narzędzie pracy trenera personalnego",
    subtitle:
      "Baza ćwiczeń, klienci i programy treningowe w jednym miejscu. Zacznij za darmo — bez rejestracji.",
    downloadCta: "Pobierz wersję darmową",
    proCta: "Przejdź na Pro",
  },
} as const;

export type Copy = typeof pl;
