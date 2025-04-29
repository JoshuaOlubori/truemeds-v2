import { Navbar } from "@/components/common/navbar"
import { Footer } from "@/components/common/footer"
import { FileUpload } from "@/components/file-upload"

export default function UploadPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-12 md:py-16">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Verify Your Medication</h1>
              <p className="text-muted-foreground">Upload a clear photo of your medication for AI verification</p>
            </div>

            <FileUpload className="mb-8" />

            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-lg font-medium">Tips for Best Results</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Take a clear, well-lit photo of the medication</li>
                <li>• Include the packaging if possible</li>
                <li>• Make sure text and logos are visible</li>
                <li>• Avoid shadows and glare</li>
                <li>• Place the medication against a plain background</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
