import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/drizzle/db"
import { scans, trainingImages } from "@/drizzle/schema"
import { auth } from "@clerk/nextjs/server"
import { sql } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total scans
    const totalScansResult = await db.select({ count: sql`count(*)` }).from(scans)
    const totalScans = Number(totalScansResult[0].count)

    // Get scans in the last 24 hours
    const last24HoursResult = await db
      .select({ count: sql`count(*)` })
      .from(scans)
      .where(sql`created_at > NOW() - INTERVAL '24 hours'`)
    const last24Hours = Number(last24HoursResult[0].count)

    // Get scans in the last 7 days
    const last7DaysResult = await db
      .select({ count: sql`count(*)` })
      .from(scans)
      .where(sql`created_at > NOW() - INTERVAL '7 days'`)
    const last7Days = Number(last7DaysResult[0].count)

    // Get scans in the last 30 days
    const last30DaysResult = await db
      .select({ count: sql`count(*)` })
      .from(scans)
      .where(sql`created_at > NOW() - INTERVAL '30 days'`)
    const last30Days = Number(last30DaysResult[0].count)

    // Get fake detection rate
    const fakeDetectionResult = await db.select({ count: sql`count(*)` }).from(scans).where(sql`result = 'fake'`)
    const fakeDetections = Number(fakeDetectionResult[0].count)
    const fakeDetectionRate = totalScans > 0 ? (fakeDetections / totalScans) * 100 : 0

    // Get training images stats
    const trainingStatsResult = await db
      .select({
        total: sql`count(*)`,
        original: sql`sum(case when label = 'original' then 1 else 0 end)`,
        fake: sql`sum(case when label = 'fake' then 1 else 0 end)`,
        pending: sql`sum(case when status = 'pending' then 1 else 0 end)`,
        processing: sql`sum(case when status = 'processing' then 1 else 0 end)`,
        trained: sql`sum(case when status = 'trained' then 1 else 0 end)`,
      })
      .from(trainingImages)

    // Get monthly scan trend
    const monthlyTrendResult = await db.execute(sql`
      SELECT 
        to_char(date_trunc('month', created_at), 'Mon') as month,
        count(*) as count
      FROM scans
      WHERE created_at > NOW() - INTERVAL '12 months'
      GROUP BY date_trunc('month', created_at)
      ORDER BY date_trunc('month', created_at)
    `)

    return NextResponse.json({
      scans: {
        total: totalScans,
        last24Hours,
        last7Days,
        last30Days,
        fakeDetectionRate: fakeDetectionRate.toFixed(1),
        fakeDetections,
      },
      training: {
        total: Number(trainingStatsResult[0].total),
        original: Number(trainingStatsResult[0].original),
        fake: Number(trainingStatsResult[0].fake),
        pending: Number(trainingStatsResult[0].pending),
        processing: Number(trainingStatsResult[0].processing),
        trained: Number(trainingStatsResult[0].trained),
      },
      trends: {
        monthly: monthlyTrendResult.rows,
      },
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
