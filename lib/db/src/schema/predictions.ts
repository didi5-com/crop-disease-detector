import { pgTable, text, serial, real, boolean, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const predictionSeverityEnum = pgEnum("prediction_severity", ["low", "medium", "high"]);

export const predictionsTable = pgTable("predictions", {
  id: serial("id").primaryKey(),
  cropType: text("crop_type").notNull(),
  diseaseName: text("disease_name").notNull(),
  confidence: real("confidence").notNull(),
  severity: predictionSeverityEnum("severity").notNull(),
  treatment: text("treatment").notNull(),
  imageUrl: text("image_url"),
  isHealthy: boolean("is_healthy").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPredictionSchema = createInsertSchema(predictionsTable).omit({ id: true, createdAt: true });
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictionsTable.$inferSelect;
