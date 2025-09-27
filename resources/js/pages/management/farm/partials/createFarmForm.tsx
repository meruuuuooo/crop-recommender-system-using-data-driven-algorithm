import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CreateFarmProps } from '@/types/farm';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Swal from 'sweetalert2';
import { route } from 'ziggy-js';

export default function CreateFarmForm({ farmers, provinces, municipalities, barangays, crops }: CreateFarmProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        total_area: '',
        cropping_system: '',
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

    const croppingSystems = [
        { Moiocropping: 'Moiocropping' },
        { 'Mixed Cropping': 'Mixed Cropping' },
        { 'Inter Cropping': 'Inter Cropping' },
        { 'Crop Rotation': 'Crop Rotation' },
        { 'Relay Cropping': 'Relay Cropping' },
        { 'Sequential Cropping': 'Sequential Cropping' },
        { 'Alley Cropping': 'Alley Cropping' },
        { 'Strip Cropping': 'Strip Cropping' },
    ];

    return (
        <div className="w-full sm:p-4 lg:p-6" role="main">
            <form onSubmit={submit} className="space-y-4" noValidate aria-label="Create new farm registration form">
                {/* Farm Information Section */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6" role="region" aria-labelledby="farm-info-heading">
                    <h3 id="farm-info-heading" className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                        Farm Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
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
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Enter farm name"
                                aria-describedby={errors.name ? 'farm-name-error' : 'farm-name-help'}
                                aria-invalid={errors.name ? 'true' : 'false'}
                            />
                            <div id="farm-name-help" className="text-xs text-gray-500">
                                Enter a descriptive name for the farm
                            </div>
                            <InputError message={errors.name} id="farm-name-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="totalarea" className="text-sm font-medium text-gray-700">
                                Total Area (hectares) <span className="text-xs text-gray-500"> (Optional)</span>
                            </Label>
                            <Input
                                id="totalarea"
                                name="total_area"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.total_area}
                                onChange={(e) => setData('total_area', e.target.value)}
                                autoComplete="off"
                                placeholder="0.00"
                                type="number"
                                aria-describedby={errors.total_area ? 'total-area-error' : 'total-area-help'}
                                aria-invalid={errors.total_area ? 'true' : 'false'}
                            />
                            <div id="total-area-help" className="text-xs text-gray-500">
                                Enter area in hectares (0.01 - 1000)
                            </div>
                            <InputError message={errors.total_area} id="total-area-error" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cropping_system" className="text-sm font-medium text-gray-700">
                                Cropping System{' '}
                                <span className="text-red-500" aria-label="required">
                                    *
                                </span>
                            </Label>
                            <Select
                                onValueChange={(value) => {
                                    setData('cropping_system', value);
                                    // If switching to Monocropping and multiple crops are selected, clear them
                                    if (value === 'Moiocropping' && data.prev_crops && data.prev_crops.includes(', ')) {
                                        setData('prev_crops', '');
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
                                    <SelectValue placeholder="Select Cropping System" />
                                </SelectTrigger>
                                <SelectContent>
                                    {croppingSystems.map((system) => {
                                        const key = Object.keys(system)[0];
                                        return (
                                            <SelectItem key={key} value={key}>
                                                {system[key as keyof typeof system]}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                            <div id="cropping-system-help" className="text-xs text-gray-500">
                                Choose the cropping system used on the farm
                            </div>
                            <InputError message={errors.cropping_system} id="cropping-system-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prevcrops" className="text-sm font-medium text-gray-700">
                                Previous Crops <span className="text-xs text-gray-500">(Optional)</span>
                            </Label>
                            <div className="relative">
                                <Select
                                    onValueChange={(value) => {
                                        if (value) {
                                            // If Monocropping is selected, only allow one crop
                                            if (data.cropping_system === 'Moiocropping') {
                                                setData('prev_crops', value);
                                            } else {
                                                // For other cropping systems, allow multiple crops
                                                const currentCrops = data.prev_crops ? data.prev_crops.split(', ') : [];
                                                if (!currentCrops.includes(value)) {
                                                    const newCrops = [...currentCrops, value].join(', ');
                                                    setData('prev_crops', newCrops);
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
                                        <SelectValue
                                            placeholder={
                                                data.cropping_system === 'Moiocropping' ? 'Select one previous crop' : 'Select previous crops'
                                            }
                                        >
                                            {data.prev_crops ||
                                                (data.cropping_system === 'Moiocropping' ? 'Select one previous crop' : 'Select previous crops')}
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
                                {data.cropping_system === 'Moiocropping'
                                    ? 'Select one crop that was previously grown on this farm.'
                                    : 'Select crops that were previously grown on this farm. You can select multiple crops.'}
                            </div>
                            <InputError message={errors.prev_crops} id="prev-crops-error" />
                        </div>
                    </div>
                </div>

                {/* Farmer Assignment Section */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6" role="region" aria-labelledby="farmer-assignment-heading">
                    <h3 id="farmer-assignment-heading" className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                        Farmer Assignment
                    </h3>
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
                            aria-describedby={errors.farmer_id ? 'farmer-error' : 'farmer-help'}
                            aria-invalid={errors.farmer_id ? 'true' : 'false'}
                        />
                        <div id="farmer-help" className="text-xs text-gray-500">
                            Choose the farmer who will manage this farm
                        </div>
                        <InputError message={errors.farmer_id} id="farmer-error" />
                    </div>
                </div>

                {/* Location Information Section */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6" role="region" aria-labelledby="location-info-heading">
                    <h3 id="location-info-heading" className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                        Farm Location
                    </h3>
                    <div className="space-y-4">
                        <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <legend className="sr-only">Farm Location Selection</legend>
                            <div className="space-y-2">
                                <Label htmlFor="province" className="text-sm font-medium text-gray-700">
                                    Province{' '}
                                    <span className="text-red-500" aria-label="required">
                                        *
                                    </span>
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
                                    aria-describedby={errors.province_id ? 'province-error' : 'province-help'}
                                    aria-invalid={errors.province_id ? 'true' : 'false'}
                                />
                                <div id="province-help" className="text-xs text-gray-500">
                                    Choose the province where the farm is located
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
                                    placeholder={!data.province_id ? 'Select Province first' : 'Select Municipality'}
                                    searchPlaceholder="Search municipalities..."
                                    disabled={!data.province_id}
                                    clearable
                                    aria-describedby={errors.municipality_id ? 'municipality-error' : 'municipality-help'}
                                    aria-invalid={errors.municipality_id ? 'true' : 'false'}
                                />
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
                                <SearchableSelect
                                    options={filteredBarangays.map((barangay) => ({
                                        value: String(barangay.id),
                                        label: barangay.name,
                                    }))}
                                    value={data.barangay_id}
                                    onValueChange={(value) => setData('barangay_id', value)}
                                    placeholder={!data.municipality_id ? 'Select Municipality first' : 'Select Barangay'}
                                    searchPlaceholder="Search barangays..."
                                    disabled={!data.municipality_id}
                                    clearable
                                    aria-describedby={errors.barangay_id ? 'barangay-error' : 'barangay-help'}
                                    aria-invalid={errors.barangay_id ? 'true' : 'false'}
                                />
                                <div id="barangay-help" className="text-xs text-gray-500">
                                    {!data.municipality_id
                                        ? 'Municipality must be selected first'
                                        : 'Choose the barangay within the selected municipality'}
                                </div>
                                <InputError message={errors.barangay_id} id="barangay-error" />
                            </div>
                        </fieldset>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col items-center justify-end gap-4 pt-4 sm:flex-row">
                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={
                                processing ||
                                !data.name ||
                                !data.cropping_system ||
                                !data.farmer_id ||
                                !data.province_id ||
                                !data.municipality_id ||
                                !data.barangay_id
                            }
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
