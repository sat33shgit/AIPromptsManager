"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/useSearch";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { value, setValue, clear } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (pathname !== "/prompts" || searchParams.get("focus") !== "search") {
      return;
    }

    inputRef.current?.focus();
    const next = new URLSearchParams(searchParams.toString());
    next.delete("focus");
    router.replace(next.size ? `${pathname}?${next.toString()}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  function clearSearch() {
    clear();
    inputRef.current?.focus();
  }

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
      <Input
        ref={inputRef}
        id="global-search"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        className="pr-10 pl-9"
        placeholder='Search prompts, or use tag:marketing / "exact phrase"'
        aria-label="Search prompts"
      />
      {value ? (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={clearSearch}
          className="focus-ring absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
