import { Navbar } from "@/components/common/navbar"
import { Footer } from "@/components/common/footer"
import { FileUpload } from "@/components/file-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Camera, Eye, Sun, AlertTriangle } from "lucide-react"

export default function UploadPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="container py-12 md:py-16">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Verify Your Medication</h1>
              <p className="text-muted-foreground">Upload a clear photo of your medication for AI verification</p>
            </div>

            <FileUpload className="mb-8" />

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    Tips for Best Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Sun className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Good lighting</p>
                      <p className="text-sm text-muted-foreground">Take photos in well-lit conditions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Include packaging</p>
                      <p className="text-sm text-muted-foreground">
                        Include the packaging if possible to show security features
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Eye className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Show important details</p>
                      <p className="text-sm text-muted-foreground">
                        Make sure text, logos, and security features are visible
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Important Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    This service is provided for informational purposes only and should not replace professional medical
                    advice.
                  </p>
                  <p className="text-sm">
                    Your privacy is important to us. Images are analyzed in real-time and are not permanently stored on
                    our servers.
                  </p>
                  <p className="text-sm">
                    If you suspect a counterfeit medication, please contact your healthcare provider or local health
                    authority.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
