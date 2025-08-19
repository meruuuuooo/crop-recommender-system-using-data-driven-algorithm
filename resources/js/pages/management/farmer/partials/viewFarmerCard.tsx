import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type Farmer = {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    contact_number: string;
    farming_experience: string | null;
    registration_date: string;
    location: {
        street: string;
        province: {
            id: number | string;
            name: string;
            region_code: string;
        };
        municipality: {
            id: number | string;
            name: string;
            province_id: number | string;
            region_code: string;
        };
        barangay: {
            id: number | string;
            name: string;
            municipality_id: number | string;
        };
    };
    user: {
        last_name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
};

export default function ViewFarmerCard({ farmer }: { farmer: Farmer }) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getFullAddress = (farmer: Farmer) => {
        return `${farmer.location.street}, ${farmer.location.barangay.name}, ${farmer.location.municipality.name}, ${farmer.location.province.name}`;
    };

    return (
        <div className="grid grid-cols-2 gap-6 px-5">
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                First Name
            </Label>
            <Label htmlFor="">{farmer.first_name}</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Middle Name
            </Label>
            <Label htmlFor="">{farmer.middle_name}</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Last Name
            </Label>
            <Label htmlFor="">{farmer.last_name}</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Farming Experience
            </Label>
            <Label htmlFor="">{farmer.farming_experience} Years</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Contact Number
            </Label>
            <Label htmlFor="">{farmer.contact_number}</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Address
            </Label>
            <Label htmlFor="">{getFullAddress(farmer)}</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Registration Date
            </Label>
            <Label htmlFor="">{formatDate(farmer.registration_date)}</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
        </div>
    );
}
