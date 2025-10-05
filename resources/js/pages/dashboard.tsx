import ActivityChart from '@/components/activity-chart';
import ChartPieSimple from '@/components/chart-pie-simple';
import MetricsSummary from '@/components/metrics-summary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Eye, RefreshCw } from 'lucide-react';

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
    modelInfo: {
        data: {
            available_crops: string[];
        available_soil_types: string[];
        features: string[];
        model_type: string;
        n_estimators: number;
        }
        success: boolean;
        error?: string;
    }

}

const supportedCropList = (supportedCrops: DashboardProps['modelInfo']['data']['available_crops']) => {
    // Ensure supportedCrops is an array before mapping
    if (!Array.isArray(supportedCrops)) {
        console.log('supportedCrops is not an array:', typeof supportedCrops, supportedCrops);
        return null;
    }

    return (
        <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 max-h-48 overflow-y-auto sm:max-h-64">
            <ul className="space-y-2 pr-2">
                {supportedCrops.map((cropData, index) => (
                    <li key={index} className="flex items-center justify-between rounded-lg bg-gray-50 px-2.5 py-2 sm:px-3">
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#619154] sm:h-2 sm:w-2" />
                            <span className="text-xs font-medium text-gray-700 sm:text-sm">{cropData}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default function Dashboard({ metrics, topRecommendedCrops, activityTrend, recentRecommendations, modelInfo }: DashboardProps) {
    const handleReloadAPI = () => {
        router.reload({ only: ['modelInfo'] });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-3 sm:p-4 md:p-6">
                {/* Metrics Summary Cards */}
                <div className="grid auto-rows-min gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                <div className="grid auto-rows-min gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <ActivityChart data={activityTrend} />
                    <ChartPieSimple data={topRecommendedCrops} />
                    <Card className="rounded-xl shadow-sm">
                        <CardHeader className="p-4 sm:p-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex-1 space-y-1">
                                    <CardTitle className="text-base font-semibold text-gray-900 sm:text-lg">Supported Crops</CardTitle>
                                    <p className="text-xs text-gray-600 sm:text-sm">List of crops supported by the recommendation model</p>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleReloadAPI}
                                            className="h-8 w-8 shrink-0 border-[#D6E3D4] p-0 hover:border-[#619154] hover:bg-[#F8FAF8]"
                                            aria-label="Reload API data"
                                        >
                                            <RefreshCw className="h-4 w-4 text-[#619154]" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">Reload API</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                            {!modelInfo.success ? (
                                <div className="py-6 text-center text-amber-600 sm:py-8">
                                    <div
                                        className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 sm:mb-4 sm:h-16 sm:w-16"
                                        aria-hidden="true"
                                    >
                                        <svg className="h-6 w-6 text-amber-500 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium sm:text-base">API Service Unavailable</p>
                                    <p className="mt-1 px-4 text-xs text-gray-500 sm:text-sm">Unable to fetch model information. Please check if the API service is running.</p>
                                    {modelInfo.error && (
                                        <p className="mt-2 text-xs text-gray-400">{modelInfo.error}</p>
                                    )}
                                </div>
                            ) : modelInfo.data.available_crops.length === 0 ? (
                                <div className="py-6 text-center text-gray-500 sm:py-8">
                                    <div
                                        className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 sm:mb-4 sm:h-16 sm:w-16"
                                        aria-hidden="true"
                                    >
                                        <svg className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-sm sm:text-base">No supported crops data available</p>
                                </div>
                            ) : (
                                supportedCropList(modelInfo.data.available_crops)
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card role="region" className="rounded-xl shadow-sm" aria-labelledby="recent-results-heading">
                    <CardHeader className="p-4 sm:p-6">
                        <div className="space-y-1">
                            <CardTitle id="recent-results-heading" className="text-base font-semibold text-gray-900 sm:text-lg">
                                Recent Recommendation Results
                            </CardTitle>
                            <p className="text-xs text-gray-600 sm:text-sm">Recent personalized crop recommendations will appear here.</p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                        {recentRecommendations.length === 0 ? (
                            <div className="py-6 text-center text-gray-500 sm:py-8">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 sm:mb-4 sm:h-16 sm:w-16" aria-hidden="true">
                                    <svg className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium sm:text-base">Click "Generate Recommendation" to see your results</p>
                                <p className="mt-1 px-4 text-xs text-gray-400 sm:text-sm">All required fields must be completed first</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-xs sm:text-sm">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-3 py-2 font-semibold text-gray-700 sm:px-4">Date</th>
                                            <th className="px-3 py-2 font-semibold text-gray-700 sm:px-4">Crop</th>
                                            <th className="px-3 py-2 font-semibold text-gray-700 sm:px-4">Farmer</th>
                                            <th className="px-3 py-2 font-semibold text-gray-700 sm:px-4">Score</th>
                                            <th className="px-3 py-2 font-semibold text-gray-700 sm:px-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentRecommendations.map((item, idx) => (
                                            <tr key={idx} className="border-b transition-colors hover:bg-gray-50 last:border-0">
                                                <td className="px-3 py-2 sm:px-4">{new Date(item.recommendation_date).toLocaleDateString()}</td>
                                                <td className="px-3 py-2 sm:px-4">{item.crop?.name}</td>
                                                <td className="px-3 py-2 sm:px-4">{item.farmer?.lastname}</td>
                                                <td className="px-3 py-2 sm:px-4">
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 sm:px-2.5">
                                                        {item.confidence_score.toFixed(2)}%
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 sm:px-4">
                                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-7 w-7 border-[#D6E3D4] p-0 hover:border-[#619154] hover:bg-[#F8FAF8] sm:h-8 sm:w-8"
                                                                    // aria-label={`View details for ${getFullName(farmer)}`}
                                                                >
                                                                    <Eye className="h-3.5 w-3.5 text-[#619154] sm:h-4 sm:w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="text-xs">View</p>
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
