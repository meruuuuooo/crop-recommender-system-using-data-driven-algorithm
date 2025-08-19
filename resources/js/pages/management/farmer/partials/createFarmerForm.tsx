import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Swal from 'sweetalert2';


export default function CreateFarmerForm({
    provinces,
    municipalities,
    barangays,
}: {
    provinces: { id: number | string; name: string }[];
    municipalities: { id: number | string; name: string; province_id: number | string }[];
    barangays: { id: number | string; name: string; municipality_id: number | string }[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        contact_number: '',
        farming_experience: '',
        province_id: '',
        municipality_id: '',
        barangay_id: '',
        street: '',
        registration_date: '',
    });

    const filteredMunicipalities = municipalities.filter((municipality) => String(municipality.province_id) === data.province_id);

    const filteredBarangays = barangays.filter((barangay) => String(barangay.municipality_id) === data.municipality_id);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('management.farmer.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Farmer has been created successfully.',
                    confirmButtonColor: '#619154',
                    timer: 3000,
                    timerProgressBar: true,
                });
            },
            onError: () => {
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
                    <Label htmlFor="firstname">First Name</Label>

                    <Input
                        id="firstname"
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
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
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        value={data.middle_name}
                        onChange={(e) => setData('middle_name', e.target.value)}
                        autoComplete="middlename"
                        placeholder="Enter middle name"
                    />

                    <InputError message={errors.middle_name} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="lastname">Last Name</Label>

                    <Input
                        id="lastname"
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
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
                            className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                            value={data.contact_number}
                            onChange={(e) => setData('contact_number', e.target.value)}
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
                            className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                            value={data.farming_experience}
                            onChange={(e) => setData('farming_experience', e.target.value)}
                            required
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
                            onValueChange={(value) => {
                                setData('province_id', value);
                                setData('municipality_id', '');
                                setData('barangay_id', '');
                            }}
                        >
                            <SelectTrigger className="w-full">
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
                            onValueChange={(value) => {
                                setData('municipality_id', value);
                                setData('barangay_id', '');
                            }}
                            disabled={!data.province_id}
                        >
                            <SelectTrigger className="w-full">
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
                    <Select onValueChange={(value) => setData('barangay_id', value)} disabled={!data.municipality_id}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Barangay" />
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
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        value={data.street}
                        onChange={(e) => setData('street', e.target.value)}
                        required
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
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        value={data.registration_date}
                        onChange={(e) => setData('registration_date', e.target.value)}
                        required
                        autoComplete="registrationDate"
                        placeholder="Enter registration date"
                        type="date"
                    />

                    <InputError message={errors.registration_date} className="mt-2" />
                </div>
                <Button type="submit" disabled={processing} className="cursor-pointer bg-[#619154] text-white hover:bg-[#4F7A43] disabled:opacity-50">
                    {processing ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}
