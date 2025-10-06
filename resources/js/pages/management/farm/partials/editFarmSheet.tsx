import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { type EditFarmProps } from '@/types/farm';
import { useForm, usePage } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

interface FarmIndexPropsExtended extends EditFarmProps {
    farm: EditFarmProps['farm'];
    farmers: EditFarmProps['farmers'];
    provinces: EditFarmProps['provinces'];
    municipalities: EditFarmProps['municipalities'];
    barangays: EditFarmProps['barangays'];
    crops: EditFarmProps['crops'];
}

export default function EditFarmSheet({ farmers, farm }: { farmers: EditFarmProps['farmers']; farm: EditFarmProps['farm'] }) {
    const { provinces, municipalities, barangays, crops } = usePage().props as unknown as FarmIndexPropsExtended;
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: farm?.name || '',
        total_area: farm?.total_area?.toString() || '',
        prev_crops: farm?.prev_crops || '',
        farmer_id: farm?.farmer?.id?.toString() || '',
        province_id: farm?.location?.province?.id?.toString() || '',
        municipality_id: farm?.location?.municipality?.id?.toString() || '',
        barangay_id: farm?.location?.barangay?.id?.toString() || '',
    });

    const farmMunicipalities = municipalities.filter((m) => String(m.province_id) === data.province_id);
    const farmBarangays = barangays.filter((b) => String(b.municipality_id) === data.municipality_id);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('management.farm.update', farm.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success('Farm updated successfully!');
                setOpen(false);
            },
            onError: (errors) => {
                console.log('Form errors:', errors);
                toast.error('Please fix the errors in the form.');
            },
        });
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 w-8 cursor-pointer border-[#D6E3D4] p-0 hover:border-[#619154] hover:bg-[#F8FAF8]">
                    <Edit className="h-4 w-4 text-[#619154]" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full overflow-y-auto bg-white p-0 sm:max-w-xl lg:max-w-2xl">
                <div className="flex h-full flex-col">
                    <SheetHeader className="space-y-1 border-b border-gray-200 px-4 py-4 sm:px-6">
                        <SheetTitle className="text-base font-semibold text-gray-900 sm:text-lg">Edit Farm Information</SheetTitle>
                        <SheetDescription className="text-xs text-gray-600 sm:text-sm">Update the farm details and location.</SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-2 py-2 sm:px-4 sm:py-4">
                        <form onSubmit={submit} id="farm-form" className="space-y-4 sm:space-y-6" noValidate>
                            {/* Farm Details */}
                            <div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="farmname" className="text-xs font-medium text-gray-700 sm:text-sm">
                                            Farm Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="farmname"
                                            name="name"
                                            className="h-9 text-sm text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154] sm:h-10"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            autoComplete="off"
                                            placeholder="Enter farm name"
                                            maxLength={100}
                                        />
                                        <div className="text-xs text-gray-500">Enter a descriptive name for the farm</div>
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="totalarea" className="text-xs font-medium text-gray-700 sm:text-sm">
                                            Total Area (hectares) <span className="text-xs text-gray-500">(Optional)</span>
                                        </Label>
                                        <Input
                                            id="totalarea"
                                            name="total_area"
                                            className="h-9 text-sm text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154] sm:h-10"
                                            value={data.total_area}
                                            onChange={(e) => setData('total_area', e.target.value)}
                                            autoComplete="off"
                                            placeholder="0.00"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="1000"
                                        />
                                        <div className="text-xs text-gray-500">Enter area in hectares (0.01 - 1000)</div>
                                        <InputError message={errors.total_area} />
                                    </div>
                                </div>
                            </div>

                            {/* Farmer & Previous Crops */}
                            <div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="farmer" className="text-xs font-medium text-gray-700 sm:text-sm">
                                            Select Farmer <span className="text-red-500">*</span>
                                        </Label>
                                        <SearchableSelect
                                            options={farmers.map((farmer) => ({
                                                value: String(farmer.id),
                                                label: `${farmer.firstname} ${farmer.middlename ? farmer.middlename + ' ' : ''}${farmer.lastname}`,
                                            }))}
                                            value={data.farmer_id}
                                            onValueChange={(value) => setData('farmer_id', value)}
                                            placeholder="Select Farmer"
                                            searchPlaceholder="Search farmers..."
                                        />
                                        <div className="text-xs text-gray-500">Choose the farmer who manages this farm</div>
                                        <InputError message={errors.farmer_id} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="prevcrops" className="text-xs font-medium text-gray-700 sm:text-sm">
                                            Previous Crops <span className="text-xs text-gray-500">(Optional)</span>
                                        </Label>
                                        <div className="relative">
                                            <Select
                                                onValueChange={(value) => {
                                                    if (value) {
                                                        const currentCrops = data.prev_crops ? data.prev_crops.split(', ') : [];
                                                        if (!currentCrops.includes(value)) {
                                                            const newCrops = [...currentCrops, value].join(', ');
                                                            setData('prev_crops', newCrops);
                                                        }
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="h-9 border-gray-300 focus:border-transparent focus:ring-2 focus:ring-[#619154] sm:h-10">
                                                    <SelectValue placeholder="Select previous crops">
                                                        {data.prev_crops || 'Select previous crops'}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {crops?.map((crop) => (
                                                        <SelectItem key={crop.id} value={crop.name}>
                                                            {crop.name}
                                                        </SelectItem>
                                                    )) || []}
                                                </SelectContent>
                                            </Select>

                                            {/* Clear button */}
                                            {data.prev_crops && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setData('prev_crops', '');
                                                    }}
                                                    className="absolute top-1/2 right-8 -translate-y-1/2 transform px-1 text-xs text-gray-400 hover:text-red-600 focus:outline-none"
                                                    aria-label="Clear all crops"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">Select crops previously grown on this farm</div>
                                        <InputError message={errors.prev_crops} />
                                    </div>
                                </div>
                            </div>

                            {/* Farm Address */}
                            <div>
                                <h3 className="mb-3 text-sm font-semibold text-gray-900 sm:mb-4 sm:text-base">Farm Address</h3>
                                <div>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-1">
                                        <Label className="text-xs font-medium text-gray-700 sm:text-sm">
                                            Province <span className="text-red-500">*</span>
                                        </Label>
                                        <SearchableSelect
                                            options={provinces.map((p) => ({ value: String(p.id), label: p.name }))}
                                            value={data.province_id}
                                            onValueChange={(val) => {
                                                setData('province_id', val);
                                                setData('municipality_id', '');
                                                setData('barangay_id', '');
                                            }}
                                            placeholder="Select Province"
                                            portalContainer={document.getElementById('farm-form')}
                                        />
                                        <div className="text-xs text-gray-500">Choose the province where the farm is located</div>
                                        <InputError message={errors.province_id} />
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-1">
                                        <Label className="text-xs font-medium text-gray-700 sm:text-sm">
                                            Municipality <span className="text-red-500">*</span>
                                        </Label>
                                        <SearchableSelect
                                            options={farmMunicipalities.map((m) => ({ value: String(m.id), label: m.name }))}
                                            value={data.municipality_id}
                                            onValueChange={(val) => {
                                                setData('municipality_id', val);
                                                setData('barangay_id', '');
                                            }}
                                            placeholder="Select Municipality"
                                            disabled={!data.province_id}
                                            portalContainer={document.getElementById('farm-form')}
                                        />
                                        <div className="text-xs text-gray-500">
                                            {!data.province_id ? 'Select province first' : 'Choose the municipality'}
                                        </div>
                                        <InputError message={errors.municipality_id} />
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-1">
                                        <Label className="text-xs font-medium text-gray-700 sm:text-sm">
                                            Barangay <span className="text-red-500">*</span>
                                        </Label>
                                        <SearchableSelect
                                            options={farmBarangays.map((b) => ({ value: String(b.id), label: b.name }))}
                                            value={data.barangay_id}
                                            onValueChange={(val) => setData('barangay_id', val)}
                                            placeholder="Select Barangay"
                                            disabled={!data.municipality_id}
                                            portalContainer={document.getElementById('farm-form')}
                                        />
                                        <div className="text-xs text-gray-500">
                                            {!data.municipality_id ? 'Select municipality first' : 'Choose the barangay'}
                                        </div>
                                        <InputError message={errors.barangay_id} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <SheetFooter className="border-t border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
                            <SheetClose asChild>
                                <Button type="button" variant="outline" className="w-full sm:w-auto">
                                    Cancel
                                </Button>
                            </SheetClose>
                            <Button
                                type="submit"
                                form="farm-form"
                                disabled={
                                    processing || !data.name || !data.farmer_id || !data.province_id || !data.municipality_id || !data.barangay_id
                                }
                                className="w-full bg-[#619154] text-white hover:bg-[#4F7A43] sm:w-auto"
                            >
                                {processing ? 'Updating...' : 'Update Farm'}
                            </Button>
                        </div>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}
