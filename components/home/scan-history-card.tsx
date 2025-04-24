import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ScanHistoryCardProps {
  id: string
  date: string
  drugName: string
  confidence: number
  isFake: boolean
  imageUrl: string
}

export function ScanHistoryCard({ id, date, drugName, confidence, isFake, imageUrl }: ScanHistoryCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-40 w-full">
        <Image src={imageUrl || "/placeholder.svg"} alt={drugName} fill className="object-cover" />
        <Badge className="absolute right-2 top-2" variant={isFake ? "destructive" : "default"}>
          {isFake ? "Fake" : "Original"}
        </Badge>
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg">{drugName}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{date}</span>
        </div>
        <div className="mt-2">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span>Confidence</span>
            <span className="font-medium">{confidence}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className={`h-full ${isFake ? "bg-destructive" : "bg-primary"}`} style={{ width: `${confidence}%` }} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="ghost" className="w-full" size="sm">
          <Link href={`/results/${id}`} className="flex items-center justify-center gap-2">
            View Details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
