import { Navbar } from "@/components/common/navbar"
import { Footer } from "@/components/common/footer"
import { Button } from "@/components/ui/button"
import { UploadButton } from "@/components/home/upload-button"
import { FloatingUploadButton } from "@/components/home/floating-upload-button"
import { StatsCard } from "@/components/home/stats-card"
import { Shield, Upload, CheckCircle, AlertTriangle, Camera, Microscope } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// // Mock data for scan history
// const recentScans = [
//   {
//     id: "scan1",
//     date: "Apr 20, 2025",
//     drugName: "Paracetamol 500mg",
//     confidence: 95,
//     isFake: false,
//     imageUrl: "/placeholder.svg?height=160&width=320",
//   },
//   {
//     id: "scan2",
//     date: "Apr 18, 2025",
//     drugName: "Amoxicillin 250mg",
//     confidence: 87,
//     isFake: true,
//     imageUrl: "/placeholder.svg?height=160&width=320",
//   },
//   {
//     id: "scan3",
//     date: "Apr 15, 2025",
//     drugName: "Ibuprofen 400mg",
//     confidence: 92,
//     isFake: false,
//     imageUrl: "/placeholder.svg?height=160&width=320",
//   },
// ]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pb-16 pt-24 md:pb-24 md:pt-32">
          <div className="container relative z-10">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  Verify Your Medications with AI
                </h1>
                <p className="mb-8 text-lg text-muted-foreground">
                  TrueMeds uses advanced AI to help you identify fake drugs. Take a photo of your medication and get
                  instant verification results.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <UploadButton size="lg" className="w-full sm:w-auto" />
                  <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                    <Link href="#how-it-works">How It Works</Link>
                  </Button>
                </div>
              </div>
              <div className="relative hidden md:block">
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-xl">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Drug verification illustration"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <StatsCard
                title="Fast Analysis"
                value="Seconds"
                description="Get results in seconds, not days"
                icon={CheckCircle}
              />
              <StatsCard
                title="AI Powered"
                value="Grok AI"
                description="Leveraging advanced AI technology"
                icon={Microscope}
                trend="up"
                trendValue="New"
              />
              <StatsCard
                title="Free Service"
                value="$0"
                description="No cost to verify your medications"
                icon={Shield}
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
              <p className="mb-12 text-muted-foreground">
                Our AI-powered verification system makes it easy to check if your medications are genuine in just three
                simple steps.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Camera className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-medium">1. Take a Photo</h3>
                <p className="text-muted-foreground">
                  Take a clear photo of your medication packaging or pill using your smartphone or camera.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-medium">2. Upload Image</h3>
                <p className="text-muted-foreground">
                  Upload the photo to our secure platform with a simple drag-and-drop or click.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-medium">3. Get Results</h3>
                <p className="text-muted-foreground">
                  Receive instant verification results with a confidence score and detailed analysis.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <UploadButton />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Why Use TrueMeds?</h2>
              <p className="text-muted-foreground">
                Our platform offers several advantages to help you stay safe from counterfeit medications.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Privacy First</h3>
                <p className="text-muted-foreground">
                  Your uploads are not stored permanently. We prioritize your privacy and data security.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <Microscope className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Advanced AI</h3>
                <p className="text-muted-foreground">
                  Powered by Grok AI to analyze visual characteristics against a database of verified medications.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Detailed Analysis</h3>
                <p className="text-muted-foreground">
                  Get comprehensive information about your medication, including key indicators of authenticity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-primary-foreground md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">Ready to Verify Your Medications?</h2>
              <p className="mb-8 text-primary-foreground/90">
                It only takes a few seconds to check if your drugs are genuine. Protect yourself and your loved ones
                from counterfeit medications.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/upload" className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Verify Now
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingUploadButton />
    </div>
  )
}
