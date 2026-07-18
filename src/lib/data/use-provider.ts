"use client";

import { useEffect, useState } from "react";
import type { DataProvider } from "@/lib/data/provider";
import { getLocalProvider } from "@/lib/data/local";

/**
 * Provider hook — returns the active DataProvider.
 * Free build: always LocalProvider. Cloud build (Phase 2) swaps this
 * to return SupabaseProvider when env vars are present and the
 * trainer is authenticated.
 */
export function useProvider(): DataProvider | null {
  const [provider, setProvider] = useState<DataProvider | null>(null);
  useEffect(() => {
    setProvider(getLocalProvider());
  }, []);
  return provider;
}
