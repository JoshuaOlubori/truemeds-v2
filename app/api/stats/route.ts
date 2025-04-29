import { NextResponse } from "next/server";
import {
  getTotalScans,
  getRecentScans,
  getFakeDetectionStats,
  getTrainingStats,
  getMonthlyTrends,
} from "@/server/db/stats";

export async function GET() {
  try {
    const [
      totalScans,
      recentScans,
      fakeDetections,
      trainingStats,
      monthlyTrends,
    ] = await Promise.all([
      getTotalScans(),
      getRecentScans(),
      getFakeDetectionStats(),
      getTrainingStats(),
      getMonthlyTrends(),
    ]);

    const fakeDetectionRate =
      totalScans > 0 ? (fakeDetections / totalScans) * 100 : 0;

    return NextResponse.json({
      scans: {
        total: totalScans ?? 0,
        ...{
          last24Hours: recentScans?.last24Hours ?? 0,
          last7Days: recentScans?.last7Days ?? 0,
          last30Days: recentScans?.last30Days ?? 0,
        },
        fakeDetectionRate: fakeDetectionRate.toFixed(1),
        fakeDetections: fakeDetections ?? 0,
      },
      training: {
        total: trainingStats?.total ?? 0,
        original: trainingStats?.original ?? 0,
        fake: trainingStats?.fake ?? 0,
        pending: trainingStats?.pending ?? 0,
        processing: trainingStats?.processing ?? 0,
        trained: trainingStats?.trained ?? 0,
      },
      trends: {
        monthly: monthlyTrends ?? [],
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
