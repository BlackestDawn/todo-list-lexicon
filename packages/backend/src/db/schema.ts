import { pgTable, timestamp, varchar, uuid, boolean } from "drizzle-orm/pg-core";

const getCurrentDate = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000);
}
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(getCurrentDate),
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 1024 }),
  finishBy: timestamp("finish_by"),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(getCurrentDate),
  login: varchar("login", { length: 256 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }),
});

export const refresh_tokens = pgTable("refresh_tokens", {
  token: varchar("token", { length: 256 }).primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(getCurrentDate),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
});
