import HeadingSmall from '@/components/heading-small';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/reports',
    },
];


export default function Index() {

    const reportLinks = [
        { title: 'Soil Test Results Report', component: 'Report1', href: '/reports/report1' },
        { title: 'Climate Data Report', component: 'Report2', href: '/reports/report2' },
        { title: 'Farms by Owner Report', component: 'Report3', href: '/reports/report3' },
        { title: 'Crop Recommendations by Location', component: 'Report4', href: '/reports/report4' },
        { title: 'Detailed Crop Recommendations', component: 'Report5', href: '/reports/report5' },
        { title: 'Farms with Specific Soil Types and Recommended Crops', component: 'Report7', href: '/reports/report7' },
    ];

    const [selectedReport, setSelectedReport] = useState<string>('');

    const handleReportChange = (value: string) => {
        setSelectedReport(value);
    };

    const renderSelectedReport = () => {
        const report = reportLinks.find(r => r.title === selectedReport);
        if (!report) return null;

        switch (report.component) {
            case 'Report1':
                return (
                    <Card className="rounded-lg bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Soil Test Results Report
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Tracks soil test results and their history for each farm, including farm owner's name and test dates.
                            </p>
                        </div>
                        <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                This report shows detailed soil test results including pH levels, nitrogen, phosphorus, and potassium levels for all farms.
                                <br />
                                <span className="font-medium">Features:</span> Search by farm name, filterable data table, soil nutrient analysis
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Link href="/reports/report1">
                                <Button size="sm" className="bg-[#619154] hover:bg-[#4f7443]">
                                    View Full Report
                                </Button>
                            </Link>
                        </div>
                    </Card>
                );

            case 'Report2':
                return (
                    <Card className="rounded-lg  bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Climate Data Report
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Recent climate data recorded for each farm, including location, humidity, rainfall, and temperature.
                            </p>
                        </div>
                        <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                            <p className="text-sm text-green-800 dark:text-green-200">
                                This report displays comprehensive climate monitoring data for agricultural decision-making.
                                <br />
                                <span className="font-medium">Features:</span> Temperature tracking, rainfall measurements, humidity levels, historical climate patterns
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Link href="/reports/report2">
                                <Button size="sm" className="bg-[#619154] hover:bg-[#4f7443]">
                                    View Full Report
                                </Button>
                            </Link>
                        </div>
                    </Card>
                );

            case 'Report3':
                return (
                    <Card className="rounded-lg bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Farms by Owner Report
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Comprehensive listing of farms organized by their respective owners.
                            </p>
                        </div>
                        <div className="rounded-md bg-purple-50 p-4 dark:bg-purple-900/20">
                            <p className="text-sm text-purple-800 dark:text-purple-200">
                                This report provides an organized view of farm ownership and property details.
                                <br />
                                <span className="font-medium">Features:</span> Owner contact information, farm area details, property management overview
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Link href="/reports/report3">
                                <Button size="sm" className="bg-[#619154] hover:bg-[#4f7443]">
                                    View Full Report
                                </Button>
                            </Link>
                        </div>
                    </Card>
                );

            case 'Report4':
                return (
                    <Card className="rounded-lg b bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Crop Recommendations by Location
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Lists crop recommendations for farms in a specific location.
                            </p>
                        </div>
                        <div className="rounded-md bg-orange-50 p-4 dark:bg-orange-900/20">
                            <p className="text-sm text-orange-800 dark:text-orange-200">
                                This report helps farmers choose the most suitable crops based on their geographic location.
                                <br />
                                <span className="font-medium">Features:</span> Location-based filtering, crop suitability analysis, regional recommendations
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Link href="/reports/report4">
                                <Button size="sm" className="bg-[#619154] hover:bg-[#4f7443]">
                                    View Full Report
                                </Button>
                            </Link>
                        </div>
                    </Card>
                );

            case 'Report5':
                return (
                    <Card className="rounded-lg bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Detailed Crop Recommendations
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Details crop recommendations tailored to soil and climate conditions on farms, including test results and environmental factors.
                            </p>
                        </div>
                        <div className="rounded-md bg-teal-50 p-4 dark:bg-teal-900/20">
                            <p className="text-sm text-teal-800 dark:text-teal-200">
                                This comprehensive report combines soil and climate data to provide detailed crop recommendations.
                                <br />
                                <span className="font-medium">Features:</span> Soil-climate correlation analysis, confidence scores, environmental factor integration
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Link href="/reports/report5">
                                <Button size="sm" className="bg-[#619154] hover:bg-[#4f7443]">
                                    View Full Report
                                </Button>
                            </Link>
                        </div>
                    </Card>
                );

            case 'Report7':
                return (
                    <Card className="rounded-lg bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Farms with Specific Soil Types and Recommended Crops
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Lists farms with specific soil types and their recommended crops based on soil conditions.
                            </p>
                        </div>
                        <div className="rounded-md bg-indigo-50 p-4 dark:bg-indigo-900/20">
                            <p className="text-sm text-indigo-800 dark:text-indigo-200">
                                This report focuses on soil-specific crop recommendations for optimal agricultural outcomes.
                                <br />
                                <span className="font-medium">Features:</span> Soil type filtering, crop-soil compatibility analysis, pH-based recommendations
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Link href="/reports/report7">
                                <Button size="sm" className="bg-[#619154] hover:bg-[#4f7443]">
                                    View Full Report
                                </Button>
                            </Link>
                        </div>
                    </Card>
                );

            default:
                return (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-gray-600 dark:text-gray-400">Report not found.</p>
                    </div>
                );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <Card className="flex flex-col rounded-xl gap-6 bg-white p-8 dark:border-sidebar-border">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <HeadingSmall title="Reports" description="List of all reports available in the system." />
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Available Reports: {reportLinks.length}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="report-select" className="text-sm font-medium text-gray-700">
                            Select Report
                        </label>
                        <Select
                            onValueChange={handleReportChange}
                            value={selectedReport}
                        >
                            <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
                                <SelectValue placeholder="Select a report" />
                            </SelectTrigger>
                            <SelectContent>
                                {reportLinks.map((report) => (
                                    <SelectItem key={report.title} value={report.title}>
                                        {report.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedReport ? (
                        <div className="mt-6">
                            {renderSelectedReport()}
                        </div>
                    ) : (
                        <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                Select a Report
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Choose a report from the dropdown above to view its preview and access the full report.
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
