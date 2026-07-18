"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { pl } from "@/lib/copy/pl";

/**
 * /tool → /tool/clients. Client-side replace because server `redirect()`
 * is not supported with `output: "export"` (it prerenders as 404).
 */
export default function ToolIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/tool/clients");
  }, [router]);
  return <p>{pl.common.loading}</p>;
}
