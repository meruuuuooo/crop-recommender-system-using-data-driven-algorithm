import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type EditFarmProps } from '@/types/farm';
import { useForm, usePage } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

interface FarmerIndexPropsExtended extends EditFarmProps {
    farm: EditFarmProps['farm'];
    farmers: EditFarmProps['farmers'];
    provinces: EditFarmProps['provinces'];
    municipalities: EditFarmProps['municipalities'];
    barangays: EditFarmProps['barangays'];
    crops: EditFarmProps['crops'];
}

export default function EditFarmFormDialog({ farmers, farm }: { farmers: EditFarmProps['farmers']; farm: EditFarmProps['farm'] }) {
    const { provinces, municipalities, barangays, crops } = usePage().props as unknown as FarmerIndexPropsExtended;

    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
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

    console.log('Form data:', data);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('management.farm.update', farm.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Farm updated successfully!');
                setOpen(false);
                reset();
            },
            onError: (errors) => {
                console.log('Form errors:', errors);
                toast.error('Please fix the errors in the form.');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 w-8 cursor-pointer border-[#D6E3D4] p-0 hover:border-[#619154] hover:bg-[#F8FAF8]">
                    <Edit className="h-4 w-4 text-[#619154]" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[800px] overflow-y-auto rounded-xl bg-white p-8 sm:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Farm Information</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">Fill in the details about the farmer’s farm.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} id="edit-farm-form" className="space-y-6">
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="farmname" className="text-sm font-medium text-gray-700">
                                Farm Name{' '}
                                <span className="text-red-500" aria-label="required">
                                    *
                                </span>
                            </Label>
                            <Input
                                id="farmname"
                                name="name"
                                className="w-full border text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Enter farm name"
                            />
                            <div id="farm-name-help" className="text-xs text-gray-500">
                                Enter a descriptive name for the farm
                            </div>
                            <InputError message={errors['name']} id="farm-name-error" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalarea" className="text-sm font-medium text-gray-700">
                                Total Area (hectares) <span className="text-xs text-gray-500">(Optional)</span>
                            </Label>
                            <Input
                                id="totalarea"
                                name="total_area"
                                className="w-full border text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.total_area}
                                onChange={(e) => setData('total_area', e.target.value)}
                                autoComplete="off"
                                placeholder="0.00"
                                type="number"
                            />
                            <div id="total-area-help" className="text-xs text-gray-500">
                                Enter area in hectares (0.01 - 1000)
                            </div>
                            <InputError message={errors['total_area']} id="total-area-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="farmer" className="text-sm font-medium text-gray-700">
                                Select Farmer{' '}
                                <span className="text-red-500" aria-label="required">
                                    *
                                </span>
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
                                clearable
                                portalContainer={document.getElementById('farm-form')}
                            />
                            <div id="farmer-help" className="text-xs text-gray-500">
                                Choose the farmer who will manage this farm
                            </div>
                            <InputError message={errors.farmer_id} id="farmer-error" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="prevcrops" className="text-sm font-medium text-gray-700">
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
                                    <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
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
                            <div id="prev-crops-help" className="text-xs text-gray-500">
                                Select crops that were previously grown on this farm. You can select multiple crops.
                            </div>
                            <InputError message={errors['prev_crops']} id="prev-crops-error" />
                        </div>
                    </div>
                    <h3 className="font-semibold text-gray-900">Farm Address</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className='space-y-2 lg:col-span-1'>
                            <Label>
                                Province
                                <span className="text-red-500" aria-label="required">
                                    {' '}
                                    *
                                </span>
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
                            <div id="province-help" className="text-xs text-gray-500">
                                Choose the province where the farm is located
                            </div>
                            <InputError message={errors['province_id']} />
                        </div>
                        <div className='space-y-2 lg:col-span-1'>
                            <Label>
                                Municipality
                                <span className="text-red-500" aria-label="required">
                                    {' '}
                                    *
                                </span>
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
                            <div id="municipality-help" className="text-xs text-gray-500">
                                {!data.province_id ? 'Province must be selected first' : 'Choose the municipality within the selected province'}
                            </div>
                            <InputError message={errors['municipality_id']} />
                        </div>
                        <div className='space-y-2 lg:col-span-1'>
                            <Label>
                                Barangay
                                <span className="text-red-500" aria-label="required">
                                    {' '}
                                    *
                                </span>
                            </Label>
                            <SearchableSelect
                                options={farmBarangays.map((b) => ({ value: String(b.id), label: b.name }))}
                                value={data.barangay_id}
                                onValueChange={(val) => setData('barangay_id', val)}
                                placeholder="Select Barangay"
                                disabled={!data.municipality_id}
                                portalContainer={document.getElementById('farm-form')}
                            />
                            <div id="barangay-help" className="text-xs text-gray-500">
                                {!data.municipality_id
                                    ? 'Municipality must be selected first'
                                    : 'Choose the barangay within the selected municipality'}
                            </div>
                            <InputError message={errors['barangay_id']} />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                processing || !data.name || !data.province_id || !data.municipality_id || !data.barangay_id
                            }
                            className="bg-[#619154] text-white hover:bg-[#4F7A43]"
                        >
                            {processing ? 'Updating...' : 'Update'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
