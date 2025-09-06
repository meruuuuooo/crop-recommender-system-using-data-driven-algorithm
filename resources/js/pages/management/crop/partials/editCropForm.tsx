import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import type { EditCropProps } from '@/types/crop';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Swal from 'sweetalert2';

export default function EditCropForm({ crop, categories }: EditCropProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: crop?.name || '',
        soil_type: crop?.soil_type || '',
        time_of_planting: crop?.time_of_planting || '',
        maturity: crop?.maturity || '',
        category_id: crop?.category_id?.toString() || crop?.category?.id?.toString() || '',
    });


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('management.crop.update', crop.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                console.log('Crop updated successfully');
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Crop has been updated successfully.',
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
                    text: 'There was an error updating the crop. Please check the form and try again.',
                    confirmButtonColor: '#dc2626',
                });
            },
        });
    };

    return (
        <div className="w-full sm:p-4 lg:p-6" role="main">
            <form onSubmit={submit} className="space-y-4" noValidate aria-label="Edit crop information form">
                {/* Crop Information Section */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6" role="region" aria-labelledby="crop-info-heading">
                    <h3 id="crop-info-heading" className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                        Crop Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="cropName" className="text-sm font-medium text-gray-700">
                                Crop Name{' '}
                                <span className="text-red-500" aria-label="required">
                                    *
                                </span>
                            </Label>
                            <Input
                                id="cropName"
                                name="name"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Enter crop name (e.g., Rice, Corn, Tomato)"
                                aria-describedby={errors.name ? 'crop-name-error' : 'crop-name-help'}
                                aria-invalid={errors.name ? 'true' : 'false'}
                            />
                            <div id="crop-name-help" className="text-xs text-gray-500">
                                Update the crop's name
                            </div>
                            <InputError message={errors.name} id="crop-name-error" />
                        </div>



                        <div className="space-y-2">
                            <Label htmlFor="soil_type" className="text-sm font-medium text-gray-700">
                                Soil Type <span className="text-xs text-gray-500">(Optional)</span>
                            </Label>
                            <Input
                                id="soil_type"
                                name="soil_type"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.soil_type}
                                onChange={(e) => setData('soil_type', e.target.value)}
                                autoComplete="off"
                                placeholder="Enter preferred soil type (e.g., Clay, Loam, Sandy)"
                                aria-describedby={errors.soil_type ? 'soil-type-error' : 'soil-type-help'}
                                aria-invalid={errors.soil_type ? 'true' : 'false'}
                            />
                            <div id="soil-type-help" className="text-xs text-gray-500">
                                Enter the preferred soil type for this crop
                            </div>
                            <InputError message={errors.soil_type} id="soil-type-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time_of_planting" className="text-sm font-medium text-gray-700">
                                Time of Planting{' '}
                                <span className="text-red-500" aria-label="required">
                                    *
                                </span>
                            </Label>
                            <Input
                                id="time_of_planting"
                                name="time_of_planting"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.time_of_planting}
                                onChange={(e) => setData('time_of_planting', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Enter planting time (e.g., May-June)"
                                aria-describedby={errors.time_of_planting ? 'planting-time-error' : 'planting-time-help'}
                                aria-invalid={errors.time_of_planting ? 'true' : 'false'}
                            />
                            <div id="planting-time-help" className="text-xs text-gray-500">
                                Enter the best time to plant this crop
                            </div>
                            <InputError message={errors.time_of_planting} id="planting-time-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maturity" className="text-sm font-medium text-gray-700">
                                Maturity Period{' '}
                                <span className="text-red-500" aria-label="required">
                                    *
                                </span>
                            </Label>
                            <Input
                                id="maturity"
                                name="maturity"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.maturity}
                                onChange={(e) => setData('maturity', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Enter maturity period (e.g., 90-120 days, 3-4 months)"
                                aria-describedby={errors.maturity ? 'maturity-error' : 'maturity-help'}
                                aria-invalid={errors.maturity ? 'true' : 'false'}
                            />
                            <div id="maturity-help" className="text-xs text-gray-500">
                                Enter how long it takes for the crop to mature
                            </div>
                            <InputError message={errors.maturity} id="maturity-error" />
                        </div>

                    </div>
                </div>

                {/* Category Assignment Section */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6" role="region" aria-labelledby="category-assignment-heading">
                    <h3 id="category-assignment-heading" className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                        Category Assignment
                    </h3>
                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                            Crop Category <span className="text-xs text-gray-500">(Optional)</span>
                        </Label>
                        <SearchableSelect
                            options={(categories || []).map((category) => ({
                                value: String(category.id),
                                label: category.name,
                                description: category.description,
                            }))}
                            value={data.category_id}
                            onValueChange={(value) => setData('category_id', value)}
                            placeholder="Select Crop Category"
                            searchPlaceholder="Search categories..."
                            clearable
                            aria-describedby={errors.category_id ? 'category-error' : 'category-help'}
                            aria-invalid={errors.category_id ? 'true' : 'false'}
                        />
                        <div id="category-help" className="text-xs text-gray-500">
                            Update the category to help classify this crop
                        </div>
                        <InputError message={errors.category_id} id="category-error" />
                    </div>
                </div>

                {/* Submit Button */}
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
                                    <span className="sr-only">Updating crop information, please wait</span>
                                    Updating Crop...
                                </span>
                            ) : (
                                'Update Crop'
                            )}
                        </Button>
                        <div id="submit-help" className="sr-only">
                            Save changes to the crop information
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
