import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Swal from 'sweetalert2';

interface RegistrationProps {
    provinces: Array<{ id: number; name: string }>;
    municipalities: Array<{ id: number; name: string; province_id: number }>;
    barangays: Array<{ id: number; name: string; municipality_id: number }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Registration',
        href: '/registration',
    },
];

export default function Registration({ provinces, municipalities, barangays }: RegistrationProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        farmer: {
            firstname: '',
            middlename: '',
            lastname: '',
            contact_number: '',
            farming_experience: '',
            province_id: '',
            municipality_id: '',
            barangay_id: '',
            street: '',
            registration_date: new Date().toISOString().split('T')[0],
        },
        farm: {
            name: '',
            total_area: '',
            prev_crops: '',
            province_id: '',
            municipality_id: '',
            barangay_id: '',
        },
    });

    const farmerFilteredMunicipalities = municipalities.filter((municipality) => String(municipality.province_id) === data.farmer.province_id);
    const farmerFilteredBarangays = barangays.filter((barangay) => String(barangay.municipality_id) === data.farmer.municipality_id);

    const farmFilteredMunicipalities = municipalities.filter((municipality) => String(municipality.province_id) === data.farm.province_id);
    const farmFilteredBarangays = barangays.filter((barangay) => String(barangay.municipality_id) === data.farm.municipality_id);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('registration.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Farmer and farm have been registered successfully.',
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
                    text: 'There was an error registering. Please check the form and try again.',
                    confirmButtonColor: '#dc2626',
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registration" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <Card className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-white md:min-h-min dark:border-sidebar-border">
                    <div className="p-8">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Farmer Registration</h1>
                            <p className="mt-2 text-gray-600">
                                Register a new farmer and their farm
                            </p>
                        </div>
                        <div className="w-full" role="main">
                            <form onSubmit={submit} className="space-y-6" noValidate aria-label="Combined farmer and farm registration form">
                                {/* Farmer Information */}
                                <div className="rounded-lg border border-gray-200 bg-white p-6" role="region" aria-labelledby="farmer-info-heading">
                                    <h2 id="farmer-info-heading" className="mb-6 border-b border-gray-200 pb-3 text-xl font-semibold text-gray-900">
                                        Farmer Information
                                    </h2>

                                    {/* Personal Information */}
                                    <div className="mb-6">
                                        <h3 className="mb-4 text-lg font-medium text-gray-800">Personal Details</h3>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="farmer-firstname" className="text-sm font-medium text-gray-700">
                                                    First Name <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="farmer-firstname"
                                                    className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                                    value={data.farmer.firstname}
                                                    onChange={(e) => setData('farmer', { ...data.farmer, firstname: e.target.value })}
                                                    required
                                                    placeholder="Enter first name"
                                                />
                                                <InputError message={errors['farmer.firstname']} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="farmer-middlename" className="text-sm font-medium text-gray-700">
                                                    Middle Name <span className="text-xs text-gray-500">(Optional)</span>
                                                </Label>
                                                <Input
                                                    id="farmer-middlename"
                                                    className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                                    value={data.farmer.middlename}
                                                    onChange={(e) => setData('farmer', { ...data.farmer, middlename: e.target.value })}
                                                    placeholder="Enter middle name"
                                                />
                                                <InputError message={errors['farmer.middlename']} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="farmer-lastname" className="text-sm font-medium text-gray-700">
                                                    Last Name <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="farmer-lastname"
                                                    className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                                    value={data.farmer.lastname}
                                                    onChange={(e) => setData('farmer', { ...data.farmer, lastname: e.target.value })}
                                                    required
                                                    placeholder="Enter last name"
                                                />
                                                <InputError message={errors['farmer.lastname']} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact & Experience */}
                                    <div className="mb-6">
                                        <h3 className="mb-4 text-lg font-medium text-gray-800">Contact & Experience</h3>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            <div className="space-y-2 lg:col-span-2">
                                                <Label htmlFor="farmer-contact" className="text-sm font-medium text-gray-700">
                                                    Contact Number <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="farmer-contact"
                                                    className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                                    value={data.farmer.contact_number}
                                                    onChange={(e) => setData('farmer', { ...data.farmer, contact_number: e.target.value })}
                                                    required
                                                    placeholder="e.g., +63 912 345 6789"
                                                    type="tel"
                                                />
                                                <InputError message={errors['farmer.contact_number']} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="farmer-experience" className="text-sm font-medium text-gray-700">
                                                    Farming Experience (Years) <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="farmer-experience"
                                                    className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                                    value={data.farmer.farming_experience}
                                                    onChange={(e) => setData('farmer', { ...data.farmer, farming_experience: e.target.value })}
                                                    required
                                                    placeholder="e.g., 5"
                                                    type="number"
                                                    min="0"
                                                    max="80"
                                                />
                                                <InputError message={errors['farmer.farming_experience']} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Farmer Address */}
                                    <div>
                                        <h3 className="mb-4 text-lg font-medium text-gray-800">Farmer Address</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="farmer-province" className="text-sm font-medium text-gray-700">
                                                        Province <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Select
                                                        onValueChange={(value) => {
                                                            setData('farmer', {
                                                                ...data.farmer,
                                                                province_id: value,
                                                                municipality_id: '',
                                                                barangay_id: '',
                                                            });
                                                        }}
                                                        value={data.farmer.province_id}
                                                        required
                                                    >
                                                        <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
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
                                                    <InputError message={errors['farmer.province_id']} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="farmer-municipality" className="text-sm font-medium text-gray-700">
                                                        Municipality <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Select
                                                        onValueChange={(value) => {
                                                            setData('farmer', {
                                                                ...data.farmer,
                                                                municipality_id: value,
                                                                barangay_id: '',
                                                            });
                                                        }}
                                                        value={data.farmer.municipality_id}
                                                        disabled={!data.farmer.province_id}
                                                        required
                                                    >
                                                        <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154] disabled:cursor-not-allowed disabled:opacity-50">
                                                            <SelectValue
                                                                placeholder={
                                                                    !data.farmer.province_id ? 'Select Province first' : 'Select Municipality'
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {farmerFilteredMunicipalities.map((municipality) => (
                                                                <SelectItem key={municipality.id} value={String(municipality.id)}>
                                                                    {municipality.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError message={errors['farmer.municipality_id']} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="farmer-barangay" className="text-sm font-medium text-gray-700">
                                                        Barangay <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Select
                                                        onValueChange={(value) => setData('farmer', { ...data.farmer, barangay_id: value })}
                                                        value={data.farmer.barangay_id}
                                                        disabled={!data.farmer.municipality_id}
                                                        required
                                                    >
                                                        <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154] disabled:cursor-not-allowed disabled:opacity-50">
                                                            <SelectValue
                                                                placeholder={
                                                                    !data.farmer.municipality_id ? 'Select Municipality first' : 'Select Barangay'
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {farmerFilteredBarangays.map((barangay) => (
                                                                <SelectItem key={barangay.id} value={String(barangay.id)}>
                                                                    {barangay.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError message={errors['farmer.barangay_id']} />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="farmer-street" className="text-sm font-medium text-gray-700">
                                                    Street Address/Zone <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="farmer-street"
                                                    className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                                    value={data.farmer.street}
                                                    onChange={(e) => setData('farmer', { ...data.farmer, street: e.target.value })}
                                                    required
                                                    placeholder="Enter street address, zone, or landmark"
                                                />
                                                <InputError message={errors['farmer.street']} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Farm Information */}
                                <div className="rounded-lg border border-gray-200 bg-white p-6" role="region" aria-labelledby="farm-info-heading">
                                    <h2 id="farm-info-heading" className="mb-6 border-b border-gray-200 pb-3 text-xl font-semibold text-gray-900">
                                        Farm Information
                                    </h2>

                                    {/* Farm Details */}
                                    <div className="mb-6">
                                        <h3 className="mb-4 text-lg font-medium text-gray-800">Farm Details</h3>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="farm-name" className="text-sm font-medium text-gray-700">
                                                    Farm Name <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="farm-name"
                                                    className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                                    value={data.farm.name}
                                                    onChange={(e) => setData('farm', { ...data.farm, name: e.target.value })}
                                                    required
                                                    placeholder="Enter farm name"
                                                />
                                                <InputError message={errors['farm.name']} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="farm-area" className="text-sm font-medium text-gray-700">
                                                    Total Area (hectares) <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="farm-area"
                                                    className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                                    value={data.farm.total_area}
                                                    onChange={(e) => setData('farm', { ...data.farm, total_area: e.target.value })}
                                                    required
                                                    placeholder="0.00"
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    max="1000"
                                                />
                                                <InputError message={errors['farm.total_area']} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="farm-prev-crops" className="text-sm font-medium text-gray-700">
                                                    Previous Crops <span className="text-xs text-gray-500">(Optional)</span>
                                                </Label>
                                                <Input
                                                    id="farm-prev-crops"
                                                    className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                                    value={data.farm.prev_crops}
                                                    onChange={(e) => setData('farm', { ...data.farm, prev_crops: e.target.value })}
                                                    placeholder="e.g., Rice, Corn, Vegetables"
                                                />
                                                <InputError message={errors['farm.prev_crops']} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Farm Location */}
                                    <div>
                                        <h3 className="mb-4 text-lg font-medium text-gray-800">Farm Location</h3>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="farm-province" className="text-sm font-medium text-gray-700">
                                                    Province <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    onValueChange={(value) => {
                                                        setData('farm', {
                                                            ...data.farm,
                                                            province_id: value,
                                                            municipality_id: '',
                                                            barangay_id: '',
                                                        });
                                                    }}
                                                    value={data.farm.province_id}
                                                    required
                                                >
                                                    <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
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
                                                <InputError message={errors['farm.province_id']} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="farm-municipality" className="text-sm font-medium text-gray-700">
                                                    Municipality <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    onValueChange={(value) => {
                                                        setData('farm', {
                                                            ...data.farm,
                                                            municipality_id: value,
                                                            barangay_id: '',
                                                        });
                                                    }}
                                                    value={data.farm.municipality_id}
                                                    disabled={!data.farm.province_id}
                                                    required
                                                >
                                                    <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154] disabled:cursor-not-allowed disabled:opacity-50">
                                                        <SelectValue
                                                            placeholder={!data.farm.province_id ? 'Select Province first' : 'Select Municipality'}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {farmFilteredMunicipalities.map((municipality) => (
                                                            <SelectItem key={municipality.id} value={String(municipality.id)}>
                                                                {municipality.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors['farm.municipality_id']} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="farm-barangay" className="text-sm font-medium text-gray-700">
                                                    Barangay <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    onValueChange={(value) => setData('farm', { ...data.farm, barangay_id: value })}
                                                    value={data.farm.barangay_id}
                                                    disabled={!data.farm.municipality_id}
                                                    required
                                                >
                                                    <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154] disabled:cursor-not-allowed disabled:opacity-50">
                                                        <SelectValue
                                                            placeholder={!data.farm.municipality_id ? 'Select Municipality first' : 'Select Barangay'}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {farmFilteredBarangays.map((barangay) => (
                                                            <SelectItem key={barangay.id} value={String(barangay.id)}>
                                                                {barangay.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors['farm.barangay_id']} />
                                            </div>
                                        </div>

                                        <div className="mt-4 rounded-md bg-blue-50 p-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="ml-3 flex-1 md:flex md:justify-between">
                                                    <p className="text-sm text-blue-700">
                                                        <strong>Tip:</strong> The farm location can be different from the farmer's address if needed.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex flex-col items-center justify-end gap-4 pt-6 sm:flex-row">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full min-w-[200px] bg-[#619154] px-8 py-3 text-white transition-colors duration-200 hover:bg-[#4F7A43] disabled:opacity-50 sm:w-auto"
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center">
                                                <svg
                                                    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Registering...
                                            </span>
                                        ) : (
                                            'Register Farmer & Farm'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
