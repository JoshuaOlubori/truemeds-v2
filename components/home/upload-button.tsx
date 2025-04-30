"use client"

import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import Link from "next/link"

interface UploadButtonProps {
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export function UploadButton({ className, variant = "default", size = "default" }: UploadButtonProps) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href="/upload" className="flex items-center gap-2">
        <Upload className="h-4 w-4" />
        Verify Your Medication
      </Link>
    </Button>
  )
}
