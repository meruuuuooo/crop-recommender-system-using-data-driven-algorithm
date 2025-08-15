import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function ViewFarmerCard() {
    return (
        <div className="grid grid-cols-2 gap-6 px-5">
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Full name
            </Label>
            <Label htmlFor="">Mel David Mailem</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Contact Number
            </Label>
            <Label htmlFor="">(123) 456-7890</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Home Address
            </Label>
            <Label htmlFor="">123 Main St, Springfield</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Street
            </Label>
            <Label htmlFor="">456 Elm St, Springfield</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Farming Experience
            </Label>
            <Label htmlFor="">5 years</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
            <Label htmlFor="" className="!text-[#619154]">
                Registration Date
            </Label>
            <Label htmlFor="">jan 1, 2020</Label>
            <Separator orientation="horizontal" className="col-span-2 mr-2 data-[orientation=vertical]:h-4" />
        </div>
    );
}
