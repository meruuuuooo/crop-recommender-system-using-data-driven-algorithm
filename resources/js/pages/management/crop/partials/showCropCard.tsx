import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type ShowCropCardProps } from '@/types/crop';

export default function ViewCropCard({ crop }: ShowCropCardProps) {
    if (!crop) {
        return (
            <div className="w-full p-4 sm:p-6 lg:p-8">
                <Card className="border-[#D6E3D4]">
                    <CardContent className="p-6">
                        <div className="text-center text-gray-500">
                            <p className="text-lg">No crop data available</p>
                            <p className="text-sm mt-2">Crop information could not be loaded.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getSeasonColor = (season: string) => {
        const seasonLower = season?.toLowerCase() || '';
        switch (seasonLower) {
            case 'wet':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'dry':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'all':
                return 'bg-green-50 text-green-700 border-green-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const InfoField = ({ label, value, fullWidth = false }: { label: string; value: string | number | null | undefined; fullWidth?: boolean }) => (
        <div className={`space-y-2 ${fullWidth ? 'col-span-full' : ''}`}>
            <Label className="text-sm font-medium text-[#619154]">{label}</Label>
            <div className="text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[38px] flex items-center">
                {value || 'N/A'}
            </div>
        </div>
    );

    return (
        <div className="w-full sm:p-4 lg:p-6 space-y-4">
            {/* Header Section */}
            <Card className="border-[#D6E3D4]">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                {crop.name}
                            </CardTitle>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Badge variant="secondary" className="bg-[#619154]/10 text-[#619154] border-[#619154]/20">
                                ID: {crop.id}
                            </Badge>
                            <Badge variant="secondary" className={getSeasonColor(crop.season)}>
                                {crop.season}
                            </Badge>
                            {crop.category && (
                                <Badge variant="outline" className="border-gray-300">
                                    {crop.category.name}
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Crop Information Section */}
            <Card className="border-[#D6E3D4]">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Crop Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoField label="Crop Name" value={crop.name} />
                        <InfoField label="Growing Season" value={crop.season} />
                        {crop.category && (
                            <InfoField label="Category" value={crop.category.name} />
                        )}
                        {crop.description && (
                            <InfoField label="Description" value={crop.description} fullWidth />
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Nutritional Information Section */}
            {crop.nutrients && (
                <Card className="border-[#D6E3D4]">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                            Nutritional Requirements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <InfoField label="Nitrogen (N)" value={crop.nutrients.nitrogen ? `${crop.nutrients.nitrogen}%` : undefined} />
                            <InfoField label="Phosphorus (P)" value={crop.nutrients.phosphorus ? `${crop.nutrients.phosphorus}%` : undefined} />
                            <InfoField label="Potassium (K)" value={crop.nutrients.potassium ? `${crop.nutrients.potassium}%` : undefined} />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* System Information Section */}
            <Card className="border-[#D6E3D4]">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        System Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoField label="Date Created" value={formatDate(crop.created_at)} />
                        <InfoField label="Last Updated" value={formatDate(crop.updated_at)} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
