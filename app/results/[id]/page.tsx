"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/common/navbar"
import { Footer } from "@/components/common/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  CheckCircle,
  Copy,
  Share2,
  ArrowLeft,
  Pill,
  Calendar,
  MapPin,
  Fingerprint,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"


interface ScanResult {
  id: number
  imageUrl: string
  result: string
  confidence: number
  geolocation: { lat: number; lng: number } | null
  createdAt: string
}

// Mock data for drug details that would come from a real AI model
const getDrugDetails = (result: string) => {
  if (result === "fake") {
    return {
      drugName: "Amoxicillin 250mg",
      manufacturer: "Unknown",
      indicators: [
        "Inconsistent packaging color",
        "Blurry or unclear text",
        "Missing hologram security feature",
        "Unusual pill shape",
      ],
    }
  } else {
    return {
      drugName: "Paracetamol 500mg",
      manufacturer: "Pharma Inc.",
      indicators: [
        "Clear, consistent packaging",
        "Sharp, legible text",
        "Valid security features",
        "Correct pill shape and color",
      ],
    }
  }
}

export default function ResultPage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/scan/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch scan result")
        }

        const data = await response.json()
        setResult(data)
      } catch (err) {
        setError("Could not load the verification result")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [params.id])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.message( "Link copied",{
      
      description: "The result link has been copied to your clipboard",
    })

  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "TrueMeds Verification Result",
          text: `Check out this drug verification result: ${result?.result === "fake" ? "Potentially Fake" : "Likely Original"} (${result?.confidence}% confidence)`,
          url: window.location.href,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      handleCopyLink()
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg">Loading verification result...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <h2 className="text-2xl font-bold">Result Not Found</h2>
            <p className="text-muted-foreground">The verification result you&apos;re looking for could not be found.</p>
            <Button asChild>
              <Link href="/upload">Try Another Verification</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const drugDetails = getDrugDetails(result.result)
  const isFake = result.result === "fake"
  const formattedDate = new Date(result.createdAt).toLocaleDateString()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6">
              <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link href="/upload" className="flex items-center gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Upload
                </Link>
              </Button>

              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold md:text-3xl">Verification Result</h1>
                <Badge variant={isFake ? "destructive" : "default"} className="text-sm">
                  {isFake ? "Potentially Fake" : "Likely Original"}
                </Badge>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="overflow-hidden">
                <div className="relative aspect-square w-full">
                  <Image
                    src={result.imageUrl || "/placeholder.svg"}
                    alt={drugDetails.drugName}
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      {isFake ? (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                      <h2 className="text-xl font-medium">{isFake ? "Caution Advised" : "Verification Successful"}</h2>
                    </div>

                    <div className="mb-4">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Confidence</span>
                        <span className="font-medium">{result.confidence}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full ${isFake ? "bg-destructive" : "bg-primary"}`}
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Drug:</span>
                        <span className="font-medium">{drugDetails.drugName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fingerprint className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Manufacturer:</span>
                        <span className="font-medium">{drugDetails.manufacturer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{formattedDate}</span>
                      </div>
                      {result.geolocation && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">Recorded</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-3 text-lg font-medium">Key Indicators</h3>
                    <ul className="space-y-2 text-sm">
                      {drugDetails.indicators.map((indicator, index) => (
                        <li key={index} className="flex items-start gap-2">
                          {isFake ? (
                            <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
                          ) : (
                            <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                          )}
                          <span>{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 gap-2" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                <span>
                  <strong>Disclaimer:</strong> This verification is provided for informational purposes only and should
                  not be considered medical advice. Always consult with a healthcare professional before taking any
                  medication.
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
