import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Fertilizer } from '@/types/fertilizer';
import {
    AlertTriangle,
    Beaker,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    FlaskConical,
    Info,
    Package,
    ShieldCheck,
    Sprout,
} from 'lucide-react';

interface ShowFertilizerCardProps {
    fertilizer: Fertilizer;
}

export default function ShowFertilizerCard({ fertilizer }: ShowFertilizerCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
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
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'liquid':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'granular':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'slow release':
                return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const isExpiringSoon = (expiryDate: string) => {
        const expiry = new Date(expiryDate);
        const today = new Date();
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(today.getMonth() + 3);
        return expiry <= threeMonthsFromNow;
    };

    const isExpired = (expiryDate: string) => {
        const expiry = new Date(expiryDate);
        const today = new Date();
        return expiry < today;
    };

    const getExpiryStatus = (expiryDate: string) => {
        if (isExpired(expiryDate)) {
            return { color: 'destructive', icon: AlertTriangle, text: 'Expired' };
        } else if (isExpiringSoon(expiryDate)) {
            return { color: 'warning', icon: Clock, text: 'Expiring Soon' };
        } else {
            return { color: 'success', icon: CheckCircle, text: 'Valid' };
        }
    };

    const expiryStatus = getExpiryStatus(fertilizer.expiry_date);

    return (
        <div className="mx-auto w-full space-y-6">
            {/* Main Product Card */}
            <Card className="border-[#D6E3D4] shadow-lg">
                <CardHeader className="border-b py-4 border-[#D6E3D4] bg-gradient-to-r from-[#F0F7ED] to-[#E6F4EA]">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <Avatar className="h-14 w-14 bg-[#619154]">
                                <AvatarFallback className="bg-[#619154] text-lg font-bold text-white">
                                    <FlaskConical className="h-6 w-6" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <CardTitle className="flex items-center gap-2 text-2xl text-[#619154]">
                                    {fertilizer.product_name || 'Unknown Product'}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-gray-600">
                                    <Building className="h-4 w-4" />
                                    Manufactured by {fertilizer.company || 'Unknown Company'}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge variant="secondary" className={getProductTypeColor(fertilizer.type_of_product)}>
                                <Package className="mr-1 h-3 w-3" />
                                {fertilizer.type_of_product || 'Unknown Type'}
                            </Badge>
                            <Badge
                                variant={expiryStatus.color === 'destructive' ? 'destructive' : 'secondary'}
                                className={`${
                                    expiryStatus.color === 'warning'
                                        ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                                        : expiryStatus.color === 'success'
                                          ? 'border-green-200 bg-green-50 text-green-700'
                                          : ''
                                }`}
                            >
                                <expiryStatus.icon className="mr-1 h-3 w-3" />
                                {expiryStatus.text}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Product Information */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold text-[#619154]">
                                <Info className="h-5 w-5" />
                                Product Information
                            </div>

                            <div className="space-y-3">
                                {/* Registration Number */}
                                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                                    <ShieldCheck className="mt-0.5 h-5 w-5 text-[#619154]" />
                                    <div>
                                        <div className="font-medium text-gray-700">Registration Number</div>
                                        <div className="font-mono text-sm text-[#619154]">{fertilizer.registration_number || 'Not provided'}</div>
                                    </div>
                                </div>

                                {/* Product Type */}
                                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                                    <Package className="mt-0.5 h-5 w-5 text-[#619154]" />
                                    <div>
                                        <div className="font-medium text-gray-700">Product Type</div>
                                        <div className="text-[#619154]">{fertilizer.type_of_product || 'Not specified'}</div>
                                    </div>
                                </div>

                                {/* Company */}
                                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                                    <Building className="mt-0.5 h-5 w-5 text-[#619154]" />
                                    <div>
                                        <div className="font-medium text-gray-700">Manufacturer</div>
                                        <div className="text-[#619154]">{fertilizer.company || 'Unknown'}</div>
                                    </div>
                                </div>

                                {/* Expiry Date */}
                                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                                    <Calendar className="mt-0.5 h-5 w-5 text-[#619154]" />
                                    <div>
                                        <div className="font-medium text-gray-700">Expiry Date</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#619154]">{formatDate(fertilizer.expiry_date)}</span>
                                            {isExpiringSoon(fertilizer.expiry_date) && (
                                                <Badge variant="destructive" className="text-xs">
                                                    {isExpired(fertilizer.expiry_date) ? 'Expired' : 'Expiring Soon'}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Agricultural Information */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold text-[#619154]">
                                <Sprout className="h-5 w-5" />
                                Agricultural Information
                            </div>

                            <div className="space-y-3">
                                {/* Target Crops */}
                                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                                    <Sprout className="mt-0.5 h-5 w-5 text-[#619154]" />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-700">Target Crops</div>
                                        <div className="mt-1 text-[#619154]">
                                            {fertilizer.target_crops ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {fertilizer.target_crops.split(',').map((crop, index) => (
                                                        <Badge key={index} variant="outline" className="border-[#D6E3D4] text-xs text-[#619154]">
                                                            {crop.trim()}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                'Not specified'
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Guaranteed Analysis */}
                                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                                    <Beaker className="mt-0.5 h-5 w-5 text-[#619154]" />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-700">Guaranteed Analysis</div>
                                        <div className="mt-1 text-[#619154]">{fertilizer.guaranteed_analysis || 'Not provided'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6 bg-[#D6E3D4]" />

                    {/* Additional Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-[#619154]">
                            <FileText className="h-5 w-5" />
                            Additional Details
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                <Calendar className="h-4 w-4 text-[#619154]" />
                                <div>
                                    <div className="text-sm font-medium text-gray-700">Created</div>
                                    <div className="text-sm text-[#619154]">{formatDate(fertilizer.created_at)}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                <Calendar className="h-4 w-4 text-[#619154]" />
                                <div>
                                    <div className="text-sm font-medium text-gray-700">Last Updated</div>
                                    <div className="text-sm text-[#619154]">{formatDate(fertilizer.updated_at)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Usage Warning */}
                    {(isExpired(fertilizer.expiry_date) || isExpiringSoon(fertilizer.expiry_date)) && (
                        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600" />
                                <div>
                                    <div className="font-medium text-yellow-800">Usage Warning</div>
                                    <div className="mt-1 text-sm text-yellow-700">
                                        {isExpired(fertilizer.expiry_date)
                                            ? 'This fertilizer has expired and should not be used. Please dispose of it properly according to local regulations.'
                                            : 'This fertilizer is expiring soon. Please use it before the expiry date or dispose of it properly.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-[#D6E3D4]">
                <CardHeader>
                    <CardTitle className="text-lg text-[#619154]">Quick Actions</CardTitle>
                    <CardDescription>Manage this fertilizer recommendation</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            className="border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Download Details
                        </Button>
                        <Button
                            variant="outline"
                            className="border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                        >
                            <Sprout className="mr-2 h-4 w-4" />
                            View Compatible Crops
                        </Button>
                        <Button
                            variant="outline"
                            className="border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                        >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Safety Guidelines
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
