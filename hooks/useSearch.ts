"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebounce } from "@/hooks/useDebounce";

export function useSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    const next = new URLSearchParams(searchParams.toString());
    if (debounced) {
      next.set("q", debounced);
    } else {
      next.delete("q");
    }
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [debounced, pathname, router, searchParams]);

  return useMemo(() => ({ value, setValue, debounced }), [debounced, value]);
}
