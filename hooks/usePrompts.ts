"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Category, PaginatedPrompts, Prompt } from "@/types";

type QueryParams = Record<string, string | number | undefined>;

function buildQuery(params?: QueryParams) {
  const search = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  });
  return search.toString();
}

export function usePrompts(params?: QueryParams) {
  return useQuery<PaginatedPrompts>({
    queryKey: ["prompts", params],
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    queryFn: async () => {
      const response = await fetch(`/api/prompts?${buildQuery(params)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch prompts");
      }
      return response.json();
    }
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    }
  });
}

export function usePrompt(id?: string) {
  return useQuery<Prompt>({
    queryKey: ["prompt", id],
    enabled: Boolean(id),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    queryFn: async () => {
      const response = await fetch(`/api/prompts/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch prompt");
      }
      return response.json();
    }
  });
}

export function usePromptMutation(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Prompt>) => {
      const response = await fetch(id ? `/api/prompts/${id}` : "/api/prompts", {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("Failed to save prompt");
      }
      return response.json() as Promise<Prompt>;
    },
    onSuccess: (data) => {
      // Optimistically update the prompt cache with the fresh data
      if (id) {
        queryClient.setQueryData(["prompt", id], data);
      }
      // Invalidate the list to pick up changes
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });
}
