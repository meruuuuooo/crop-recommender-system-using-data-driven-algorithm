import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Swal from 'sweetalert2';
import { route } from 'ziggy-js';

type CreateCropProps = {
    categories: {
        id: number | string;
        name: string;
        description?: string;
    }[];
};


export default function CreateCropForm({ categories }: CreateCropProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        crop_season: '',
        soil_type: '',
        time_of_planting: '',
        plant_population_per_hectare: '',
        maturity: '',
        volume_of_production: '',
        distance_of_planting_hills: '',
        distance_of_planting_rows: '',
        yield_per_hectare: '',
        category_id: '',
    });


    const seasonOptions = [
        { value: 'wet', label: 'Wet Season' },
        { value: 'dry', label: 'Dry Season' },
        { value: 'all', label: 'All Seasons' },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('management.crop.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                console.log('Crop created successfully');
                reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Crop has been created successfully.',
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
                    text: 'There was an error creating the crop. Please check the form and try again.',
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
                aria-label="Create new crop registration form"
            >
                {/* Crop Information Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6" role="region" aria-labelledby="crop-info-heading">
                    <h3 id="crop-info-heading" className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                        Crop Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cropname" className="text-sm font-medium text-gray-700">
                                Crop Name <span className="text-red-500" aria-label="required">*</span>
                            </Label>
                            <Input
                                id="cropname"
                                name="name"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Enter crop name (e.g., Rice, Corn, Tomato)"
                                aria-describedby={errors.name ? "crop-name-error" : "crop-name-help"}
                                aria-invalid={errors.name ? "true" : "false"}
                            />
                            <div id="crop-name-help" className="text-xs text-gray-500">
                                Enter the common name of the crop
                            </div>
                            <InputError message={errors.name} id="crop-name-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="season" className="text-sm font-medium text-gray-700">
                                Growing Season <span className="text-red-500" aria-label="required">*</span>
                            </Label>
                            <SearchableSelect
                                options={seasonOptions}
                                value={data.crop_season}
                                onValueChange={(value) => setData('crop_season', value)}
                                placeholder="Select Growing Season"
                                searchPlaceholder="Search seasons..."
                                clearable
                                aria-describedby={errors.crop_season ? "season-error" : "season-help"}
                                aria-invalid={errors.crop_season ? "true" : "false"}
                            />
                            <div id="season-help" className="text-xs text-gray-500">
                                Choose when this crop is typically grown
                            </div>
                            <InputError message={errors.crop_season} id="season-error" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="soil_type" className="text-sm font-medium text-gray-700">
                                Soil Type <span className="text-gray-500 text-xs">(Optional)</span>
                            </Label>
                            <Input
                                id="soil_type"
                                name="soil_type"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                value={data.soil_type}
                                onChange={(e) => setData('soil_type', e.target.value)}
                                autoComplete="off"
                                placeholder="Enter preferred soil type (e.g., Clay, Loam, Sandy)"
                                aria-describedby={errors.soil_type ? "soil-type-error" : "soil-type-help"}
                                aria-invalid={errors.soil_type ? "true" : "false"}
                            />
                            <div id="soil-type-help" className="text-xs text-gray-500">
                                Enter the preferred soil type for this crop
                            </div>
                            <InputError message={errors.soil_type} id="soil-type-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time_of_planting" className="text-sm font-medium text-gray-700">
                                Time of Planting <span className="text-red-500" aria-label="required">*</span>
                            </Label>
                            <Input
                                id="time_of_planting"
                                name="time_of_planting"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                value={data.time_of_planting}
                                onChange={(e) => setData('time_of_planting', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Enter planting time (e.g., May-June, Early rainy season)"
                                aria-describedby={errors.time_of_planting ? "planting-time-error" : "planting-time-help"}
                                aria-invalid={errors.time_of_planting ? "true" : "false"}
                            />
                            <div id="planting-time-help" className="text-xs text-gray-500">
                                Enter the best time to plant this crop
                            </div>
                            <InputError message={errors.time_of_planting} id="planting-time-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maturity" className="text-sm font-medium text-gray-700">
                                Maturity Period <span className="text-red-500" aria-label="required">*</span>
                            </Label>
                            <Input
                                id="maturity"
                                name="maturity"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                value={data.maturity}
                                onChange={(e) => setData('maturity', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Enter maturity period (e.g., 90-120 days, 3-4 months)"
                                aria-describedby={errors.maturity ? "maturity-error" : "maturity-help"}
                                aria-invalid={errors.maturity ? "true" : "false"}
                            />
                            <div id="maturity-help" className="text-xs text-gray-500">
                                Enter how long it takes for the crop to mature
                            </div>
                            <InputError message={errors.maturity} id="maturity-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="yield_per_hectare" className="text-sm font-medium text-gray-700">
                                Yield per Hectare <span className="text-red-500" aria-label="required">*</span>
                            </Label>
                            <Input
                                id="yield_per_hectare"
                                name="yield_per_hectare"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                value={data.yield_per_hectare}
                                onChange={(e) => setData('yield_per_hectare', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Enter expected yield (e.g., 4-6 tons/ha, 25-30 sacks/ha)"
                                aria-describedby={errors.yield_per_hectare ? "yield-error" : "yield-help"}
                                aria-invalid={errors.yield_per_hectare ? "true" : "false"}
                            />
                            <div id="yield-help" className="text-xs text-gray-500">
                                Enter the expected yield per hectare
                            </div>
                            <InputError message={errors.yield_per_hectare} id="yield-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="plant_population_per_hectare" className="text-sm font-medium text-gray-700">
                                Plant Population per Hectare <span className="text-gray-500 text-xs">(Optional)</span>
                            </Label>
                            <Input
                                id="plant_population_per_hectare"
                                name="plant_population_per_hectare"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                value={data.plant_population_per_hectare}
                                onChange={(e) => setData('plant_population_per_hectare', e.target.value)}
                                autoComplete="off"
                                placeholder="Enter plant population (e.g., 25,000 plants/ha, 150,000 seeds/ha)"
                                aria-describedby={errors.plant_population_per_hectare ? "population-error" : "population-help"}
                                aria-invalid={errors.plant_population_per_hectare ? "true" : "false"}
                            />
                            <div id="population-help" className="text-xs text-gray-500">
                                Enter the recommended number of plants per hectare
                            </div>
                            <InputError message={errors.plant_population_per_hectare} id="population-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="volume_of_production" className="text-sm font-medium text-gray-700">
                                Volume of Production <span className="text-gray-500 text-xs">(Optional)</span>
                            </Label>
                            <Input
                                id="volume_of_production"
                                name="volume_of_production"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                value={data.volume_of_production}
                                onChange={(e) => setData('volume_of_production', e.target.value)}
                                autoComplete="off"
                                placeholder="Enter production volume (e.g., 500 kg/harvest, 20 sacks/harvest)"
                                aria-describedby={errors.volume_of_production ? "volume-error" : "volume-help"}
                                aria-invalid={errors.volume_of_production ? "true" : "false"}
                            />
                            <div id="volume-help" className="text-xs text-gray-500">
                                Enter the typical volume of production per harvest
                            </div>
                            <InputError message={errors.volume_of_production} id="volume-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="distance_of_planting_hills" className="text-sm font-medium text-gray-700">
                                Distance Between Hills <span className="text-gray-500 text-xs">(Optional)</span>
                            </Label>
                            <Input
                                id="distance_of_planting_hills"
                                name="distance_of_planting_hills"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                value={data.distance_of_planting_hills}
                                onChange={(e) => setData('distance_of_planting_hills', e.target.value)}
                                autoComplete="off"
                                placeholder="Enter distance between hills (e.g., 20 cm, 15-20 cm)"
                                aria-describedby={errors.distance_of_planting_hills ? "hills-distance-error" : "hills-distance-help"}
                                aria-invalid={errors.distance_of_planting_hills ? "true" : "false"}
                            />
                            <div id="hills-distance-help" className="text-xs text-gray-500">
                                Enter the recommended spacing between individual plants or hills
                            </div>
                            <InputError message={errors.distance_of_planting_hills} id="hills-distance-error" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="distance_of_planting_rows" className="text-sm font-medium text-gray-700">
                                Distance Between Rows <span className="text-gray-500 text-xs">(Optional)</span>
                            </Label>
                            <Input
                                id="distance_of_planting_rows"
                                name="distance_of_planting_rows"
                                className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                value={data.distance_of_planting_rows}
                                onChange={(e) => setData('distance_of_planting_rows', e.target.value)}
                                autoComplete="off"
                                placeholder="Enter distance between rows (e.g., 25 cm, 20-30 cm)"
                                aria-describedby={errors.distance_of_planting_rows ? "rows-distance-error" : "rows-distance-help"}
                                aria-invalid={errors.distance_of_planting_rows ? "true" : "false"}
                            />
                            <div id="rows-distance-help" className="text-xs text-gray-500">
                                Enter the recommended spacing between planting rows
                            </div>
                            <InputError message={errors.distance_of_planting_rows} id="rows-distance-error" />
                        </div>
                    </div>
                </div>

                {/* Category Assignment Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6" role="region" aria-labelledby="category-assignment-heading">
                    <h3 id="category-assignment-heading" className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                        Category Assignment
                    </h3>
                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                            Crop Category <span className="text-gray-500 text-xs">(Optional)</span>
                        </Label>
                        <SearchableSelect
                            options={categories.map((category) => ({
                                value: String(category.id),
                                label: category.name,
                                description: category.description,
                            }))}
                            value={data.category_id}
                            onValueChange={(value) => setData('category_id', value)}
                            placeholder="Select Crop Category"
                            searchPlaceholder="Search categories..."
                            clearable
                            aria-describedby={errors.category_id ? "category-error" : "category-help"}
                            aria-invalid={errors.category_id ? "true" : "false"}
                        />
                        <div id="category-help" className="text-xs text-gray-500">
                            Choose a category to help classify this crop (e.g., Cereals, Vegetables, Fruits)
                        </div>
                        <InputError message={errors.category_id} id="category-error" />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end items-center pt-4">
                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto min-w-[120px] bg-[#619154] text-white hover:bg-[#4F7A43] disabled:opacity-50 transition-colors duration-200 px-8 py-2"
                            aria-describedby="submit-help"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center" role="status" aria-live="polite">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="sr-only">Creating crop, please wait</span>
                                    Creating Crop...
                                </span>
                            ) : (
                                'Create Crop'
                            )}
                        </Button>
                        <div id="submit-help" className="sr-only">
                            Submit the form to create a new crop record
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
