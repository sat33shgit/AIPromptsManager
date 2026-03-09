"use client";

import { useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/useSearch";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { value, setValue } = useSearch();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const element = document.getElementById("global-search");
        element?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
      <Input
        id="global-search"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          const next = new URLSearchParams(searchParams.toString());
          next.set("page", "1");
          router.replace(`/prompts?${next.toString()}`);
        }}
        className="pl-9"
        placeholder='Search prompts, or use tag:marketing / "exact phrase"'
        aria-label="Search prompts"
      />
    </div>
  );
}
