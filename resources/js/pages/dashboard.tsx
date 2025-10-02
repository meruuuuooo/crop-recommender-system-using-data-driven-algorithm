import ActivityChart from '@/components/activity-chart';
import ChartPieSimple from '@/components/chart-pie-simple';
import MetricsSummary from '@/components/metrics-summary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    metrics: {
        totalFarms: number;
        totalFarmers: number;
        totalCrops: number;
        totalRecommendations: number;
    };
    topRecommendedCrops: Array<{
        crop: string;
        recommendations: number;
    }>;
    activityTrend: Array<{
        date: string;
        farms: number;
        farmers: number;
    }>;
    recentRecommendations: Array<{
        recommendation_date: string;
        crop: { name: string } | null;
        farmer: { lastname: string } | null;
        confidence_score: number;
    }>;
    supportedCrops: Array<{
        supported_crops: string;
        total_count: number;
    }>;
}

const supportedCropList = (supportedCrops: DashboardProps['supportedCrops']) => {
    // Ensure supportedCrops is an array before mapping
    if (!Array.isArray(supportedCrops)) {
        console.log('supportedCrops is not an array:', typeof supportedCrops);
        return null;
    }

    return (
        <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 max-h-64 overflow-y-auto">
            <ul className="space-y-2 pr-2">
                {supportedCrops.map((cropData, index) => (
                    <li key={index} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#619154]" />
                            <span className="text-sm font-medium text-gray-700">{cropData.supported_crops}</span>
                        </div>
                        <span className="text-xs text-gray-500">({cropData.total_count})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default function Dashboard({ metrics, topRecommendedCrops, activityTrend, recentRecommendations, supportedCrops }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl px-4 py-4">
                {/* Metrics Summary Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <MetricsSummary metrics={metrics} />
                </div>

                {/* Additional Content Area */}
                {/* <Card className="relative overflow-hidden rounded-xl">
                    <div className="px-6">
                        <h3 className="mb-2 text-sm font-semibold">Quick Actions</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            <a href="/management/farmer" className="rounded-lg border border-border p-4 transition-colors hover:bg-accent">
                                <h4 className="font-medium">Manage Farmers</h4>
                                <p className="mt-1 text-sm text-muted-foreground">Add, edit, or view farmer information</p>
                            </a>
                            <a href="/management/farm" className="rounded-lg border border-border p-4 transition-colors hover:bg-accent">
                                <h4 className="font-medium">Manage Farms</h4>
                                <p className="mt-1 text-sm text-muted-foreground">Register and manage farm properties</p>
                            </a>
                            <a href="/recommendation/crop" className="rounded-lg border border-border p-4 transition-colors hover:bg-accent">
                                <h4 className="font-medium">Crop Recommendations</h4>
                                <p className="mt-1 text-sm text-muted-foreground">Get crop recommendations for farms</p>
                            </a>
                        </div>
                    </div>
                    <PlaceholderPattern className="absolute inset-0 -z-10 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </Card> */}

                {/* Charts Grid */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <ActivityChart data={activityTrend} />
                    <ChartPieSimple data={topRecommendedCrops} />
                    <Card className="rounded-xl">
                        <CardHeader>
                            <CardTitle className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">Supported Crops</CardTitle>
                            <p className="text-sm text-gray-600">List of crops supported by the recommendation model</p>
                        </CardHeader>
                        <CardContent>
                            {supportedCrops.length === 0 ? (
                                <div className="py-8 text-center text-gray-500">
                                    <div
                                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
                                        aria-hidden="true"
                                    >
                                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-base">No supported crops data available</p>
                                </div>
                            ) : (
                                supportedCropList(supportedCrops)
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card role="region" className="rounded-xl" aria-labelledby="recent-results-heading">
                    <CardHeader>
                        <CardTitle id="recent-results-heading" className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                            Recent Recommendation Results
                        </CardTitle>
                        <p className="text-sm text-gray-600">Recent personalized crop recommendations will appear here.</p>
                    </CardHeader>
                    <CardContent>
                        {recentRecommendations.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100" aria-hidden="true">
                                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-base">Click "Generate Recommendation" to see your results</p>
                                <p className="mt-1 text-sm text-gray-400">All required fields must be completed first</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 font-semibold text-gray-700">Date</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Crop</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Farmer</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Score</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentRecommendations.map((item, idx) => (
                                            <tr key={idx} className="border-b last:border-0">
                                                <td className="px-4 py-2">{new Date(item.recommendation_date).toLocaleDateString()}</td>
                                                <td className="px-4 py-2">{item.crop?.name}</td>
                                                <td className="px-4 py-2">{item.farmer?.lastname}</td>
                                                <td className="px-4 py-2">
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                        {item.confidence_score.toFixed(2)}%
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-8 w-8 border-[#D6E3D4] p-0 hover:border-[#619154] hover:bg-[#F8FAF8]"
                                                                    // aria-label={`View details for ${getFullName(farmer)}`}
                                                                >
                                                                    <Eye className="h-4 w-4 text-[#619154]" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>View</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
