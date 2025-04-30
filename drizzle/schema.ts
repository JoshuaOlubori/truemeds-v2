import { pgTable, uuid, text, timestamp, jsonb, integer, pgEnum, index, boolean } from "drizzle-orm/pg-core"

// Shared timestamp fields
const createdAt = timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
const updatedAt = timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date())
const id = uuid("id").primaryKey().defaultRandom()

// Admin Users
export const UsersTable = pgTable(
  "users",
  {
    id,
    clerkUserId: text("clerk_user_id").notNull().unique(),
    email: text("email").unique().notNull(),
    role: text("role").notNull().default("admin"),
    createdAt,
    updatedAt,
  },
  (table) => {
    return [index("email_idx").on(table.email)]
  },
)

// Anonymous Scans
export const scans = pgTable(
  "scans",
  {
    id,
    imageUrl: text("image_url").notNull(),
    result: text("result"), // 'fake' or 'original'
    confidence: integer("confidence"), // Percentage
    geolocation: jsonb("geolocation"), // { lat: number, lng: number }
    metadata: jsonb("metadata"), // { drugName: string, manufacturer: string, indicators: string[] }
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return [index("scan_created_at_idx").on(table.createdAt)]
  },
)

// Scan Feedback
export const scanFeedback = pgTable(
  "scan_feedback",
  {
    id,
    scanId: uuid("scan_id")
      .references(() => scans.id)
      .notNull(),
    isHelpful: boolean("is_helpful").notNull(),
    resultType: text("result_type").notNull(), // 'fake' or 'original'
    createdAt,
    updatedAt,
  },
  (table) => {
    return [index("scan_feedback_scan_id_idx").on(table.scanId)]
  },
)

// Training Images
export const trainingStatusEnum = pgEnum("training_status", ["pending", "processing", "trained"])

export const trainingImages = pgTable(
  "training_images",
  {
    id,
    imageUrl: text("image_url").notNull(),
    label: text("label").notNull(), // 'fake' or 'original'
    uploadedBy: text("uploaded_by").references(() => UsersTable.clerkUserId),
    status: trainingStatusEnum("status").default("pending"),
    metadata: jsonb("metadata"), // { manufacturer: string, drugName: string }
    createdAt,
  },
  (table) => {
    return [index("training_status_idx").on(table.status)]
  },
)

// Audit Logs
export const auditActions = pgEnum("audit_action", ["login", "upload", "model_train"])

export const auditLogs = pgTable(
  "audit_logs",
  {
    id,
    userId: text("user_id")
      .references(() => UsersTable.clerkUserId)
      .notNull(),
    action: auditActions("action").notNull(),
    details: text("details"),
    createdAt,
  },
  (table) => {
    return [index("audit_user_id_idx").on(table.userId)]
  },
)
