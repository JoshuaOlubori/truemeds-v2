import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/drizzle/db"
import { scans } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const scan = await db.query.scans.findFirst({
      where: eq(scans.id, id),
    })

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    return NextResponse.json(scan)
  } catch (error) {
    console.error("Error fetching scan:", error)
    return NextResponse.json({ error: "Failed to fetch scan" }, { status: 500 })
  }
}
