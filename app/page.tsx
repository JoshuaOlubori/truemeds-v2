import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/footer";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@/components/home/upload-button";
import { FloatingUploadButton } from "@/components/home/floating-upload-button";
import { ScanHistoryCard } from "@/components/home/scan-history-card";
import { StatsCard } from "@/components/home/stats-card";
import {
  Shield,
  Upload,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Mock data for scan history
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
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pb-16 pt-24 md:pb-24 md:pt-32">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Verify Your Medications with AI Technology
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                TrueMeds uses advanced AI to help you identify counterfeit
                drugs. Upload a photo and get instant verification results.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <UploadButton size="lg" className="w-full sm:w-auto" />
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
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
                title="Total Scans"
                value="24,892"
                description="Drugs verified through our platform"
                icon={Shield}
              />
              <StatsCard
                title="Accuracy Rate"
                value="98.7%"
                description="Verified by pharmaceutical experts"
                icon={CheckCircle}
                trend="up"
                trendValue="+1.2%"
              />
              <StatsCard
                title="Fake Drugs Detected"
                value="1,247"
                description="Potentially harmful medications identified"
                icon={AlertTriangle}
                trend="down"
                trendValue="-3.5%"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
                How It Works
              </h2>
              <p className="mb-12 text-muted-foreground">
                Our AI-powered verification system makes it easy to check if
                your medications are genuine.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Upload Photo</h3>
                <p className="text-muted-foreground">
                  Take a clear photo of your medication and upload it to our
                  secure platform.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-medium">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our advanced AI analyzes the image against our database of
                  verified medications.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Get Results</h3>
                <p className="text-muted-foreground">
                  Receive instant verification results with detailed analysis of
                  your medication.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <UploadButton />
            </div>
          </div>
        </section>

        {/* Recent Scans Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold md:text-3xl">
                Recent Verifications
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="#" className="flex items-center gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentScans.map((scan) => (
                <ScanHistoryCard key={scan.id} {...scan} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-primary-foreground md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
                Ready to Verify Your Medications?
              </h2>
              <p className="mb-8 text-primary-foreground/90">
                It only takes a few seconds to check if your drugs are genuine.
                Protect yourself and your loved ones from counterfeit
                medications.
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
  );
}
