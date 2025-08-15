import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function ViewFarmCard() {
    return (
        <div className="grid grid-cols-2 gap-6 px-5">
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Farm Name
            </Label>
            <Label htmlFor="">Green Acres</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Owner
            </Label>
            <Label htmlFor="">Mel David Mailem</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Farm Address
            </Label>
            <Label htmlFor="">Misamis Oriental, Tagoloan</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Farm Size
            </Label>
            <Label htmlFor="">10 hectares</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Previous Crops
            </Label>
            <Label htmlFor="">Corn, Soybean</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
        </div>
    );
}
