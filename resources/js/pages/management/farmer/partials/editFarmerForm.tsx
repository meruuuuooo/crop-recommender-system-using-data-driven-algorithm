import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

type Props = {
    farmer: {
        id: number;
        first_name: string;
        middle_name: string;
        last_name: string;
        contact_number: string;
        farming_experience: string | null;
        registration_date: string;
        location: {
            street: string;
            province_id: number | string;
            municipality_id: number | string;
            barangay_id: number | string;
        };
        user: {
            last_name: string;
            email: string;
        };
        created_at: string;
        updated_at: string;
    };
    provinces: { id: number | string; name: string }[];
    municipalities: { id: number | string; name: string; province_id: number | string }[];
    barangays: { id: number | string; name: string; municipality_id: number | string }[];
};

export default function EditFarmerForm({ provinces, municipalities, barangays, farmer }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        first_name: farmer.first_name || '',
        middle_name: farmer.middle_name || '',
        last_name: farmer.last_name || '',
        contact_number: farmer.contact_number || '',
        farming_experience: farmer.farming_experience || '',
        province_id: String(farmer.location.province_id || ''),
        municipality_id: String(farmer.location.municipality_id || ''),
        barangay_id: String(farmer.location.barangay_id || ''),
        street: farmer.location.street || '',
        registration_date: farmer.registration_date || '',
    });

    const filteredMunicipalities = municipalities.filter((municipality) => String(municipality.province_id) === String(data.province_id));

    const filteredBarangays = barangays.filter(
        (barangay) => String(barangay.id) === String(data.barangay_id) || String(barangay.municipality_id) === String(data.municipality_id),
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('management.farmer.update', farmer.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Farmer updated successfully.',
                    confirmButtonColor: '#619154',
                    timer: 3000,
                    timerProgressBar: true,
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to update farmer. Please check the form for errors.',
                    confirmButtonColor: '#D9534F',
                    timer: 3000,
                    timerProgressBar: true,
                });
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mt-2 grid max-w-6/12 grid-cols-1 gap-6 px-2 md:grid-cols-2 lg:grid-cols-1">
                <div className="grid gap-2">
                    <Label htmlFor="firstname">First Name</Label>

                    <Input
                        id="firstname"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        required
                        autoComplete="firstname"
                        placeholder="Enter first name"
                    />

                    <InputError message={errors.first_name} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="middlename">Middle Name</Label>

                    <Input
                        id="middlename"
                        value={data.middle_name}
                        onChange={(e) => setData('middle_name', e.target.value)}
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        required
                        autoComplete="middlename"
                        placeholder="Enter middle name"
                    />

                    <InputError message={errors.middle_name} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="lastname">Last Name</Label>

                    <Input
                        id="lastname"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        required
                        autoComplete="lastname"
                        placeholder="Enter last name"
                    />

                    <InputError message={errors.last_name} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>

                        <Input
                            id="contactNumber"
                            value={data.contact_number}
                            onChange={(e) => setData('contact_number', e.target.value)}
                            className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                            required
                            autoComplete="contactNumber"
                            placeholder="Enter contact number"
                        />

                        <InputError message={errors.contact_number} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="farmingExperience">Farming Experience</Label>

                        <Input
                            id="farmingExperience"
                            value={data.farming_experience}
                            onChange={(e) => setData('farming_experience', e.target.value)}
                            className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                            autoComplete="farmingExperience"
                            placeholder="Enter farming experience (in years)"
                        />

                        <InputError message={errors.farming_experience} className="mt-2" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="province">Province</Label>
                        <Select
                            value={data.province_id || undefined}
                            onValueChange={(value) => {
                                setData('province_id', value);
                                setData('municipality_id', '');
                                setData('barangay_id', '');
                            }}
                        >
                            <SelectTrigger className="w-full border !border-[#D6E3D4] !text-[#619154]">
                                <SelectValue placeholder="Select Province" />
                            </SelectTrigger>
                            <SelectContent>
                                {provinces.map((province) => (
                                    <SelectItem key={province.id} value={String(province.id)}>
                                        {province.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.province_id} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="municipality">Municipality</Label>
                        <Select
                            value={data.municipality_id || undefined}
                            onValueChange={(value) => {
                                setData('municipality_id', value);
                                setData('barangay_id', '');
                            }}
                            disabled={!data.province_id}
                        >
                            <SelectTrigger className="w-full border !border-[#D6E3D4] !text-[#619154]">
                                <SelectValue placeholder="Select Municipality" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredMunicipalities.map((municipality) => (
                                    <SelectItem key={municipality.id} value={String(municipality.id)}>
                                        {municipality.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.municipality_id} className="mt-2" />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="barangay">Barangay</Label>
                    <Select
                        value={data.barangay_id || undefined}
                        onValueChange={(value) => setData('barangay_id', value)}
                        disabled={!data.municipality_id}
                    >
                        <SelectTrigger className="w-full border !border-[#D6E3D4] !text-[#619154]">
                            <SelectValue placeholder="Select Municipality" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredBarangays.map((barangay) => (
                                <SelectItem key={barangay.id} value={String(barangay.id)}>
                                    {barangay.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.barangay_id} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="street">Street</Label>

                    <Input
                        id="street"
                        value={data.street}
                        onChange={(e) => setData('street', e.target.value)}
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        autoComplete="street"
                        placeholder="Enter street address/zone"
                        type="text"
                    />

                    <InputError message={errors.street} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="registrationDate">Registration date</Label>

                    <Input
                        id="registrationDate"
                        value={data.registration_date}
                        onChange={(e) => setData('registration_date', e.target.value)}
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        required
                        autoComplete="registrationDate"
                        placeholder="Enter registration date"
                        type="date"
                    />

                    <InputError message={errors.registration_date} className="mt-2" />
                </div>

                <Button type="submit" disabled={processing} className="cursor-pointer bg-[#619154] text-white hover:bg-[#4F7A43] disabled:opacity-50">
                    {processing ? 'Updating...' : 'Update Farmer'}
                </Button>
            </div>
        </form>
    );
}
