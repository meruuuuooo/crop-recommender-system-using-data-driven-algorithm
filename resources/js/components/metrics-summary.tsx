"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, Wheat, BookOpen } from "lucide-react"

interface Metrics {
    totalFarms: number
    totalFarmers: number
    totalCrops: number
    totalRecommendations: number
}

interface MetricsSummaryProps {
    metrics: Metrics
}

export default function MetricsSummary({ metrics }: MetricsSummaryProps) {
    const cards = [
        {
            title: "Total Farms",
            value: metrics.totalFarms,
            icon: Building2,
            color: "text-green-600 dark:text-green-400"
        },
        {
            title: "Registered Farmers",
            value: metrics.totalFarmers,
            icon: Users,
            color: "text-blue-600 dark:text-blue-400"
        },
        {
            title: "Crop Varieties",
            value: metrics.totalCrops,
            icon: Wheat,
            color: "text-yellow-600 dark:text-yellow-400"
        },
        {
            title: "Recommendations",
            value: metrics.totalRecommendations,
            icon: BookOpen,
            color: "text-purple-600 dark:text-purple-400"
        }
    ]

    return (
        <>
            {cards.map((card, index) => (
                <Card key={index} className="rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.title}
                        </CardTitle>
                        <card.icon className={`h-4 w-4 ${card.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
                    </CardContent>
                </Card>
            ))}
        </>
    )
}
