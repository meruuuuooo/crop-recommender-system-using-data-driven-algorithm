import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Fertilizer } from '@/types/fertilizer';
import { Head, Link } from '@inertiajs/react';

import {
    ArrowLeft,
    Building,
    Calendar,
    FileText,
    FlaskConical,
    AlertTriangle,
    Sprout,
    Target,
    Info,
    Timer,
    Scale,
    FileDown,
    Package,
    Beaker,
    Leaf
} from 'lucide-react';

export default function ShowFertilizer({ fertilizer }: { fertilizer: Fertilizer }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Recommendation Fertilizer',
            href: '/recommendation/fertilizer',
        },
        {
            title: fertilizer.product_name || 'Unknown Product',
            href: `/recommendation/fertilizer/show/${fertilizer.id}`,
        },
    ];

    const timeStampToDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getProductTypeColor = (type: string) => {
        const typeLower = type?.toLowerCase() || '';
        switch (typeLower) {
            case 'organic':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'inorganic':
            case 'synthetic':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'bio-fertilizer':
            case 'biofertilizer':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'liquid':
                return 'bg-cyan-50 text-cyan-700 border-cyan-200';
            case 'granular':
            case 'pellet':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const isExpiringSoon = (expiryDate: string) => {
        const expiry = new Date(expiryDate);
        const today = new Date();
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(today.getMonth() + 6);
        return expiry <= sixMonthsFromNow;
    };

    const isExpired = (expiryDate: string) => {
        const expiry = new Date(expiryDate);
        const today = new Date();
        return expiry < today;
    };

    const handleExportPDF = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${fertilizer.product_name} - Fertilizer Details</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            .header { border-bottom: 2px solid #619154; padding-bottom: 10px; margin-bottom: 20px; }
                            .section { margin-bottom: 20px; }
                            .label { font-weight: bold; }
                            .badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
                            .organic { background-color: #f0fdf4; color: #166534; }
                            .inorganic { background-color: #eff6ff; color: #1d4ed8; }
                            .bio { background-color: #faf5ff; color: #7c3aed; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>${fertilizer.product_name}</h1>
                            <p><strong>Company:</strong> ${fertilizer.company}</p>
                            <p><strong>Registration Number:</strong> ${fertilizer.registration_number}</p>
                            <span class="badge ${fertilizer.type_of_product?.toLowerCase()}">${fertilizer.type_of_product}</span>
                        </div>

                        <div class="section">
                            <h2>Product Information</h2>
                            <p><strong>Type:</strong> ${fertilizer.type_of_product}</p>
                            <p><strong>Guaranteed Analysis:</strong> ${fertilizer.guaranteed_analysis || 'Not specified'}</p>
                        </div>

                        <div class="section">
                            <h2>Target Crops</h2>
                            <p>${fertilizer.target_crops || 'Not specified'}</p>
                        </div>

                        <div class="section">
                            <h2>Registration Information</h2>
                            <p><strong>Expiry Date:</strong> ${fertilizer.expiry_date ? timeStampToDate(fertilizer.expiry_date) : 'No expiry date'}</p>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${fertilizer.product_name} - Fertilizer Details`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Link
                            href={route('recommendation.fertilizer')}
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#619154] transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Fertilizers
                        </Link>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExportPDF}
                                className="border-[#D6E3D4] hover:bg-[#F8FAF8] hover:border-[#619154]"
                            >
                                <FileDown className="h-4 w-4 mr-2" />
                                Export PDF
                            </Button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Product Overview */}
                            <Card className="border-[#D6E3D4]">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                                                {fertilizer.product_name}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                                                <Building className="h-4 w-4" />
                                                <span className="font-medium">{fertilizer.company}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FileText className="h-4 w-4" />
                                                <span>Registration: {fertilizer.registration_number}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Badge
                                                variant="outline"
                                                className={`${getProductTypeColor(fertilizer.type_of_product || '')}`}
                                            >
                                                <Package className="h-3 w-3 mr-1" />
                                                {fertilizer.type_of_product || 'Unknown Type'}
                                            </Badge>
                                            {fertilizer.expiry_date && isExpired(fertilizer.expiry_date) ? (
                                                <Badge variant="destructive">
                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                    Expired
                                                </Badge>
                                            ) : fertilizer.expiry_date && isExpiringSoon(fertilizer.expiry_date) ? (
                                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                    Expiring Soon
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    Valid
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <Package className="h-4 w-4 text-[#619154]" />
                                                Product Type
                                            </h4>
                                            <p className="text-gray-700 mb-2">{fertilizer.type_of_product || 'Unknown Type'}</p>
                                            <Badge
                                                variant="outline"
                                                className={`${getProductTypeColor(fertilizer.type_of_product || '')}`}
                                            >
                                                {fertilizer.type_of_product || 'Unknown Type'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <Info className="h-4 w-4 text-[#619154]" />
                                                Registration Details
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Registration Number:</span>
                                                    <span className="text-gray-900 font-mono">{fertilizer.registration_number}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Expiry Date:</span>
                                                    <span className="text-gray-900">{fertilizer.expiry_date ? timeStampToDate(fertilizer.expiry_date) : 'No expiry date'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Guaranteed Analysis */}
                            <Card className="border-[#D6E3D4]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Beaker className="h-5 w-5 text-[#619154]" />
                                        Guaranteed Analysis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {fertilizer.guaranteed_analysis ? (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                    <FlaskConical className="h-4 w-4 text-[#619154]" />
                                                    Nutrient Composition
                                                </h4>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                                                        {fertilizer.guaranteed_analysis}
                                                    </pre>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Beaker className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500">No guaranteed analysis information available</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Target Crops */}
                            <Card className="border-[#D6E3D4]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5 text-[#619154]" />
                                        Target Crops
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {fertilizer.target_crops ? (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                    <Sprout className="h-4 w-4 text-[#619154]" />
                                                    Recommended Crops
                                                </h4>
                                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                    <p className="text-gray-700">{fertilizer.target_crops}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500">No target crop information specified</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Information */}
                        <div className="space-y-6">
                            {/* Product Summary */}
                            <Card className="border-[#D6E3D4]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5 text-[#619154]" />
                                        Product Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Product Type</h4>
                                            <Badge
                                                variant="outline"
                                                className={`${getProductTypeColor(fertilizer.type_of_product || '')}`}
                                            >
                                                <Package className="h-3 w-3 mr-1" />
                                                {fertilizer.type_of_product || 'Unknown Type'}
                                            </Badge>
                                        </div>

                                        <Separator />

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Building className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium text-blue-900">Company</span>
                                                </div>
                                                <span className="text-blue-900 font-semibold text-sm">
                                                    {fertilizer.company}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-green-600" />
                                                    <span className="font-medium text-green-900">Registration</span>
                                                </div>
                                                <span className="text-green-900 font-semibold text-sm font-mono">
                                                    {fertilizer.registration_number}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Registration Status */}
                            <Card className="border-[#D6E3D4]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-[#619154]" />
                                        Registration Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Expiry Date</h4>
                                            <p className="text-gray-700 mb-2">{fertilizer.expiry_date ? timeStampToDate(fertilizer.expiry_date) : 'No expiry date available'}</p>
                                            {fertilizer.expiry_date && isExpired(fertilizer.expiry_date) ? (
                                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <div className="flex items-center gap-2 text-red-700 mb-1">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <span className="font-semibold">Registration Expired</span>
                                                    </div>
                                                    <p className="text-red-600 text-sm">
                                                        This product is no longer authorized for use.
                                                    </p>
                                                </div>
                                            ) : fertilizer.expiry_date && isExpiringSoon(fertilizer.expiry_date) ? (
                                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                    <div className="flex items-center gap-2 text-yellow-700 mb-1">
                                                        <Timer className="h-4 w-4" />
                                                        <span className="font-semibold">Expiring Soon</span>
                                                    </div>
                                                    <p className="text-yellow-600 text-sm">
                                                        Registration expires within 6 months.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                    <div className="flex items-center gap-2 text-green-700 mb-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span className="font-semibold">Valid Registration</span>
                                                    </div>
                                                    <p className="text-green-600 text-sm">
                                                        Product is currently authorized for use.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Usage Guidelines */}
                            <Card className="border-[#D6E3D4]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Scale className="h-5 w-5 text-[#619154]" />
                                        Usage Guidelines
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-blue-700 mb-1">
                                                <Info className="h-4 w-4" />
                                                <span className="font-semibold">Application Guidelines</span>
                                            </div>
                                            <p className="text-blue-600 text-sm">
                                                Always follow manufacturer's instructions and local agricultural guidelines.
                                            </p>
                                        </div>

                                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-green-700 mb-1">
                                                <Sprout className="h-4 w-4" />
                                                <span className="font-semibold">Best Practices</span>
                                            </div>
                                            <p className="text-green-600 text-sm">
                                                Apply at appropriate growth stages for optimal nutrient uptake.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
