import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { categories as categoriesTable, prompts as promptsTable } from "@/lib/db/schema";
import { sampleCategories, samplePrompts } from "@/lib/data/sample-data";
import { matchesPrompt } from "@/lib/utils/search";
import type { Category, PaginatedPrompts, Prompt, PromptFilters } from "@/types";

const state = {
  prompts: [...samplePrompts],
  categories: [...sampleCategories]
};

const fallbackCategoryColors = ["#2563EB", "#16A34A", "#D97706", "#DC2626", "#0891B2", "#7C3AED"];

function normalizeCategoryName(name?: string | null) {
  return name?.trim() ?? "";
}

function pickCategoryColor(name: string) {
  const hash = Array.from(name).reduce((total, char) => total + char.charCodeAt(0), 0);
  return fallbackCategoryColors[hash % fallbackCategoryColors.length];
}

async function ensureCategoryExists(name?: string | null) {
  const normalizedName = normalizeCategoryName(name);
  if (!normalizedName) {
    return null;
  }

  if (db) {
    const existingRows = await db.select().from(categoriesTable).where(eq(categoriesTable.name, normalizedName)).limit(1);
    const existing = existingRows[0];
    if (existing) {
      return existing;
    }

    const inserted = (
      await db
        .insert(categoriesTable)
        .values({
          id: crypto.randomUUID(),
          name: normalizedName,
          color: pickCategoryColor(normalizedName),
          icon: ""
        })
        .returning()
    )[0];

    return inserted ?? null;
  }

  const existing = state.categories.find((category) => category.name === normalizedName);
  if (existing) {
    return existing;
  }

  const category: Category = {
    id: crypto.randomUUID(),
    name: normalizedName,
    color: pickCategoryColor(normalizedName),
    icon: "",
    createdAt: new Date().toISOString()
  };
  state.categories.push(category);
  return category;
}

function sortPrompts(items: Prompt[], sort: PromptFilters["sort"] = "updated_at", order: PromptFilters["order"] = "desc") {
  const direction = order === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    const left =
      sort === "title"
        ? a.title.toLowerCase()
        : sort === "use_count"
          ? a.useCount
          : sort === "created_at"
            ? a.createdAt
            : a.updatedAt;
    const right =
      sort === "title"
        ? b.title.toLowerCase()
        : sort === "use_count"
          ? b.useCount
          : sort === "created_at"
            ? b.createdAt
            : b.updatedAt;

    if (left < right) {
      return -1 * direction;
    }
    if (left > right) {
      return 1 * direction;
    }
    return 0;
  });
}

export async function listPrompts(filters: PromptFilters = {}): Promise<PaginatedPrompts> {
  if (db) {
    const rows = await db.select().from(promptsTable).orderBy(desc(promptsTable.updatedAt));
    const prompts = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description ?? "",
      content: row.content,
      category: row.category ?? "",
      tags: row.tags,
      model: row.model ?? "",
      variables: row.variables,
      attachments: row.attachments,
      isPublic: row.isPublic,
      shareToken: row.shareToken,
      useCount: row.useCount,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    }));
    return paginatePrompts(prompts, filters);
  }

  return paginatePrompts(state.prompts, filters);
}

function paginatePrompts(source: Prompt[], filters: PromptFilters): PaginatedPrompts {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const filtered = sortPrompts(
    source.filter((prompt) => {
      if (!matchesPrompt(prompt, filters.q)) {
        return false;
      }
      if (filters.category && prompt.category !== filters.category) {
        return false;
      }
      if (filters.model && prompt.model !== filters.model) {
        return false;
      }
      if (filters.tags?.length && !filters.tags.every((tag) => prompt.tags.includes(tag))) {
        return false;
      }
      return true;
    }),
    filters.sort,
    filters.order
  );

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const offset = (page - 1) * limit;
  return {
    data: filtered.slice(offset, offset + limit),
    total,
    page,
    limit,
    totalPages
  };
}

export async function getPrompt(id: string) {
  if (db) {
    const rows = await db.select().from(promptsTable).where(eq(promptsTable.id, id)).limit(1);
    const row = rows[0];
    return row
      ? {
          id: row.id,
          title: row.title,
          description: row.description ?? "",
          content: row.content,
          category: row.category ?? "",
          tags: row.tags,
          model: row.model ?? "",
          variables: row.variables,
          attachments: row.attachments,
          isPublic: row.isPublic,
          shareToken: row.shareToken,
          useCount: row.useCount,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString()
        }
      : null;
  }
  return state.prompts.find((prompt) => prompt.id === id) ?? null;
}

export async function getPromptByShareToken(token: string) {
  if (db) {
    const row = (
      await db
        .select()
        .from(promptsTable)
        .where(sql`${promptsTable.shareToken} = ${token} and ${promptsTable.isPublic} = true`)
        .limit(1)
    )[0];

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description ?? "",
      content: row.content,
      category: row.category ?? "",
      tags: row.tags,
      model: row.model ?? "",
      variables: row.variables,
      attachments: row.attachments,
      isPublic: row.isPublic,
      shareToken: row.shareToken,
      useCount: row.useCount,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    } satisfies Prompt;
  }

  return state.prompts.find((entry) => entry.shareToken === token && entry.isPublic) ?? null;
}

export async function createPrompt(input: Omit<Prompt, "id" | "createdAt" | "updatedAt" | "useCount" | "shareToken"> & Partial<Pick<Prompt, "shareToken">>) {
  const categoryName = normalizeCategoryName(input.category);
  await ensureCategoryExists(categoryName);

  const prompt: Prompt = {
    ...input,
    category: categoryName,
    id: crypto.randomUUID(),
    useCount: 0,
    shareToken: input.shareToken ?? crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db) {
    await db.insert(promptsTable).values({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags,
      model: prompt.model,
      variables: prompt.variables,
      attachments: prompt.attachments,
      isPublic: prompt.isPublic,
      shareToken: prompt.shareToken,
      useCount: prompt.useCount
    });
  } else {
    state.prompts.unshift(prompt);
  }

  return prompt;
}

export async function updatePrompt(id: string, input: Partial<Prompt>) {
  const existing = await getPrompt(id);
  if (!existing) {
    return null;
  }

  const categoryName = Object.prototype.hasOwnProperty.call(input, "category")
    ? normalizeCategoryName(input.category)
    : normalizeCategoryName(existing.category);

  await ensureCategoryExists(categoryName);

  const updated: Prompt = {
    ...existing,
    ...input,
    category: categoryName,
    id,
    updatedAt: new Date().toISOString()
  };

  if (db) {
    await db
      .update(promptsTable)
      .set({
        title: updated.title,
        description: updated.description,
        content: updated.content,
        category: updated.category,
        tags: updated.tags,
        model: updated.model,
        variables: updated.variables,
        attachments: updated.attachments,
        isPublic: updated.isPublic,
        shareToken: updated.shareToken,
        useCount: updated.useCount,
        updatedAt: new Date()
      })
      .where(eq(promptsTable.id, id));
  } else {
    state.prompts = state.prompts.map((prompt) => (prompt.id === id ? updated : prompt));
  }

  return updated;
}

export async function deletePrompt(id: string) {
  const existing = await getPrompt(id);
  if (!existing) {
    return null;
  }

  if (db) {
    await db.delete(promptsTable).where(eq(promptsTable.id, id));
  } else {
    state.prompts = state.prompts.filter((prompt) => prompt.id !== id);
  }
  return existing;
}

export async function incrementPromptUse(id: string) {
  const prompt = await getPrompt(id);
  if (!prompt) {
    return null;
  }
  return updatePrompt(id, { useCount: prompt.useCount + 1 });
}

export async function listCategories(): Promise<Category[]> {
  if (db) {
    const [rows, promptRows] = await Promise.all([
      db.select().from(categoriesTable).orderBy(categoriesTable.name),
      db.select({ category: promptsTable.category }).from(promptsTable)
    ]);

    const categories = rows.map((row) => ({
      id: row.id,
      name: row.name,
      color: row.color ?? "",
      icon: row.icon ?? "",
      createdAt: row.createdAt.toISOString()
    }));

    const existingNames = new Set(categories.map((category) => category.name));
    const missingNames = [...new Set(promptRows.map((row) => normalizeCategoryName(row.category)).filter(Boolean))].filter(
      (name) => !existingNames.has(name)
    );

    if (!missingNames.length) {
      return categories;
    }

    const insertedCategories = await Promise.all(missingNames.map((name) => ensureCategoryExists(name)));
    return [...categories, ...insertedCategories]
      .filter((category): category is NonNullable<typeof category> => Boolean(category))
      .map((category) => ({
        id: category.id,
        name: category.name,
        color: category.color ?? "",
        icon: category.icon ?? "",
        createdAt: category.createdAt instanceof Date ? category.createdAt.toISOString() : category.createdAt
      }))
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  return state.categories;
}

export async function createCategory(input: Omit<Category, "id" | "createdAt">) {
  const normalizedName = normalizeCategoryName(input.name);
  const category: Category = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
    name: normalizedName,
    color: input.color || pickCategoryColor(normalizedName)
  };

  if (db) {
    const existingRows = await db.select().from(categoriesTable).where(eq(categoriesTable.name, normalizedName)).limit(1);
    const existing = existingRows[0];
    if (existing) {
      return {
        id: existing.id,
        name: existing.name,
        color: existing.color ?? "",
        icon: existing.icon ?? "",
        createdAt: existing.createdAt.toISOString()
      };
    }

    await db.insert(categoriesTable).values({
      id: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon
    });
  } else {
    if (!state.categories.some((existing) => existing.name === normalizedName)) {
      state.categories.push(category);
    }
  }

  return category;
}

export async function deleteCategory(id: string) {
  if (db) {
    const rows = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id)).limit(1);
    const category = rows[0];
    if (!category) {
      return null;
    }
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    return category;
  }

  const existing = state.categories.find((category) => category.id === id) ?? null;
  if (!existing) {
    return null;
  }
  state.categories = state.categories.filter((category) => category.id !== id);
  return existing;
}

export async function getDashboardStats() {
  const prompts = (await listPrompts({ limit: 100 })).data;
  const categories = await listCategories();
  const totalPrompts = prompts.length;
  const mostUsedPrompt = [...prompts].sort((a, b) => b.useCount - a.useCount)[0] ?? null;
  const promptsThisWeek = prompts.filter((prompt) => Date.now() - new Date(prompt.createdAt).getTime() < 7 * 86400000).length;

  return {
    totalPrompts,
    totalCategories: categories.length,
    mostUsedPrompt,
    promptsThisWeek,
    starredPrompts: prompts.filter((prompt) => prompt.starred).slice(0, 4),
    recentPrompts: [...prompts].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, 6),
    popularPrompts: [...prompts].sort((a, b) => b.useCount - a.useCount).slice(0, 4)
  };
}
