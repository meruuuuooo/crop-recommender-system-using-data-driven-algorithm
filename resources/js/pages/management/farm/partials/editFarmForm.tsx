import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Swal from 'sweetalert2';
import { route } from 'ziggy-js';

type editFarmProps = {
    farm?: {
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
            };
            municipality?: {
                id: number | string;
                province_id: number | string;
                name: string;
            };
            barangay?: {
                id: number | string;
                municipality_id: number | string;
                name: string;
            };
        };
        farmer?: {
            id: number | string;
            first_name: string;
            last_name: string;
            middle_name?: string;
            contact_number: string;
        };
        created_at: string;
        updated_at: string;
    };
    farmers?: {
        id: number | string;
        first_name: string;
        middle_name?: string;
        last_name: string;
    }[];
    provinces?: { id: number | string; name: string }[];
    municipalities?: { id: number | string; name: string; province_id: number | string }[];
    barangays?: { id: number | string; name: string; municipality_id: number | string }[];
};

export default function EditFarmForm({ farm, farmers, provinces, municipalities, barangays }: editFarmProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: farm?.name || '',
        total_area: farm?.total_area?.toString() || '',
        prev_crops: farm?.prev_crops || '',
        farmer_id: farm?.farmer?.id?.toString() || '',
        province_id: farm?.location?.province?.id?.toString() || '',
        municipality_id: farm?.location?.municipality?.id?.toString() || '',
        barangay_id: farm?.location?.barangay?.id?.toString() || '',
    });

    const filteredMunicipalities = municipalities?.filter((municipality) => String(municipality.province_id) === data.province_id) || [];
    const filteredBarangays = barangays?.filter((barangay) => String(barangay.municipality_id) === String(data.municipality_id)) || [];

    const submit: FormEventHandler = (e) => {
        // e.preventDefault();

        // put(route('management.farm.update', farm.id), {
        //     preserveScroll: true,
        //     preserveState: true,
        //     onSuccess: () => {
        //         console.log('Farm updated successfully');
        //         Swal.fire({
        //             icon: 'success',
        //             title: 'Success!',
        //             text: 'Farm has been updated successfully.',
        //             confirmButtonColor: '#619154',
        //             timer: 3000,
        //             timerProgressBar: true,
        //         });
        //     },
        //     onError: (errors) => {
        //         console.error('Error submitting form:', errors);
        //         Swal.fire({
        //             icon: 'error',
        //             title: 'Error!',
        //             text: 'There was an error updating the farm. Please check the form and try again.',
        //             confirmButtonColor: '#dc2626',
        //         });
        //     },
        // });
    };

    return (
        <form onSubmit={submit}>
            <div className="mt-2 grid max-w-6/12 grid-cols-1 gap-6 px-2 md:grid-cols-2 lg:grid-cols-1">
                <div className="grid gap-2">
                    <Label htmlFor="farmName">Farm Name</Label>
                    <Input
                        id="farmName"
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="farmName"
                        placeholder="Enter farm name"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="owner">Owner (Farmer Name)</Label>
                    <SearchableSelect
                        options={(farmers || []).map((farmer) => ({
                            value: String(farmer.id),
                            label: `${farmer.first_name} ${farmer.middle_name ? farmer.middle_name + ' ' : ''}${farmer.last_name}`,
                        }))}
                        value={data.farmer_id}
                        onValueChange={(value) => setData('farmer_id', value)}
                        placeholder="Select Farmer"
                        searchPlaceholder="Search farmers..."
                        className="w-full"
                        clearable
                    />
                    <InputError message={errors.farmer_id} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="province">Province</Label>
                        <SearchableSelect
                            options={(provinces || []).map((province) => ({
                                value: String(province.id),
                                label: province.name,
                            }))}
                            value={data.province_id}
                            onValueChange={(value) => {
                                setData('province_id', value);
                                setData('municipality_id', '');
                                setData('barangay_id', '');
                            }}
                            placeholder="Select Province"
                            searchPlaceholder="Search provinces..."
                            clearable
                        />
                        <InputError message={errors.province_id} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="municipality">Municipality</Label>
                        <SearchableSelect
                            options={filteredMunicipalities.map((municipality) => ({
                                value: String(municipality.id),
                                label: municipality.name,
                            }))}
                            value={data.municipality_id}
                            onValueChange={(value) => {
                                setData('municipality_id', value);
                                setData('barangay_id', '');
                            }}
                            placeholder="Select Municipality"
                            searchPlaceholder="Search municipalities..."
                            disabled={!data.province_id}
                            clearable
                        />
                        <InputError message={errors.municipality_id} className="mt-2" />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="barangay">Barangay</Label>
                    <SearchableSelect
                        options={filteredBarangays.map((barangay) => ({
                            value: String(barangay.id),
                            label: barangay.name,
                        }))}
                        value={data.barangay_id}
                        onValueChange={(value) => setData('barangay_id', value)}
                        placeholder="Select Barangay"
                        searchPlaceholder="Search barangays..."
                        disabled={!data.municipality_id}
                        clearable
                    />
                    <InputError message={errors.barangay_id} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="farmSize">Farm Size (hectares)</Label>
                    <Input
                        id="farmSize"
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        value={data.total_area}
                        onChange={(e) => setData('total_area', e.target.value)}
                        required
                        autoComplete="farmSize"
                        placeholder="Enter farm size"
                        type="number"
                        min={0}
                        step={0.01}
                    />
                    <InputError message={errors.total_area} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="previousCrops">Previous Crops</Label>
                    <Input
                        id="previousCrops"
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        value={data.prev_crops}
                        onChange={(e) => setData('prev_crops', e.target.value)}
                        autoComplete="previousCrops"
                        placeholder="Enter previous crops (comma separated)"
                    />
                    <InputError message={errors.prev_crops} className="mt-2" />
                </div>

                <Button type="submit" disabled={processing} className="cursor-pointer bg-[#619154] text-white hover:bg-[#4F7A43] disabled:opacity-50">
                    {processing ? 'Updating Farm...' : 'Update Farm'}
                </Button>
            </div>
        </form>
    );
}
