import { db } from "@/drizzle/db"
import { auditLogs } from "@/drizzle/schema"

type AuditAction = "login" | "upload" | "model_train"

interface AuditLogParams {
  userId: string
  action: AuditAction
  details?: string
}

export async function auditLog({ userId, action, details }: AuditLogParams) {
  try {
    await db.insert(auditLogs).values({
      userId,
      action,
      details,
      createdAt: new Date(),
    })
  } catch (error) {
    console.error("Error creating audit log:", error)
  }
}
