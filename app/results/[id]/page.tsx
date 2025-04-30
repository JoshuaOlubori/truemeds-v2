 "use client"
 import { useParams } from 'next/navigation'
import { useEffect, useState } from "react"
import { Navbar } from "@/components/common/navbar"
import { Footer } from "@/components/common/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Info,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Update the ScanResult interface to include all necessary fields
interface ScanResult {
  id: string
  imageUrl: string
  result: "fake" | "original"
  confidence: number
  drugName: string
  manufacturer: string
  indicators: string[]
  geolocation: { lat: number; lng: number } | null
  createdAt: string
}

export default function ResultPage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const router = useRouter()



const routeParams = useParams()
const id = routeParams?.id as string | undefined


  useEffect(() => {
    const fetchResult = async () => {
      try {
        // First try to fetch from API
        const response = await fetch(`/api/scan/${id}`)

        if (response.ok) {
          const data = await response.json()
          setResult(data)
        } else {
          // Fallback to localStorage for demo purposes
          const storedResult = localStorage.getItem(`scan-${params.id}`)

          if (storedResult) {
            const data = JSON.parse(storedResult)
            // Add a timestamp if not present
            if (!data.createdAt) {
              data.createdAt = new Date().toISOString()
            }
            setResult(data)
          } else {
            throw new Error("Result not found")
          }
        }
      } catch (err) {
        console.error("Error fetching result:", err)
        setError("Could not load the verification result")
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [params.id])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard")
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

  const submitFeedback = async (isHelpful: boolean) => {
    if (!result) return

    try {
      // Submit feedback to API
      await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scanId: params.id,
          isHelpful,
          resultType: result.result,
        }),
      })

      setFeedbackSubmitted(true)
      toast.success("Thank you for your feedback!")
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast.error("Failed to submit feedback")
    }
  }

  const handleNewScan = () => {
    router.push("/upload")
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

  const isFake = result.result === "fake"
  const formattedDate = new Date(result.createdAt).toLocaleDateString()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="container py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6">
              <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link href="/upload" className="flex items-center gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Upload
                </Link>
              </Button>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-bold md:text-3xl">Verification Result</h1>
                <Badge variant={isFake ? "destructive" : "default"} className="px-3 py-1 text-sm">
                  {isFake ? "Potentially Fake" : "Likely Original"}
                </Badge>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="overflow-hidden">
                <div className="relative aspect-square w-full">
                  <Image
                    src={result.imageUrl || "/placeholder.svg"}
                    alt={result.drugName}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
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
                        <span className="font-medium">{result.drugName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fingerprint className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Manufacturer:</span>
                        <span className="font-medium">{result.manufacturer}</span>
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
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Info className="h-4 w-4" />
                      Key Indicators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {result.indicators.map((indicator, index) => (
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

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Was this result helpful?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!feedbackSubmitted ? (
                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 gap-2" onClick={() => submitFeedback(true)}>
                          <ThumbsUp className="h-4 w-4" />
                          Yes
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2" onClick={() => submitFeedback(false)}>
                          <ThumbsDown className="h-4 w-4" />
                          No
                        </Button>
                      </div>
                    ) : (
                      <p className="text-center text-sm text-muted-foreground">
                        Thank you for your feedback! It helps us improve our verification system.
                      </p>
                    )}
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

                <Button className="w-full" onClick={handleNewScan}>
                  Verify Another Medication
                </Button>
              </div>
            </div>

            <div className="mt-8 rounded-lg border bg-card p-4 text-sm text-muted-foreground">
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
