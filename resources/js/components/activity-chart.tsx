"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ActivityData {
    date: string
    farms: number
    farmers: number
}

interface ActivityChartProps {
    data: ActivityData[]
}

const chartConfig = {
  farms: {
    label: "Farms",
    color: "var(--chart-1)",
  },
  farmers: {
    label: "Farmers",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function ActivityChart({ data }: ActivityChartProps) {
  const totalFarms = data.reduce((sum, item) => sum + item.farms, 0)
  const totalFarmers = data.reduce((sum, item) => sum + item.farmers, 0)

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Registration Activity</CardTitle>
        <CardDescription>
          Monthly farm and farmer registrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                })
              }}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="farms" fill="var(--color-farms)" radius={4} />
            <Bar dataKey="farmers" fill="var(--color-farmers)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total: {totalFarms} farms, {totalFarmers} farmers <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Registration trends over the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
