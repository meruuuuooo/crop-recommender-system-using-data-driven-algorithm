import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import type { EditCropProps } from '@/types/crop';
import { useForm } from '@inertiajs/react';
import { ChangeEvent, FormEventHandler } from 'react';
import Swal from 'sweetalert2';

export default function EditCropForm({ crop, categories }: EditCropProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: crop?.name || '',
        season: crop?.season || '',
        description: crop?.description || '',
        varieties: crop?.varieties || '',
        category_id: crop?.category_id?.toString() || crop?.category?.id?.toString() || '',
    });

    const seasonOptions = [
        { value: 'wet', label: 'Wet Season' },
        { value: 'dry', label: 'Dry Season' },
        { value: 'all', label: 'All Seasons' },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('management.crop.update', crop), {
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
                            <Label htmlFor="season" className="text-sm font-medium text-gray-700">
                                Growing Season{' '}
                                <span className="text-red-500" aria-label="required">
                                    *
                                </span>
                            </Label>
                            <SearchableSelect
                                options={seasonOptions}
                                value={data.season}
                                onValueChange={(value) => setData('season', value)}
                                placeholder="Select Growing Season"
                                searchPlaceholder="Search seasons..."
                                clearable
                                aria-describedby={errors.season ? 'season-error' : 'season-help'}
                                aria-invalid={errors.season ? 'true' : 'false'}
                            />
                            <div id="season-help" className="text-xs text-gray-500">
                                Update when this crop is typically grown
                            </div>
                            <InputError message={errors.season} id="season-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cropvariety" className="text-sm font-medium text-gray-700">
                                Crop Variety{' '}
                                <span className="text-red-500" aria-label="required">
                                    *
                                </span>
                            </Label>
                            <Input
                                id="cropvariety"
                                name="variety"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.varieties}
                                onChange={(e) => setData('varieties', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Enter crop variety (e.g., Basmati, Sweet Corn, Cherry Tomato)"
                                aria-describedby={errors.varieties ? 'crop-varieties-error' : 'crop-varieties-help'}
                                aria-invalid={errors.varieties ? 'true' : 'false'}
                            />
                            <div id="crop-varieties-help" className="text-xs text-gray-500">
                                Enter the specific variety of the crop
                            </div>
                            <InputError message={errors.varieties} id="crop-varieties-error" />
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

                {/* Crop Description Section */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6" role="region" aria-labelledby="description-heading">
                    <h3 id="description-heading" className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                        Crop Description
                    </h3>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                            Description <span className="text-xs text-gray-500">(Optional)</span>
                        </Label>
                        <textarea
                            id="description"
                            name="description"
                            className="min-h-[100px] w-full resize-y rounded-md border border-[#D6E3D4] px-3 py-2 text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                            value={data.description}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                            placeholder="Enter a detailed description of the crop, its characteristics, growing conditions, etc."
                            aria-describedby={errors.description ? 'description-error' : 'description-help'}
                            aria-invalid={errors.description ? 'true' : 'false'}
                            maxLength={1000}
                        />
                        <div id="description-help" className="text-xs text-gray-500">
                            Update additional information about the crop (max 1000 characters)
                        </div>
                        <InputError message={errors.description} id="description-error" />
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
