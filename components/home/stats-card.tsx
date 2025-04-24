import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
}

export function StatsCard({ title, value, description, icon: Icon, trend, trendValue, className }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && trendValue && (
          <div className="mt-2 flex items-center text-xs">
            <span
              className={cn(
                "mr-1 rounded-sm px-1 py-0.5",
                trend === "up" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                trend === "down" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
                trend === "neutral" && "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
              )}
            >
              {trendValue}
            </span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
