import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Swal from 'sweetalert2';
import { route } from 'ziggy-js';
import type { CreateFarmProps } from '@/types/farm';

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
                    text: 'There was an error creating the farm. Please check the form and try again.',
                    confirmButtonColor: '#dc2626',
                });
            },
        });
    };

    return (
        <div className="w-full sm:p-4 lg:p-6" role="main">
            <form
                onSubmit={submit}
                className="space-y-4"
                noValidate
                aria-label="Create new farm registration form"
            >
                {/* Farm Information Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6" role="region" aria-labelledby="farm-info-heading">
                    <h3 id="farm-info-heading" className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                        Farm Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="farmname" className="text-sm font-medium text-gray-700">
                                Farm Name <span className="text-red-500" aria-label="required">*</span>
                            </Label>
                            <Input
                                id="farmname"
                                name="name"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Enter farm name"
                                aria-describedby={errors.name ? "farm-name-error" : "farm-name-help"}
                                aria-invalid={errors.name ? "true" : "false"}
                            />
                            <div id="farm-name-help" className="text-xs text-gray-500">
                                Enter a descriptive name for the farm
                            </div>
                            <InputError message={errors.name} id="farm-name-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="totalarea" className="text-sm font-medium text-gray-700">
                                Total Area (hectares) <span className="text-red-500" aria-label="required">*</span>
                            </Label>
                            <Input
                                id="totalarea"
                                name="total_area"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                value={data.total_area}
                                onChange={(e) => setData('total_area', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="0.00"
                                type="number"
                                step="0.01"
                                min="0.01"
                                max="1000"
                                aria-describedby={errors.total_area ? "total-area-error" : "total-area-help"}
                                aria-invalid={errors.total_area ? "true" : "false"}
                            />
                            <div id="total-area-help" className="text-xs text-gray-500">
                                Enter area in hectares (0.01 - 1000)
                            </div>
                            <InputError message={errors.total_area} id="total-area-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prevcrops" className="text-sm font-medium text-gray-700">
                                Previous Crops <span className="text-gray-500 text-xs">(Optional)</span>
                            </Label>
                            <Input
                                id="prevcrops"
                                name="prev_crops"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                value={data.prev_crops}
                                onChange={(e) => setData('prev_crops', e.target.value)}
                                autoComplete="off"
                                placeholder="e.g., Rice, Corn, Vegetables"
                                aria-describedby={errors.prev_crops ? "prev-crops-error" : "prev-crops-help"}
                                aria-invalid={errors.prev_crops ? "true" : "false"}
                            />
                            <div id="prev-crops-help" className="text-xs text-gray-500">
                                List crops previously grown on this farm
                            </div>
                            <InputError message={errors.prev_crops} id="prev-crops-error" />
                        </div>
                    </div>
                </div>

                {/* Farmer Assignment Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6" role="region" aria-labelledby="farmer-assignment-heading">
                    <h3 id="farmer-assignment-heading" className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                        Farmer Assignment
                    </h3>
                    <div className="space-y-2">
                        <Label htmlFor="farmer" className="text-sm font-medium text-gray-700">
                            Select Farmer <span className="text-red-500" aria-label="required">*</span>
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
                            aria-describedby={errors.farmer_id ? "farmer-error" : "farmer-help"}
                            aria-invalid={errors.farmer_id ? "true" : "false"}
                        />
                        <div id="farmer-help" className="text-xs text-gray-500">
                            Choose the farmer who will manage this farm
                        </div>
                        <InputError message={errors.farmer_id} id="farmer-error" />
                    </div>
                </div>

                {/* Location Information Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6" role="region" aria-labelledby="location-info-heading">
                    <h3 id="location-info-heading" className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                        Farm Location
                    </h3>
                    <div className="space-y-4">
                        <fieldset className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <legend className="sr-only">Farm Location Selection</legend>
                            <div className="space-y-2">
                                <Label htmlFor="province" className="text-sm font-medium text-gray-700">
                                    Province <span className="text-red-500" aria-label="required">*</span>
                                </Label>
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
                                    aria-describedby={errors.province_id ? "province-error" : "province-help"}
                                    aria-invalid={errors.province_id ? "true" : "false"}
                                />
                                <div id="province-help" className="text-xs text-gray-500">
                                    Choose the province where the farm is located
                                </div>
                                <InputError message={errors.province_id} id="province-error" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="municipality" className="text-sm font-medium text-gray-700">
                                    Municipality <span className="text-red-500" aria-label="required">*</span>
                                </Label>
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
                                    placeholder={!data.province_id ? "Select Province first" : "Select Municipality"}
                                    searchPlaceholder="Search municipalities..."
                                    disabled={!data.province_id}
                                    clearable
                                    aria-describedby={errors.municipality_id ? "municipality-error" : "municipality-help"}
                                    aria-invalid={errors.municipality_id ? "true" : "false"}
                                />
                                <div id="municipality-help" className="text-xs text-gray-500">
                                    {!data.province_id ? "Province must be selected first" : "Choose the municipality within the selected province"}
                                </div>
                                <InputError message={errors.municipality_id} id="municipality-error" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="barangay" className="text-sm font-medium text-gray-700">
                                    Barangay <span className="text-red-500" aria-label="required">*</span>
                                </Label>
                                <SearchableSelect
                                    options={filteredBarangays.map((barangay) => ({
                                        value: String(barangay.id),
                                        label: barangay.name,
                                    }))}
                                    value={data.barangay_id}
                                    onValueChange={(value) => setData('barangay_id', value)}
                                    placeholder={!data.municipality_id ? "Select Municipality first" : "Select Barangay"}
                                    searchPlaceholder="Search barangays..."
                                    disabled={!data.municipality_id}
                                    clearable
                                    aria-describedby={errors.barangay_id ? "barangay-error" : "barangay-help"}
                                    aria-invalid={errors.barangay_id ? "true" : "false"}
                                />
                                <div id="barangay-help" className="text-xs text-gray-500">
                                    {!data.municipality_id ? "Municipality must be selected first" : "Choose the barangay within the selected municipality"}
                                </div>
                                <InputError message={errors.barangay_id} id="barangay-error" />
                            </div>
                        </fieldset>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end items-center pt-4">
                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={
                                processing ||
                                !data.name ||
                                !data.total_area ||
                                Number(data.total_area) < 0.01 ||
                                Number(data.total_area) > 1000 ||
                                !data.farmer_id ||
                                !data.province_id ||
                                !data.municipality_id ||
                                !data.barangay_id
                            }
                            className="w-full sm:w-auto min-w-[120px] bg-[#619154] text-white hover:bg-[#4F7A43] disabled:opacity-50 transition-colors duration-200 px-8 py-2"
                            aria-describedby="submit-help"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center" role="status" aria-live="polite">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="sr-only">Creating farm, please wait</span>
                                    Creating Farm...
                                </span>
                            ) : (
                                'Create Farm'
                            )}
                        </Button>
                        <div id="submit-help" className="sr-only">
                            Submit the form to create a new farm record
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
