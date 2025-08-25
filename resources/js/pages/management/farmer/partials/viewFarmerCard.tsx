import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { type Farmer } from '@/types/farmer';
// import { Eye } from 'lucide-react';
// import { Link } from '@inertiajs/react';

export default function ViewFarmerCard({ farmer }: { farmer: Farmer }) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getFullName = (farmer: Farmer) => {
        const middleInitial = farmer.middlename ? ` ${farmer.middlename.charAt(0)}.` : '';
        return `${farmer.firstname}${middleInitial} ${farmer.lastname}`;
    };

    const getFullAddress = (farmer: Farmer) => {
        if (!farmer.location) return 'N/A';
        return `${farmer.location.street || 'N/A'}, ${farmer.location.barangay?.name || 'N/A'}, ${farmer.location.municipality?.name || 'N/A'}, ${farmer.location.province?.name || 'N/A'}`;
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
            <Card className="border-[#D6E3D4]">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">{getFullName(farmer)}</CardTitle>
                            <p className="mt-1 text-gray-600">Farmer Profile</p>
                            <p className="mt-1 text-gray-600">Registered Date: {formatDate(farmer.registration_date)}</p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Badge variant="secondary" className="border-[#619154]/20 bg-[#619154]/10 text-[#619154]">
                                ID: {farmer.id}
                            </Badge>
                            {farmer.farming_experience && (
                                <Badge variant="outline" className="border-gray-300">
                                    {farmer.farming_experience} Years Experience
                                </Badge>
                            )}
                            {/* <Link href={route('management.farmer.farm.show', { farmer: farmer.id })}>
                                <Button className="cursor-pointer bg-[#619154] text-white hover:bg-[#4F7A43]">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Show Farms
                                </Button>
                            </Link> */}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Card className="border-[#D6E3D4]">
                <CardHeader>
                    <CardTitle className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <InfoField label="First Name" value={farmer.firstname} />
                        <InfoField label="Middle Name" value={farmer.middlename} />
                        <InfoField label="Last Name" value={farmer.lastname} />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-[#D6E3D4]">
                <CardHeader>
                    <CardTitle className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">Contact & Experience</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoField label="Contact Number" value={farmer.contact_number} />
                        <InfoField label="Farming Experience" value={farmer.farming_experience ? `${farmer.farming_experience} Years` : null} />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-[#D6E3D4]">
                <CardHeader>
                    <CardTitle className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">Address Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <InfoField label="Province" value={farmer.location?.province?.name} />
                            <InfoField label="Municipality" value={farmer.location?.municipality?.name} />
                            <InfoField label="Barangay" value={farmer.location?.barangay?.name} />
                        </div>
                        <InfoField label="Street Address" value={farmer.location?.street} fullWidth />
                        <InfoField label="Complete Address" value={getFullAddress(farmer)} fullWidth />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
