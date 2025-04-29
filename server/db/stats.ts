import { db } from "@/drizzle/db";
import { scans, trainingImages } from "@/drizzle/schema";
import { sql } from "drizzle-orm";

export async function getTotalScans() {
  const result = await db.select({ count: sql`count(*)` }).from(scans);
  return Number(result[0].count);
}

export async function getRecentScans() {
  const [last24Hours, last7Days, last30Days] = await Promise.all([
    db
      .select({ count: sql`count(*)` })
      .from(scans)
      .where(sql`created_at > NOW() - INTERVAL '24 hours'`),
    db
      .select({ count: sql`count(*)` })
      .from(scans)
      .where(sql`created_at > NOW() - INTERVAL '7 days'`),
    db
      .select({ count: sql`count(*)` })
      .from(scans)
      .where(sql`created_at > NOW() - INTERVAL '30 days'`),
  ]);

  return {
    last24Hours: Number(last24Hours[0].count),
    last7Days: Number(last7Days[0].count),
    last30Days: Number(last30Days[0].count),
  };
}

export async function getFakeDetectionStats() {
  const result = await db
    .select({ count: sql`count(*)` })
    .from(scans)
    .where(sql`result = 'fake'`);
  return Number(result[0].count);
}

export async function getTrainingStats() {
  const result = await db
    .select({
      total: sql`count(*)`,
      original: sql`sum(case when label = 'original' then 1 else 0 end)`,
      fake: sql`sum(case when label = 'fake' then 1 else 0 end)`,
      pending: sql`sum(case when status = 'pending' then 1 else 0 end)`,
      processing: sql`sum(case when status = 'processing' then 1 else 0 end)`,
      trained: sql`sum(case when status = 'trained' then 1 else 0 end)`,
    })
    .from(trainingImages);

  return {
    total: Number(result[0].total),
    original: Number(result[0].original),
    fake: Number(result[0].fake),
    pending: Number(result[0].pending),
    processing: Number(result[0].processing),
    trained: Number(result[0].trained),
  };
}

export async function getMonthlyTrends() {
  const result = await db.execute(sql`
    SELECT 
      to_char(date_trunc('month', created_at), 'Mon') as month,
      count(*) as count
    FROM scans
    WHERE created_at > NOW() - INTERVAL '12 months'
    GROUP BY date_trunc('month', created_at)
    ORDER BY date_trunc('month', created_at)
  `);

  return result.rows;
}
