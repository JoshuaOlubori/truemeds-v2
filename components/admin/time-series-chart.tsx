"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface TimeSeriesChartProps {
  title: string
  description?: string
  data: Array<{
    date: string
    value: number
    [key: string]: unknown
  }>
  className?: string
  valueFormatter?: (value: number) => string
  categories?: string[]
  colors?: string[]
  yAxisWidth?: number
}

export function TimeSeriesChart({
  title,
  description,
  data,
  className,
  valueFormatter = (value: number) => value.toString(),
  categories = ["value"],
  colors = ["hsl(var(--primary))"],
  yAxisWidth = 40,
}: TimeSeriesChartProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={{}}>
              <AreaChart
                data={data}
                margin={{
                  top: 16,
                  right: 16,
                  bottom: 0,
                  left: 0,
                }}
              >
                <defs>
                  {categories.map((category, index) => (
                    <linearGradient key={category} id={`gradient-${category}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickMargin={8}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  width={yAxisWidth}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickMargin={8}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={valueFormatter}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent />
                  }
                />
                {categories.map((category, index) => (
                  <Area
                    key={category}
                    type="monotone"
                    dataKey={category}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    fill={`url(#gradient-${category})`}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </AreaChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
