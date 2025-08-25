import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Pesticide } from '@/types/pesticide';
import { Head } from '@inertiajs/react';
import React from 'react';
import {
    Building,
    Calendar,
    FileText,
    FlaskConical,
    Shield,
    AlertTriangle,
    Clock,
    Bug,
    Activity,
    Sprout,
    Leaf,
    Droplets,
    Target,
    Info,
    Timer,
    Scale,
} from 'lucide-react';

interface ShowPesticideProps {
    pesticide: Pesticide;
}

export default function ShowPesticide({ pesticide }: ShowPesticideProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Recommendation Pesticide',
            href: '/recommendation/pesticide',
        },
        {
            title: pesticide.product_name,
            href: `/recommendation/pesticide/show/${pesticide.id}`,
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

    const getToxicityColor = (category: string) => {
        const categoryLower = category?.toLowerCase() || '';
        switch (categoryLower) {
            case '1': // Most severe hazard - Highly toxic
                return 'bg-red-100 text-red-800 border-red-200';
            case '2': // Moderately severe hazard - Moderately toxic
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case '3': // Slightly severe hazard - Slightly toxic
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case '4': // Least severe hazard - Practically non-toxic
                return 'bg-green-50 text-green-700 border-green-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getFormulationColor = (formulation: string) => {
        const formulationLower = formulation?.toLowerCase() || '';
        switch (formulationLower) {
            case 'ec': // Emulsifiable Concentrate
            case 'emulsifiable concentrate':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'sc': // Suspension Concentrate
            case 'suspension concentrate':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'wp': // Wettable Powder
            case 'wettable powder':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'granules':
            case 'gr':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'dusts':
            case 'dust':
                return 'bg-gray-50 text-gray-700 border-gray-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
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

    const formatConcentration = (concentration: string) => {
        if (!concentration) return 'N/A';
        return concentration.includes('%') ? concentration : `${concentration}%`;
    };

    const getToxicityDescription = (category: string) => {
        const categoryLower = category?.toLowerCase() || '';
        switch (categoryLower) {
            case '1':
                return 'Most severe hazard - Highly toxic with significant potential for harm';
            case '2':
                return 'Moderately severe hazard - Moderately toxic with skin corrosion/irritation potential';
            case '3':
                return 'Slightly severe hazard - Slightly toxic with minor potential for harmful effects';
            case '4':
                return 'Least severe hazard - Practically non-toxic, not an irritant';
            default:
                return 'Toxicity classification not specified';
        }
    };

    // const handleExportPDF = () => {
    //     const printWindow = window.open('', '_blank');
    //     if (printWindow) {
    //         printWindow.document.write(`
    //             <html>
    //                 <head>
    //                     <title>${pesticide.product_name} - Pesticide Details</title>
    //                     <style>
    //                         body { font-family: Arial, sans-serif; margin: 20px; }
    //                         .header { border-bottom: 2px solid #619154; padding-bottom: 10px; margin-bottom: 20px; }
    //                         .section { margin-bottom: 20px; }
    //                         .label { font-weight: bold; }
    //                         .badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
    //                         .toxicity-1 { background-color: #fee2e2; color: #991b1b; }
    //                         .toxicity-2 { background-color: #fff7ed; color: #c2410c; }
    //                         .toxicity-3 { background-color: #fefce8; color: #a16207; }
    //                         .toxicity-4 { background-color: #f0fdf4; color: #166534; }
    //                     </style>
    //                 </head>
    //                 <body>
    //                     <div class="header">
    //                         <h1>${pesticide.product_name}</h1>
    //                         <p><strong>Company:</strong> ${pesticide.company}</p>
    //                         <p><strong>Registration Number:</strong> ${pesticide.registration_number}</p>
    //                         <span class="badge toxicity-${pesticide.toxicity_category}">Category ${pesticide.toxicity_category}</span>
    //                     </div>

    //                     <div class="section">
    //                         <h2>Active Ingredient</h2>
    //                         <p>${pesticide.active_ingredient}</p>
    //                         <p><strong>Formulation:</strong> ${pesticide.formulation_type}</p>
    //                         <p><strong>Concentration:</strong> ${pesticide.concentration || 'N/A'}</p>
    //                     </div>

    //                     ${pesticide.crops ? `
    //                     <div class="section">
    //                         <h2>Target Crops</h2>
    //                         <p>${pesticide.crops}</p>
    //                     </div>
    //                     ` : ''}

    //                     ${pesticide.pests ? `
    //                     <div class="section">
    //                         <h2>Target Pests</h2>
    //                         <p>${pesticide.pests}</p>
    //                     </div>
    //                     ` : ''}

    //                     ${pesticide.weeds ? `
    //                     <div class="section">
    //                         <h2>Target Weeds</h2>
    //                         <p>${pesticide.weeds}</p>
    //                     </div>
    //                     ` : ''}

    //                     ${pesticide.diseases ? `
    //                     <div class="section">
    //                         <h2>Target Diseases</h2>
    //                         <p>${pesticide.diseases}</p>
    //                     </div>
    //                     ` : ''}

    //                     <div class="section">
    //                         <h2>Safety Information</h2>
    //                         <p><strong>Toxicity Category:</strong> ${pesticide.toxicity_category} - ${getToxicityDescription(pesticide.toxicity_category)}</p>
    //                         <p><strong>PHI (Pre-Harvest Interval):</strong> ${pesticide.PHI || 'N/A'}</p>
    //                         <p><strong>REI (Re-entry Interval):</strong> ${pesticide.re_entry_period || 'N/A'}</p>
    //                     </div>

    //                     <div class="section">
    //                         <h2>Application Information</h2>
    //                         <p><strong>Recommended Rate:</strong> ${pesticide.recommended_rate || 'Not specified'}</p>
    //                         <p><strong>Maximum Residue Limit (MRL):</strong> ${pesticide.MRL || 'Not specified'}</p>
    //                     </div>

    //                     <div class="section">
    //                         <h2>Registration Information</h2>
    //                         <p><strong>Expiry Date:</strong> ${timeStampToDate(pesticide.expiry_date)}</p>
    //                         <p><strong>Mode of Entry:</strong> ${pesticide.mode_of_entry || 'N/A'}</p>
    //                         <p><strong>Uses:</strong> ${pesticide.uses || 'N/A'}</p>
    //                     </div>
    //                 </body>
    //             </html>
    //         `);
    //         printWindow.document.close();
    //         printWindow.print();
    //     }
    // };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${pesticide.product_name} - Pesticide Details`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6">
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
                                                {pesticide.product_name}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                                                <Building className="h-4 w-4" />
                                                <span className="font-medium">{pesticide.company}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FileText className="h-4 w-4" />
                                                <span>Registration: {pesticide.registration_number}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Badge
                                                variant="outline"
                                                className={`${getToxicityColor(pesticide.toxicity_category)}`}
                                            >
                                                <Shield className="h-3 w-3 mr-1" />
                                                Category {pesticide.toxicity_category}
                                            </Badge>
                                            {isExpired(pesticide.expiry_date) ? (
                                                <Badge variant="destructive">
                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                    Expired
                                                </Badge>
                                            ) : isExpiringSoon(pesticide.expiry_date) ? (
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
                                                <FlaskConical className="h-4 w-4 text-[#619154]" />
                                                Active Ingredient
                                            </h4>
                                            <p className="text-gray-700 mb-2">{pesticide.active_ingredient}</p>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className={`${getFormulationColor(pesticide.formulation_type)}`}
                                                >
                                                    {pesticide.formulation_type}
                                                </Badge>
                                                <span className="text-sm text-gray-600">
                                                    {formatConcentration(pesticide.concentration)}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <Info className="h-4 w-4 text-[#619154]" />
                                                Product Details
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Mode of Entry:</span>
                                                    <span className="text-gray-900">{pesticide.mode_of_entry || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Uses:</span>
                                                    <span className="text-gray-900">{pesticide.uses || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Expiry Date:</span>
                                                    <span className="text-gray-900">{timeStampToDate(pesticide.expiry_date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Target Information */}
                            <Card className="border-[#D6E3D4]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5 text-[#619154]" />
                                        Target Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {pesticide.crops && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                    <Sprout className="h-4 w-4 text-[#619154]" />
                                                    Target Crops
                                                </h4>
                                                <p className="text-gray-700">{pesticide.crops}</p>
                                            </div>
                                        )}

                                        {pesticide.pests && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                    <Bug className="h-4 w-4 text-orange-600" />
                                                    Target Pests
                                                </h4>
                                                <p className="text-gray-700">{pesticide.pests}</p>
                                            </div>
                                        )}

                                        {pesticide.weeds && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                    <Leaf className="h-4 w-4 text-green-600" />
                                                    Target Weeds
                                                </h4>
                                                <p className="text-gray-700">{pesticide.weeds}</p>
                                            </div>
                                        )}

                                        {pesticide.diseases && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                                    Target Diseases
                                                </h4>
                                                <p className="text-gray-700">{pesticide.diseases}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Application Information */}
                            <Card className="border-[#D6E3D4]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Droplets className="h-5 w-5 text-[#619154]" />
                                        Application Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                <Scale className="h-4 w-4 text-[#619154]" />
                                                Recommended Rate
                                            </h4>
                                            <p className="text-gray-700">{pesticide.recommended_rate || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                <Target className="h-4 w-4 text-[#619154]" />
                                                Maximum Residue Limit (MRL)
                                            </h4>
                                            <p className="text-gray-700">{pesticide.MRL || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Safety Information Sidebar */}
                        <div className="space-y-6">
                            {/* Toxicity Information */}
                            <Card className="border-[#D6E3D4]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-[#619154]" />
                                        Safety Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Toxicity Classification</h4>
                                            <Badge
                                                variant="outline"
                                                className={`mb-2 ${getToxicityColor(pesticide.toxicity_category)}`}
                                            >
                                                <Shield className="h-3 w-3 mr-1" />
                                                Category {pesticide.toxicity_category}
                                            </Badge>
                                            <p className="text-sm text-gray-600">
                                                {getToxicityDescription(pesticide.toxicity_category)}
                                            </p>
                                        </div>

                                        <Separator />

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium text-blue-900">PHI</span>
                                                </div>
                                                <span className="text-blue-900 font-semibold">
                                                    {pesticide.PHI || 'N/A'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                Pre-Harvest Interval: Minimum time between last application and harvest
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Activity className="h-4 w-4 text-green-600" />
                                                    <span className="font-medium text-green-900">REI</span>
                                                </div>
                                                <span className="text-green-900 font-semibold">
                                                    {pesticide.re_entry_period || 'N/A'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                Re-entry Interval: Minimum time before workers can enter treated area
                                            </p>
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
                                            <h4 className="font-semibold text-gray-900 mb-2">Registration Number</h4>
                                            <p className="text-gray-700 font-mono text-sm bg-gray-50 p-2 rounded">
                                                {pesticide.registration_number}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Expiry Date</h4>
                                            <p className="text-gray-700 mb-2">{timeStampToDate(pesticide.expiry_date)}</p>
                                            {isExpired(pesticide.expiry_date) ? (
                                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <div className="flex items-center gap-2 text-red-700 mb-1">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <span className="font-semibold">Registration Expired</span>
                                                    </div>
                                                    <p className="text-red-600 text-sm">
                                                        This product is no longer authorized for use.
                                                    </p>
                                                </div>
                                            ) : isExpiringSoon(pesticide.expiry_date) ? (
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
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
