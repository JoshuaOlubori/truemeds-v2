"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/common/navbar"
import { Footer } from "@/components/common/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Database, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface TrainingImage {
  id: string
  imageUrl: string
  label: "original" | "fake"
  status: "pending" | "processing" | "trained"
  metadata: {
    drugName?: string
    manufacturer?: string
    notes?: string
  }
  createdAt: string
}

export default function TrainingListPage() {
  const [images, setImages] = useState<TrainingImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/admin/training")
        if (!response.ok) {
          throw new Error("Failed to fetch training images")
        }
        const data = await response.json()
        setImages(data)
      } catch (error) {
        console.error("Error fetching images:", error)
        setError("Failed to load training images")
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  const filteredImages = images.filter((image) => {
    if (activeTab === "all") return true
    if (activeTab === "original") return image.label === "original"
    if (activeTab === "fake") return image.label === "fake"
    if (activeTab === "pending") return image.status === "pending"
    return true
  })

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg">Loading training data...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Training Data</h1>
              <p className="text-muted-foreground">Manage images used to train the AI model</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button asChild className="gap-1">
                <Link href="/admin/training">
                  <Plus className="h-4 w-4" />
                  Add New
                </Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-8" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="original">Original</TabsTrigger>
              <TabsTrigger value="fake">Fake</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {error ? (
                <Card>
                  <CardContent className="flex items-center justify-center p-6">
                    <p className="text-destructive">{error}</p>
                  </CardContent>
                </Card>
              ) : filteredImages.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                    <Database className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                      <h3 className="text-lg font-medium">No training data found</h3>
                      <p className="text-sm text-muted-foreground">
                        {activeTab === "all" ? "Start by adding some training images" : `No ${activeTab} images found`}
                      </p>
                    </div>
                    <Button asChild>
                      <Link href="/admin/training">Add Training Data</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="relative h-48 w-full">
                        <Image
                          src={image.imageUrl || "/placeholder.svg"}
                          alt={image.metadata.drugName || "Training image"}
                          fill
                          className="object-cover"
                        />
                        <Badge
                          variant={image.label === "fake" ? "destructive" : "default"}
                          className="absolute right-2 top-2"
                        >
                          {image.label === "fake" ? "Fake" : "Original"}
                        </Badge>
                      </div>
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-lg">{image.metadata.drugName || "Unnamed Drug"}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-2 text-sm">
                          {image.metadata.manufacturer && (
                            <p className="text-muted-foreground">
                              Manufacturer: <span className="font-medium">{image.metadata.manufacturer}</span>
                            </p>
                          )}
                          <p className="text-muted-foreground">
                            Status:{" "}
                            <Badge
                              variant={
                                image.status === "trained"
                                  ? "default"
                                  : image.status === "processing"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="ml-1"
                            >
                              {image.status}
                            </Badge>
                          </p>
                          <p className="text-muted-foreground">
                            Added: {new Date(image.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
