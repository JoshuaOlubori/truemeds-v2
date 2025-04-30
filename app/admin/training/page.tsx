"use client"

import { useState, useRef } from "react"
import { Navbar } from "@/components/common/navbar"
import { Footer } from "@/components/common/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Upload, X, AlertCircle, Loader2, Database } from "lucide-react"
import Image from "next/image"
// import { useRouter } from "next/navigation"

export default function AdminTrainingPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [label, setLabel] = useState<"original" | "fake">("original")
  const [drugName, setDrugName] = useState("")
  const [manufacturer, setManufacturer] = useState("")
  const [notes, setNotes] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
//   const router = useRouter()

  const handleFileChange = (selectedFile: File | null) => {
    setError(null)

    if (!selectedFile) {
      setFile(null)
      setPreview(null)
      return
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit")
      return
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/heic"]
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.toLowerCase().endsWith(".heic")) {
      setError("Only JPG, PNG, and HEIC files are supported")
      return
    }

    setFile(selectedFile)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image to upload")
      return
    }

    if (!drugName) {
      setError("Please enter a drug name")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("file", file)
      formData.append("label", label)

      // Add metadata
      const metadata = {
        drugName,
        manufacturer,
        notes,
      }
      formData.append("metadata", JSON.stringify(metadata))

      // Send to API
      const response = await fetch("/api/admin/training", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload training image")
      }

      toast.success("Training image uploaded successfully")

      // Reset form
      setFile(null)
      setPreview(null)
      setDrugName("")
      setManufacturer("")
      setNotes("")
    } catch (error) {
      console.error("Upload error:", error)
      setError(error instanceof Error ? error.message : "Failed to upload training image")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Upload Training Data</h1>
              <p className="text-muted-foreground">Add images to train the AI model</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Upload Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="mb-6 flex h-48 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border p-4 transition-colors hover:border-primary/50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {!preview ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG, HEIC (max 5MB)</p>
                      </div>
                    ) : (
                      <div className="relative h-full w-full">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-2 top-2 z-10 h-6 w-6 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            setFile(null)
                            setPreview(null)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <Image
                          src={preview || "/placeholder.svg"}
                          alt="Preview"
                          fill
                          className="rounded-md object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/jpeg,image/png,image/heic"
                    onChange={(e) => {
                      const files = e.target.files
                      if (files && files.length > 0) {
                        handleFileChange(files[0])
                      }
                    }}
                  />

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="drug-name">Drug Name</Label>
                      <Input
                        id="drug-name"
                        value={drugName}
                        onChange={(e) => setDrugName(e.target.value)}
                        placeholder="e.g., Paracetamol 500mg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="manufacturer">Manufacturer</Label>
                      <Input
                        id="manufacturer"
                        value={manufacturer}
                        onChange={(e) => setManufacturer(e.target.value)}
                        placeholder="e.g., Pharma Inc."
                      />
                    </div>

                    <div>
                      <Label>Classification</Label>
                      <RadioGroup
                        value={label}
                        onValueChange={(value) => setLabel(value as "original" | "fake")}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="original" id="original" />
                          <Label htmlFor="original">Original</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fake" id="fake" />
                          <Label htmlFor="fake">Fake</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Additional information about this sample..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      Training Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <p>
                        Upload clear, well-lit images of medications to help train the AI model to distinguish between
                        original and counterfeit drugs.
                      </p>
                      <p>
                        <strong>Original drugs</strong> should be verified authentic medications from legitimate
                        sources.
                      </p>
                      <p>
                        <strong>Fake drugs</strong> should be known counterfeits or samples with clear signs of being
                        fake.
                      </p>
                      <p>Provide as much detail as possible in the metadata to improve the model&apos;s accuracy.</p>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleUpload} disabled={isUploading || !file} className="w-full">
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Training Image"
                  )}
                </Button>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
