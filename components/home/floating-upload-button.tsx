"use client"

import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function FloatingUploadButton() {
  const pathname = usePathname()

  // Don't show on upload page or admin pages
  if (pathname === "/upload" || pathname.startsWith("/admin")) {
    return null
  }

  return (
    <Button
      asChild
      size="lg"
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl",
        "flex h-14 w-14 items-center justify-center p-0 md:h-16 md:w-16",
      )}
    >
      <Link href="/upload">
        <Upload className="h-6 w-6 md:h-7 md:w-7" />
        <span className="sr-only">Verify Drug</span>
      </Link>
    </Button>
  )
}
