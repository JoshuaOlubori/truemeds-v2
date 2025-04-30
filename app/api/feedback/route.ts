import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/drizzle/db"
import { sql } from "drizzle-orm"

interface FeedbackData {
  scanId: string
  isHelpful: boolean
  resultType: string
}

export async function POST(request: NextRequest) {
  try {
    const data: FeedbackData = await request.json()

    // Store feedback in database
    // Note: We would typically have a feedback table, but for now we'll just log it
    await db.execute(sql`
      INSERT INTO scan_feedback (scan_id, is_helpful, result_type, created_at)
      VALUES (${data.scanId}, ${data.isHelpful}, ${data.resultType}, NOW())
      ON CONFLICT (scan_id) DO UPDATE
      SET is_helpful = ${data.isHelpful}, updated_at = NOW()
    `)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving feedback:", error)
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
  }
}
