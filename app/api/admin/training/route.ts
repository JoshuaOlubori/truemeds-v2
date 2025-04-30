import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { nanoid } from "nanoid"
import { db } from "@/drizzle/db"
import { trainingImages } from "@/drizzle/schema"
import { desc } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
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

    // Store in database
    const [trainingImage] = await db
      .insert(trainingImages)
      .values({
        imageUrl: blob.url,
        label,
        uploadedBy: "admin", // Since we removed authentication
        metadata: parsedMetadata,
        status: "pending",
        createdAt: new Date(),
      })
      .returning()

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


export async function GET() {
  try {
    const images = await db.select().from(trainingImages).orderBy(desc(trainingImages.createdAt))
    return NextResponse.json(images)
  } catch (error) {
    console.error("Error fetching training images:", error)
    return NextResponse.json({ error: "Failed to fetch training images" }, { status: 500 })
  }
}
