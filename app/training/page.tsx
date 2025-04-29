import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/drizzle/db"
import { trainingImages } from "@/drizzle/schema"
import { put } from "@vercel/blob"
import { nanoid } from "nanoid"
import { auth } from "@clerk/nextjs/server"
import { auditLog } from "@/lib/audit"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const label = formData.get("label") as string
    const metadata = formData.get("metadata") as string

    if (!file || !label) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (label !== "fake" && label !== "original") {
      return NextResponse.json({ error: "Invalid label" }, { status: 400 })
    }

    // Upload the image to Vercel Blob
    const blob = await put(`training/${nanoid()}-${file.name}`, file, {
      access: "public",
    })

    // Parse metadata if provided
    let parsedMetadata = {}
    if (metadata) {
      try {
        parsedMetadata = JSON.parse(metadata)
      } catch (e) {
        console.error("Invalid metadata JSON:", e)
      }
    }

    // Get user ID from database
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.clerkUserId, userId),
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Save training image to database
    const [trainingImage] = await db
      .insert(trainingImages)
      .values({
        imageUrl: blob.url,
        label,
        uploadedBy: user.id,
        metadata: parsedMetadata,
        status: "pending",
        createdAt: new Date(),
      })
      .returning()

    // Log the action
    await auditLog({
      userId: user.id,
      action: "upload",
      details: `Uploaded training image: ${trainingImage.id} (${label})`,
    })

    return NextResponse.json({
      id: trainingImage.id,
      imageUrl: trainingImage.imageUrl,
      label: trainingImage.label,
      status: trainingImage.status,
    })
  } catch (error) {
    console.error("Error processing training image:", error)
    return NextResponse.json({ error: "Failed to process training image" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const label = searchParams.get("label")

    let query = db.select().from(trainingImages)

    if (status) {
      query = query.where(eq(trainingImages.status, status as any))
    }

    if (label) {
      query = query.where(eq(trainingImages.label, label))
    }

    const images = await query.orderBy(trainingImages.createdAt, "desc")

    return NextResponse.json(images)
  } catch (error) {
    console.error("Error fetching training images:", error)
    return NextResponse.json({ error: "Failed to fetch training images" }, { status: 500 })
  }
}
