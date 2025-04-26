"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCard } from "@/components/home/stats-card"
import { TimeSeriesChart } from "@/components/admin/time-series-chart"
import { Heatmap } from "@/components/admin/heatmap"
import { ScanHistoryCard } from "@/components/home/scan-history-card"
import { Button } from "@/components/ui/button"
import { BarChart3, Calendar, Download, Filter, Pill, Shield, AlertTriangle, Loader2 } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

interface DashboardStats {
  scans: {
    total: number
    last24Hours: number
    last7Days: number
    last30Days: number
    fakeDetectionRate: string
    fakeDetections: number
  }
  training: {
    total: number
    original: number
    fake: number
    pending: number
    processing: number
    trained: number
  }
  trends: {
    monthly: Array<{
      month: string
      count: number
    }>
  }
}

// Mock data for the heatmap
const heatmapPoints = [
  { lat: 40.7128, lng: -74.006, intensity: 8 }, // New York
  { lat: 34.0522, lng: -118.2437, intensity: 7 }, // Los Angeles
  { lat: 51.5074, lng: -0.1278, intensity: 9 }, // London
  { lat: 48.8566, lng: 2.3522, intensity: 6 }, // Paris
  { lat: 35.6762, lng: 139.6503, intensity: 8 }, // Tokyo
  { lat: 22.3193, lng: 114.1694, intensity: 10 }, // Hong Kong
  { lat: 19.4326, lng: -99.1332, intensity: 7 }, // Mexico City
  { lat: -33.8688, lng: 151.2093, intensity: 5 }, // Sydney
  { lat: 55.7558, lng: 37.6173, intensity: 6 }, // Moscow
  { lat: 28.6139, lng: 77.209, intensity: 9 }, // New Delhi
]

// Mock data for recent scans
const recentScans = [
  {
    id: "scan1",
    date: "Apr 20, 2025",
    drugName: "Paracetamol 500mg",
    confidence: 95,
    isFake: false,
    imageUrl: "/placeholder.svg?height=160&width=320",
  },
  {
    id: "scan2",
    date: "Apr 18, 2025",
    drugName: "Amoxicillin 250mg",
    confidence: 87,
    isFake: true,
    imageUrl: "/placeholder.svg?height=160&width=320",
  },
  {
    id: "scan3",
    date: "Apr 15, 2025",
    drugName: "Ibuprofen 400mg",
    confidence: 92,
    isFake: false,
    imageUrl: "/placeholder.svg?height=160&width=320",
  },
]

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { isLoaded, userId, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/admin/login")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")

        if (!response.ok) {
          throw new Error("Failed to fetch stats")
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isSignedIn) {
      fetchStats()
    }
  }, [isSignedIn])

  if (!isLoaded || loading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Format data for time series chart
  const timeSeriesData =
    stats?.trends?.monthly?.map((item) => ({
      date: item.month,
      value: item.count,
    })) || []

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor drug verification statistics and trends</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scans">Scans</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Time Range Selector */}
          <div className="flex justify-end">
            <div className="inline-flex rounded-md border">
              <Button
                variant={timeRange === "24h" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("24h")}
                className="rounded-r-none"
              >
                24h
              </Button>
              <Button
                variant={timeRange === "7d" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("7d")}
                className="rounded-none border-x"
              >
                7d
              </Button>
              <Button
                variant={timeRange === "30d" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("30d")}
                className="rounded-l-none"
              >
                30d
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Scans"
              value={stats?.scans.total || 0}
              description={`+${timeRange === "24h" ? stats?.scans.last24Hours : timeRange === "7d" ? stats?.scans.last7Days : stats?.scans.last30Days} in the last ${timeRange}`}
              icon={Shield}
              trend="up"
              trendValue="+5.2%"
            />
            <StatsCard
              title="Fake Detection Rate"
              value={`${stats?.scans.fakeDetectionRate || 0}%`}
              description={`${stats?.scans.fakeDetections || 0} fake drugs detected`}
              icon={AlertTriangle}
              trend="down"
              trendValue="-1.3%"
            />
            <StatsCard
              title="Training Images"
              value={stats?.training.total || 0}
              description={`${stats?.training.original || 0} original, ${stats?.training.fake || 0} fake`}
              icon={Calendar}
              trend="up"
              trendValue="+12.5%"
            />
            <StatsCard
              title="Pending Training"
              value={stats?.training.pending || 0}
              description="Images waiting to be processed"
              icon={BarChart3}
              trend="neutral"
              trendValue="0"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <TimeSeriesChart
              title="Verification Trend"
              description="Number of drug verifications over time"
              data={timeSeriesData}
              valueFormatter={(value) => `${value}`}
            />
            <Heatmap
              title="Geographical Distribution"
              description="Locations of drug verification requests"
              points={heatmapPoints}
            />
          </div>

          {/* Common Fake Drugs */}
          <Card>
            <CardHeader>
              <CardTitle>Most Common Fake Drugs</CardTitle>
              <CardDescription>Drugs most frequently identified as counterfeit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* This would be populated with real data from the API */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-muted-foreground" />
                    <span>Amoxicillin</span>
                    <span className="text-sm text-muted-foreground">(245 detections)</span>
                  </div>
                  <div className="flex w-1/2 items-center gap-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-destructive" style={{ width: `19.6%` }} />
                    </div>
                    <span className="text-sm font-medium">19.6%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Scans */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Verifications</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentScans.map((scan) => (
                <ScanHistoryCard key={scan.id} {...scan} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scans">
          <Card>
            <CardHeader>
              <CardTitle>Scan History</CardTitle>
              <CardDescription>Detailed view of all drug verification scans</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This tab would contain a detailed table of all scans with filtering and sorting options.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed analytics and insights from verification data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This tab would contain advanced analytics, including predictive models and trend analysis.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
