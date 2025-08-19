import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Swal from 'sweetalert2';
import { route } from 'ziggy-js';

type CreateFarmProps = {
    farmers: {
        id: number | string;
        first_name: string;
        middle_name: string;
        last_name: string;
    }[];
    provinces: {
        id: number | string;
        name: string;
        region_code: number | string;
    }[];
    municipalities: {
        id: number | string;
        name: string;
        province_id: number | string;
    }[];
    barangays: {
        id: number | string;
        name: string;
        municipality_id: number | string;
    }[];
};

export default function CreateFarmForm({ farmers, provinces, municipalities, barangays }: CreateFarmProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        total_area: '',
        prev_crops: '',
        farmer_id: '',
        province_id: '',
        municipality_id: '',
        barangay_id: '',
    });

    const filteredMunicipalities = municipalities.filter((municipality) => String(municipality.province_id) === data.province_id);
    const filteredBarangays = barangays.filter((barangay) => String(barangay.municipality_id) === data.municipality_id);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('management.farm.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                console.log('Farm created successfully');
                reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Farm has been created successfully.',
                    confirmButtonColor: '#619154',
                    timer: 3000,
                    timerProgressBar: true,
                });
            },
            onError: (errors) => {
                console.error('Error submitting form:', errors);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'There was an error creating the farmer. Please check the form and try again.',
                    confirmButtonColor: '#dc2626',
                });
            },
        });
    };

    return (
        <form onSubmit={submit}>
            <div className="mt-2 grid max-w-6/12 grid-cols-1 gap-6 px-2 md:grid-cols-2 lg:grid-cols-1">
                <div className="grid gap-2">
                    <Label htmlFor="farmname">Farm Name</Label>

                    <Input
                        id="farmname"
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="farmname"
                        placeholder="Enter farm name"
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="totalarea">Total Area (hectares)</Label>

                    <Input
                        id="totalarea"
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        value={data.total_area}
                        onChange={(e) => setData('total_area', e.target.value)}
                        required
                        autoComplete="totalarea"
                        placeholder="Enter total area in hectares"
                        type="number"
                        step="0.01"
                        min="0"
                    />

                    <InputError message={errors.total_area} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="prevcrops">Previous Crops</Label>

                    <Input
                        id="prevcrops"
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        value={data.prev_crops}
                        onChange={(e) => setData('prev_crops', e.target.value)}
                        autoComplete="prevcrops"
                        placeholder="Enter previous crops grown"
                    />

                    <InputError message={errors.prev_crops} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="farmer">Select Farmer</Label>
                    <SearchableSelect
                        options={farmers.map((farmer) => ({
                            value: String(farmer.id),
                            label: `${farmer.first_name} ${farmer.middle_name ? farmer.middle_name + ' ' : ''}${farmer.last_name}`,
                        }))}
                        value={data.farmer_id}
                        onValueChange={(value) => setData('farmer_id', value)}
                        placeholder="Select Farmer"
                        searchPlaceholder="Search farmers..."
                        clearable
                    />
                    <InputError message={errors.farmer_id} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="province">Province</Label>
                        <SearchableSelect
                            options={provinces.map((province) => ({
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

                <Button type="submit" disabled={processing} className="cursor-pointer bg-[#619154] text-white hover:bg-[#4F7A43] disabled:opacity-50">
                    {processing ? 'Creating Farm...' : 'Create Farm'}
                </Button>
            </div>
        </form>
    );
}
