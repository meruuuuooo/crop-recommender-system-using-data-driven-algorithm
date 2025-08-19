import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type viewFarmProps = {
    farm: {
        id: number | string;
        name: string;
        total_area: number;
        prev_crops: string;
        location?: {
            id: number;
            street?: string;
            province?: {
                id: number | string;
                name: string;
                region_code: string;
            },
            municipality?: {
                id: number | string;
                province_id: number | string;
                name: string;
            },
            barangay?: {
                id: number | string;
                municipality_id: number | string;
                name: string;
            }
        }
        farmer?: {
            id: number | string;
            first_name: string;
            last_name: string;
            middle_name?: string;
            contact_number: string;
        }
        created_at: string;
        updated_at: string;
    }
}

export default function ViewFarmCard({ farm }: viewFarmProps) {
    if (!farm) {
        return (
            <div className="grid grid-cols-2 gap-6 px-5">
                <Label className="col-span-2 text-center text-gray-500">No farm data available</Label>
            </div>
        );
    }

    const ownerName = farm.farmer
        ? `${farm.farmer.first_name || ''} ${farm.farmer.middle_name ? farm.farmer.middle_name + ' ' : ''}${farm.farmer.last_name || ''}`.trim()
        : 'N/A';

    const address = farm.location
        ? [
            farm.location.province?.name,
            farm.location.municipality?.name,
            farm.location.barangay?.name,
            farm.location.street
          ].filter(Boolean).join(', ') || 'N/A'
        : 'N/A';

    const farmSize = farm.total_area ? `${farm.total_area} hectares` : 'N/A';


    return (
        <div className="grid grid-cols-2 gap-6 px-5">
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label className="!text-[#619154]">Farm Name</Label>
            <Label>{farm.name || 'N/A'}</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label className="!text-[#619154]">Owner</Label>
            <Label>{ownerName}</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label className="!text-[#619154]">Farm Address</Label>
            <Label>{address}</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label className="!text-[#619154]">Farm Size</Label>
            <Label>{farmSize}</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label className="!text-[#619154]">Previous Crops</Label>
            <Label>{farm.prev_crops || 'N/A'}</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
        </div>
    );
}
