import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { scans } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params } : { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const scan = (await db.query.scans.findFirst({
      where: eq(scans.id, id),
    })) as {
      id: string;
      imageUrl: string;
      result: string;
      confidence: number;
      metadata?: {
        drugName?: string;
        manufacturer?: string;
        indicators?: string[];
      };
      geolocation: string;
      createdAt?: Date;
    };

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    // Format the response to match the expected structure in the frontend
    return NextResponse.json({
      id: scan.id,
      imageUrl: scan.imageUrl,
      result: scan.result,
      confidence: scan.confidence,
      drugName: scan.metadata?.drugName || "Unknown",
      manufacturer: scan.metadata?.manufacturer || "Unknown",
      indicators: scan.metadata?.indicators || [],
      geolocation: scan.geolocation,
      createdAt: scan.createdAt?.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching scan:", error);
    return NextResponse.json(
      { error: "Failed to fetch scan" },
      { status: 500 }
    );
  }
}