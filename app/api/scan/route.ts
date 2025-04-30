import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { nanoid } from "nanoid"
import { analyzeDrugImage } from "@/lib/ai-service"
import { db } from "@/drizzle/db"
import { scans } from "@/drizzle/schema"
import sharp from "sharp"
import { env } from '@/data/env/client';

// Get max image size from env or default to 4.5MB
const MAX_IMAGE_SIZE_MB = Number(env.NEXT_PUBLIC_MAX_IMAGE_SIZE_MB || "4.5")
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

// Function to downscale an image if needed
async function processImage(file: File): Promise<Buffer> {
  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Check file size
  if (buffer.length <= MAX_IMAGE_SIZE_BYTES) {
    return buffer // Return original if under the size limit
  }

  // Resize the image
  console.log(`Resizing image from ${buffer.length} bytes (${(buffer.length / 1024 / 1024).toFixed(2)}MB)`)

  // Start with 80% quality
  let quality = 80
  let resizedImage = await sharp(buffer).jpeg({ quality }).toBuffer()

  // If still too large, reduce quality or dimensions further
  while (resizedImage.length > MAX_IMAGE_SIZE_BYTES && quality > 30) {
    quality -= 10
    resizedImage = await sharp(buffer).jpeg({ quality }).toBuffer()
  }

  // If still too big after quality reduction, reduce dimensions
  if (resizedImage.length > MAX_IMAGE_SIZE_BYTES) {
    const metadata = await sharp(buffer).metadata()
    const width = metadata.width || 1000
    const height = metadata.height || 1000

    // Reduce to 70% of original size
    const newWidth = Math.round(width * 0.7)
    const newHeight = Math.round(height * 0.7)

    resizedImage = await sharp(buffer).resize(newWidth, newHeight).jpeg({ quality }).toBuffer()
  }

  console.log(`Resized to ${resizedImage.length} bytes (${(resizedImage.length / 1024 / 1024).toFixed(2)}MB)`)
  return resizedImage
}

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

    try {
      // Process image (resize if needed)
      const processedImageBuffer = await processImage(file)

      // Create a new file object from the processed buffer
      const processedFile = new File([processedImageBuffer], file.name, { type: file.type || "image/jpeg" })

      // Upload the processed image to Vercel Blob
      const blob = await put(`scans/${nanoid()}-${file.name}`, processedFile, {
        access: "public",
      })

      // Analyze the image using the configured AI service
      const analysis = await analyzeDrugImage(blob.url)

      try {
        // Store the scan in the database
        const [scanRecord] = await db
          .insert(scans)
          .values({
            imageUrl: blob.url,
            result: analysis.result,
            confidence: analysis.confidence,
            geolocation,
            metadata: {
              drugName: analysis.drugName || "Unknown",
              manufacturer: analysis.manufacturer || "Unknown",
              indicators: analysis.indicators,
            },
            createdAt: new Date(),
          })
          .returning()

        // Return the analysis result
        return NextResponse.json({
          id: scanRecord.id,
          imageUrl: blob.url,
          result: analysis.result,
          confidence: analysis.confidence,
          drugName: analysis.drugName || "Unknown",
          manufacturer: analysis.manufacturer || "Unknown",
          indicators: analysis.indicators,
          geolocation,
          createdAt: scanRecord.createdAt?.toISOString(),
        })
      } catch (dbError) {
        console.error("Database error:", dbError)

        // If database fails, still return a valid response with the analysis
        // Generate a client-side ID for demo purposes
        const clientId = nanoid()

        return NextResponse.json({
          id: clientId,
          imageUrl: blob.url,
          result: analysis.result,
          confidence: analysis.confidence,
          drugName: analysis.drugName || "Unknown",
          manufacturer: analysis.manufacturer || "Unknown",
          indicators: analysis.indicators,
          geolocation,
          createdAt: new Date().toISOString(),
        })
      }
    } catch (aiError) {
      console.error("AI or Blob error:", aiError)
      return NextResponse.json(
        {
          error: "Failed to analyze image. Please try again.",
          details: aiError instanceof Error ? aiError.message : String(aiError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error processing scan:", error)
    return NextResponse.json(
      {
        error: "Failed to process scan",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
