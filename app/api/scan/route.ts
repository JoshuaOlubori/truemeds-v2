import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/drizzle/db"
import { scans } from "@/drizzle/schema"
import { put } from "@vercel/blob"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Get geolocation data if available
    let geolocation = null
    const lat = formData.get("lat")
    const lng = formData.get("lng")

    if (lat && lng) {
      geolocation = { lat: Number.parseFloat(lat as string), lng: Number.parseFloat(lng as string) }
    }

    // Upload the image to Vercel Blob
    const blob = await put(`scans/${nanoid()}-${file.name}`, file, {
      access: "public",
    })

    // Simulate AI analysis
    // In a real app, you would call your AI service here
    const isFake = Math.random() > 0.5
    const confidence = Math.floor(Math.random() * 20) + 80 // Random number between 80-99

    // Save scan to database
    const [scan] = await db
      .insert(scans)
      .values({
        imageUrl: blob.url,
        result: isFake ? "fake" : "original",
        confidence,
        geolocation: geolocation,
        createdAt: new Date(),
      })
      .returning()

    return NextResponse.json({
      id: scan.id,
      imageUrl: scan.imageUrl,
      result: scan.result,
      confidence: scan.confidence,
    })
  } catch (error) {
    console.error("Error processing scan:", error)
    return NextResponse.json({ error: "Failed to process scan" }, { status: 500 })
  }
}
