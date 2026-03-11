import { z } from "zod";

const variableSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(255).optional().or(z.literal("")),
  defaultValue: z.string().max(255).optional().or(z.literal(""))
});

const attachmentSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  url: z.string().url(),
  size: z.number().min(1).max(10 * 1024 * 1024),
  type: z.string().min(1)
});

export const promptSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(500).optional().or(z.literal("")),
  content: z.string().min(1),
  category: z.string().max(100).optional().or(z.literal("")),
  tags: z.array(z.string().min(1).max(50)).max(20).default([]),
  model: z.string().max(100).optional().or(z.literal("")),
  variables: z.array(variableSchema).max(30).default([]),
  attachments: z.array(attachmentSchema).max(5).default([]),
  isPublic: z.boolean().default(false),
  shareToken: z.string().uuid().optional()
});

export const categorySchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#([A-Fa-f0-9]{6})$/).optional().or(z.literal("")),
  icon: z.string().max(50).optional().or(z.literal(""))
});

export const promptQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  model: z.string().optional(),
  tags: z.string().optional(),
  sort: z.enum(["created_at", "updated_at", "use_count", "title"]).default("updated_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
});
