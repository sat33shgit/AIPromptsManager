"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { PaginatedPrompts, Prompt } from "@/types";

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
    staleTime: 60_000,
    queryFn: async () => {
      const response = await fetch(`/api/prompts?${buildQuery(params)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch prompts");
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
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["prompt", id] });
      }
    }
  });
}
