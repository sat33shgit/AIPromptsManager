"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebounce } from "@/hooks/useDebounce";

export function useSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    const nextValue = searchParams.get("q") ?? "";
    setValue((current) => (current === nextValue ? current : nextValue));
  }, [searchParams]);

  function clear() {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("q");
    next.delete("focus");
    next.delete("page");

    setValue("");
    router.replace(next.size ? `${pathname}?${next.toString()}` : pathname, { scroll: false });
  }

  useEffect(() => {
    const next = new URLSearchParams(searchParams.toString());
    if (debounced) {
      next.set("q", debounced);
    } else {
      next.delete("q");
    }
    next.delete("focus");
    next.delete("page");

    const currentQuery = searchParams.toString();
    const nextQuery = next.toString();

    if (nextQuery === currentQuery) {
      return;
    }

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [debounced, pathname, router, searchParams]);

  return { value, setValue, clear };
}
