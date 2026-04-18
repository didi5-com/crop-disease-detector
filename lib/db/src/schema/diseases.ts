import { pgTable, text, serial, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const severityEnum = pgEnum("severity", ["low", "medium", "high"]);

export const diseasesTable = pgTable("diseases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cropType: text("crop_type").notNull(),
  description: text("description").notNull(),
  symptoms: text("symptoms").notNull(),
  treatment: text("treatment").notNull(),
  severity: severityEnum("severity").notNull(),
  imageUrl: text("image_url"),
});

export const insertDiseaseSchema = createInsertSchema(diseasesTable).omit({ id: true });
export type InsertDisease = z.infer<typeof insertDiseaseSchema>;
export type Disease = typeof diseasesTable.$inferSelect;
