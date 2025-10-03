"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Cell } from "recharts"

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

interface CropRecommendationData {
    crop: string
    recommendations: number
}

interface TopCropsProps {
    data: CropRecommendationData[]
}

export const description = "Top 5 crops by recommendation count"

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#87ceeb', '#dda0dd', '#98fb98', '#f0e68c'];

export default function ChartPieSimple({data}: TopCropsProps) {

    const sortedData = [...data].sort((a, b) => b.recommendations - a.recommendations);

    const chartData = sortedData.map((item, index) => ({
        crop: item.crop,
        recommendations: item.recommendations,
        fill: COLORS[index % COLORS.length],
    }))

  const chartConfig = {
    recommendations: {
      label: "Recommendations",
    },
  } satisfies ChartConfig


  return (
    <Card className="rounded-xl">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top Crops by Recommendations</CardTitle>
        <CardDescription>Distribution of crop recommendations</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="recommendations"
              nameKey="crop"
              label={({ percent }) => ` ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
