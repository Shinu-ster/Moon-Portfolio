import { pgTable, serial, varchar, text, boolean } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  imageUrl: text("image_url").notNull(),
  isFeatured: boolean("is_featured").default(false),
});

export type InsertProject = typeof projects.$inferInsert;

export type SelectProject = typeof projects.$inferSelect;
