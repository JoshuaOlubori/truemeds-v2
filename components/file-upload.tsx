"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X, AlertCircle, Loader2, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { env } from "@/data/env/client"

interface FileUploadProps {
  className?: string
}

export function FileUpload({ className }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<string | null>(null)
  const [willResize, setWillResize] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Get maximum image size from environment variable
  const maxSizeMB = Number(env.NEXT_PUBLIC_MAX_IMAGE_SIZE_MB || 4.5)
  const maxSizeBytes = maxSizeMB * 1024 * 1024

  useEffect(() => {
    if (file) {
      // Format file size
      const sizeInMB = file.size / 1024 / 1024
      setFileSize(`${sizeInMB.toFixed(2)} MB`)

      // Check if image needs resizing
      setWillResize(file.size > maxSizeBytes)
    } else {
      setFileSize(null)
      setWillResize(false)
    }
  }, [file, maxSizeBytes])

  const handleFileChange = (selectedFile: File | null) => {
    setError(null)

    if (!selectedFile) {
      setFile(null)
      setPreview(null)
      return
    }

    // Check file size (max 10MB as hard limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit")
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      // Get user's geolocation if available
      let geolocation = null
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          })
        })

        geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
      } catch (error){
        console.log(error, " :Geolocation not available or denied")
      }

      // Create form data
      const formData = new FormData()
      formData.append("file", file)

      if (geolocation) {
        formData.append("lat", geolocation.lat.toString())
        formData.append("lng", geolocation.lng.toString())
      }

      // Send to API
      const response = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      })

      // Improved error handling
      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to upload image")
        } else {
          const errorText = await response.text()
          throw new Error(`Server error: ${response.status} ${errorText.substring(0, 100)}...`)
        }
      }

      const data = await response.json()

      // Store the result in localStorage for demo purposes
      localStorage.setItem(`scan-${data.id}`, JSON.stringify(data))

      toast.success("Image analyzed successfully!")
      router.push(`/results/${data.id}`)
    } catch (error) {
      console.error("Upload error:", error)
      setError(error instanceof Error ? error.message : "Failed to upload image")
      toast.error("Failed to analyze image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={className}>
      <Card
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-6 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border",
          preview ? "h-auto" : "h-64",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {!preview ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-1 text-lg font-medium">Upload Drug Image</h3>
            <p className="mb-4 text-sm text-muted-foreground">Drag and drop or click to upload</p>
            <p className="text-xs text-muted-foreground">JPG, PNG, HEIC • Max 10MB</p>
          </div>
        ) : (
          <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full opacity-90"
              onClick={(e) => {
                e.stopPropagation()
                setFile(null)
                setPreview(null)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="relative mx-auto max-h-[400px] max-w-full overflow-hidden rounded-md">
              <Image
                src={preview || "/placeholder.svg"}
                alt="Preview"
                width={400}
                height={400}
                className="mx-auto max-h-[400px] w-auto object-contain"
              />
            </div>

            {fileSize && (
              <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <span>File size: {fileSize}</span>
                {willResize && (
                  <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
                    <Info className="h-3 w-3" />
                    <span>Will be resized (over {maxSizeMB}MB)</span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 flex justify-center">
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  handleUpload()
                }}
                disabled={isUploading}
                className="w-full sm:w-auto"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Verify Drug"
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

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
    </div>
  )
}
