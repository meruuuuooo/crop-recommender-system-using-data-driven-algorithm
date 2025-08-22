import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type CreateFarmerProps } from '@/types/farmer';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Swal from 'sweetalert2';

export default function CreateFarmerForm({ provinces, municipalities, barangays }: CreateFarmerProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        firstname: '',
        middlename: '',
        lastname: '',
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
        <div className="w-full sm:p-4 lg:p-6" role="main">
            <form onSubmit={submit} className="space-y-4" noValidate aria-label="Create new farmer registration form">
                <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6" role="region" aria-labelledby="personal-info-heading">
                    <h3 id="personal-info-heading" className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                                First Name{' '}
                                <span className="text-red-500" aria-label="required">
                                    *
                                </span>
                            </Label>
                            <Input
                                id="firstname"
                                name="first_name"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.firstname}
                                onChange={(e) => setData('firstname', e.target.value)}
                                required
                                autoComplete="given-name"
                                placeholder="Enter first name"
                                aria-describedby={errors.firstname ? 'firstname-error' : undefined}
                                aria-invalid={errors.firstname ? 'true' : 'false'}
                            />
                            <InputError message={errors.firstname} id="firstname-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="middlename" className="text-sm font-medium text-gray-700">
                                Middle Name <span className="text-xs text-gray-500">(Optional)</span>
                            </Label>
                            <Input
                                id="middlename"
                                name="middle_name"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.middlename}
                                onChange={(e) => setData('middlename', e.target.value)}
                                autoComplete="additional-name"
                                placeholder="Enter middle name"
                                aria-describedby={errors.middlename ? 'middlename-error' : undefined}
                                aria-invalid={errors.middlename ? 'true' : 'false'}
                            />
                            <InputError message={errors.middlename} id="middlename-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                                Last Name{' '}
                                <span className="text-red-500" aria-label="required">
                                    *
                                </span>
                            </Label>
                            <Input
                                id="lastname"
                                name="last_name"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.lastname}
                                onChange={(e) => setData('lastname', e.target.value)}
                                required
                                autoComplete="family-name"
                                placeholder="Enter last name"
                                aria-describedby={errors.lastname ? 'lastname-error' : undefined}
                                aria-invalid={errors.lastname ? 'true' : 'false'}
                            />
                            <InputError message={errors.lastname} id="lastname-error" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6" role="region" aria-labelledby="contact-experience-heading">
                    <h3 id="contact-experience-heading" className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                        Contact & Experience
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <div className="space-y-2 lg:col-span-2">
                            <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">
                                Contact Number{' '}
                                <span className="text-red-500" aria-label="required">
                                    *
                                </span>
                            </Label>
                            <Input
                                id="contactNumber"
                                name="contact_number"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.contact_number}
                                onChange={(e) => setData('contact_number', e.target.value)}
                                required
                                autoComplete="tel"
                                placeholder="Enter contact number (e.g., +63 912 345 6789)"
                                type="tel"
                                pattern="[+]?[0-9\s\-\(\)]+"
                                aria-describedby={errors.contact_number ? 'contact-number-error' : 'contact-number-help'}
                                aria-invalid={errors.contact_number ? 'true' : 'false'}
                            />
                            <div id="contact-number-help" className="text-xs text-gray-500">
                                Include country code and mobile number
                            </div>
                            <InputError message={errors.contact_number} id="contact-number-error" />
                        </div>

                        <div className="space-y-2 lg:col-span-1">
                            <Label htmlFor="farmingExperience" className="text-sm font-medium text-gray-700">
                                Farming Experience (Years){' '}
                                <span className="text-red-500" aria-label="required">
                                    *
                                </span>
                            </Label>
                            <Input
                                id="farmingExperience"
                                name="farming_experience"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.farming_experience}
                                onChange={(e) => setData('farming_experience', e.target.value)}
                                autoComplete="off"
                                placeholder="e.g., 5"
                                type="number"
                                min="0"
                                max="80"
                                step="1"
                                aria-describedby={errors.farming_experience ? 'farming-experience-error' : 'farming-experience-help'}
                                aria-invalid={errors.farming_experience ? 'true' : 'false'}
                            />
                            <div id="farming-experience-help" className="text-xs text-gray-500">
                                Years of farming experience (0-80)
                            </div>
                            <InputError message={errors.farming_experience} id="farming-experience-error" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6" role="region" aria-labelledby="address-info-heading">
                    <h3 id="address-info-heading" className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                        Address Information
                    </h3>
                    <div className="space-y-4">
                        {/* Province, Municipality, and Barangay */}
                        <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <legend className="sr-only">Location Selection</legend>
                            <div className="space-y-2">
                                <Label htmlFor="province" className="text-sm font-medium text-gray-700">
                                    Province{' '}
                                    <span className="text-red-500" aria-label="required">
                                        *
                                    </span>
                                </Label>
                                <Select
                                    onValueChange={(value) => {
                                        setData('province_id', value);
                                        setData('municipality_id', '');
                                        setData('barangay_id', '');
                                    }}
                                    required
                                >
                                    <SelectTrigger
                                        className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                        aria-describedby={errors.province_id ? 'province-error' : 'province-help'}
                                        aria-invalid={errors.province_id ? 'true' : 'false'}
                                    >
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
                                <div id="province-help" className="text-xs text-gray-500">
                                    Choose the province where the farmer is located
                                </div>
                                <InputError message={errors.province_id} id="province-error" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="municipality" className="text-sm font-medium text-gray-700">
                                    Municipality{' '}
                                    <span className="text-red-500" aria-label="required">
                                        *
                                    </span>
                                </Label>
                                <Select
                                    onValueChange={(value) => {
                                        setData('municipality_id', value);
                                        setData('barangay_id', '');
                                    }}
                                    disabled={!data.province_id}
                                    required
                                >
                                    <SelectTrigger
                                        className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154] disabled:cursor-not-allowed disabled:opacity-50"
                                        aria-describedby={errors.municipality_id ? 'municipality-error' : 'municipality-help'}
                                        aria-invalid={errors.municipality_id ? 'true' : 'false'}
                                    >
                                        <SelectValue placeholder={!data.province_id ? 'Select Province first' : 'Select Municipality'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredMunicipalities.map((municipality) => (
                                            <SelectItem key={municipality.id} value={String(municipality.id)}>
                                                {municipality.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div id="municipality-help" className="text-xs text-gray-500">
                                    {!data.province_id ? 'Province must be selected first' : 'Choose the municipality within the selected province'}
                                </div>
                                <InputError message={errors.municipality_id} id="municipality-error" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="barangay" className="text-sm font-medium text-gray-700">
                                    Barangay{' '}
                                    <span className="text-red-500" aria-label="required">
                                        *
                                    </span>
                                </Label>
                                <Select onValueChange={(value) => setData('barangay_id', value)} disabled={!data.municipality_id} required>
                                    <SelectTrigger
                                        className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154] disabled:cursor-not-allowed disabled:opacity-50"
                                        aria-describedby={errors.barangay_id ? 'barangay-error' : 'barangay-help'}
                                        aria-invalid={errors.barangay_id ? 'true' : 'false'}
                                    >
                                        <SelectValue placeholder={!data.municipality_id ? 'Select Municipality first' : 'Select Barangay'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredBarangays.map((barangay) => (
                                            <SelectItem key={barangay.id} value={String(barangay.id)}>
                                                {barangay.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div id="barangay-help" className="text-xs text-gray-500">
                                    {!data.municipality_id
                                        ? 'Municipality must be selected first'
                                        : 'Choose the barangay within the selected municipality'}
                                </div>
                                <InputError message={errors.barangay_id} id="barangay-error" />
                            </div>
                        </fieldset>

                        <div className="space-y-2">
                            <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                                Street Address/Zone{' '}
                                <span className="text-red-500" aria-label="required">
                                    *
                                </span>
                            </Label>
                            <Input
                                id="street"
                                name="street"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.street}
                                onChange={(e) => setData('street', e.target.value)}
                                required
                                autoComplete="street-address"
                                placeholder="Enter street address, zone, or landmark"
                                type="text"
                                aria-describedby={errors.street ? 'street-error' : 'street-help'}
                                aria-invalid={errors.street ? 'true' : 'false'}
                            />
                            <div id="street-help" className="text-xs text-gray-500">
                                Include house number, street name, zone, or nearby landmark
                            </div>
                            <InputError message={errors.street} id="street-error" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-end gap-4 pt-4 sm:flex-row">
                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full min-w-[120px] bg-[#619154] px-8 py-2 text-white transition-colors duration-200 hover:bg-[#4F7A43] disabled:opacity-50 sm:w-auto"
                            aria-describedby="submit-help"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center" role="status" aria-live="polite">
                                    <svg
                                        className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    <span className="sr-only">Submitting form, please wait</span>
                                    Saving...
                                </span>
                            ) : (
                                'Save Farmer'
                            )}
                        </Button>
                        <div id="submit-help" className="sr-only">
                            Submit the form to create a new farmer record
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
