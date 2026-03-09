import { boolean, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const prompts = pgTable("prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }),
  tags: text("tags").array().default([]).notNull(),
  model: varchar("model", { length: 100 }),
  variables: jsonb("variables").$type<Array<{ name: string; description?: string; defaultValue?: string }>>().default([]).notNull(),
  attachments: jsonb("attachments").$type<Array<{ key: string; name: string; url: string; size: number; type: string }>>().default([]).notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  shareToken: uuid("share_token").defaultRandom().notNull(),
  useCount: integer("use_count").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  color: varchar("color", { length: 7 }),
  icon: varchar("icon", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
