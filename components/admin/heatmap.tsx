"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

// Dynamically import the map components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const HeatmapLayer = dynamic(() => import("react-leaflet-heatmap-layer-v3").then((mod) => mod.HeatmapLayer), {
  ssr: false,
})

interface HeatmapProps {
  title: string
  description?: string
  className?: string
  points: Array<{
    lat: number
    lng: number
    intensity?: number
  }>
  center?: [number, number]
  zoom?: number
}

export function Heatmap({ title, description, className, points, center = [20, 0], zoom = 2 }: HeatmapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Format points for the heatmap layer
  const heatmapPoints = points.map((point) => [point.lat, point.lng, point.intensity || 1])

  if (!isMounted) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full rounded-md bg-muted animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="map-container">
          <MapContainer center={center as [number, number]} zoom={zoom} className="h-full w-full rounded-md">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <HeatmapLayer
              points={heatmapPoints as [number, number, number][]}
              longitudeExtractor={(m) => m[1]}
              latitudeExtractor={(m) => m[0]}
              intensityExtractor={(m) => m[2]}
              radius={20}
              max={10}
              minOpacity={0.1}
            />
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}
