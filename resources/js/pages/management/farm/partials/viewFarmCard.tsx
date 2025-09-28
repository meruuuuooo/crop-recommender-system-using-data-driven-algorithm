import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { type viewFarmProps } from '@/types/farm';

export default function ViewFarmCard({ farm }: viewFarmProps) {
    if (!farm) {
        return (
            <div className="w-full p-4 sm:p-6 lg:p-8">
                <Card className="border-[#D6E3D4]">
                    <CardContent className="p-6">
                        <div className="text-center text-gray-500">
                            <p className="text-lg">No farm data available</p>
                            <p className="mt-2 text-sm">Farm information could not be loaded.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const ownerName = farm.farmer
        ? `${farm.farmer.firstname || ''} ${farm.farmer.middlename ? farm.farmer.middlename + ' ' : ''}${farm.farmer.lastname || ''}`.trim()
        : 'N/A';

    const addressParts = [];
    if (farm.location?.street) addressParts.push(farm.location.street);
    if (farm.location?.barangay?.name) addressParts.push(farm.location.barangay.name);
    if (farm.location?.municipality?.name) addressParts.push(farm.location.municipality.name);
    if (farm.location?.province?.name) addressParts.push(farm.location.province.name);

    const address = addressParts.length > 0 ? addressParts.join(', ') : 'N/A';

    const farmSize = farm.total_area ? `${farm.total_area} hectares` : 'N/A';

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
            <div className="flex min-h-[38px] items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
                {value || 'N/A'}
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-4">
            {/* Header Section */}
            <Card className="rounded-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">{farm.name}</CardTitle>
                            <p className="mt-1 text-gray-600">Farm Details</p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Badge variant="secondary" className="border-[#619154]/20 bg-[#619154]/10 text-[#619154]">
                                ID: {farm.id}
                            </Badge>
                            <Badge variant="outline" className="border-gray-300">
                                {farmSize}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Farm Information Section */}
            <Card className="rounded-sm">
                <CardHeader>
                    <CardTitle className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">Farm Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoField label="Farm Name" value={farm.name} />
                        <InfoField label="Total Area" value={farmSize} />
                        <InfoField label="Cropping System" value={farm.cropping_system} />
                        <InfoField label="Previous Crops" value={farm.prev_crops} fullWidth />
                    </div>
                </CardContent>
            </Card>

            {/* Owner Information Section */}
            <Card className="rounded-sm">
                <CardHeader>
                    <CardTitle className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">Owner Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoField label="Farm Owner" value={ownerName} />
                        {farm.farmer?.contact_number && <InfoField label="Contact Number" value={farm.farmer.contact_number} />}
                    </div>
                </CardContent>
            </Card>

            {/* Location Information Section */}
            <Card className="rounded-sm">
                <CardHeader>
                    <CardTitle className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">Location Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <InfoField label="Province" value={farm.location?.province?.name} />
                            <InfoField label="Municipality" value={farm.location?.municipality?.name} />
                            <InfoField label="Barangay" value={farm.location?.barangay?.name} />
                        </div>
                        {farm.location?.street && <InfoField label="Street Address" value={farm.location.street} fullWidth />}
                        <InfoField label="Complete Address" value={address} fullWidth />
                    </div>
                </CardContent>
            </Card>

            {/* System Information Section */}
            <Card className="rounded-sm">
                <CardHeader>    
                    <CardTitle className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">System Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoField label="Date Created" value={formatDate(farm.created_at)} />
                        <InfoField label="Last Updated" value={formatDate(farm.updated_at)} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
