<?php

namespace App\Http\Controllers;

use App\Http\Requests\CropRecommendationRequest;
use App\Http\Requests\FertilizerRecommendationRequest;
use App\Models\Category;
use App\Models\Climate;
use App\Models\Crop;
use App\Models\CropFertilizer;
use App\Models\Farmer;
use App\Models\Fertilizer;
use App\Models\Location;
use App\Models\Pesticide;
use App\Models\Recommendation;
use App\Models\Soil;
use App\Services\CropRecommenderService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Farm;

class RecommendationController extends Controller
{
    protected $cropRecommender;

    public function __construct(CropRecommenderService $cropRecommender)
    {
        $this->cropRecommender = $cropRecommender;
    }

    public function crop(Request $request)
    {
        $farmers = Farmer::with('farms.soils')->orderByDesc('id')->get();

        // dd($farmers);

        $recent_recommendations = Recommendation::with('farmer', 'crop', 'farm')->latest()->take(5)->get();

        return Inertia::render('recommendation/crop', [
            'farmers' => $farmers,
            'recent_recommendations' => $recent_recommendations,
            'recommendationResult' => [],
        ]);
    }

    public function downloadRecommendationPdf($recommendation): mixed
    {
        try {
            $reco = Recommendation::where('id', $recommendation)
                ->with([
                    'farmer.location.province',
                    'farmer.location.municipality',
                    'farmer.location.barangay',
                    'crop.category',
                    'farm.location.province',
                    'farm.location.municipality',
                    'farm.location.barangay',
                    'soil',
                    'climate',
                ])
                ->first();

            if (! $reco) {
                return back()->withErrors(['pdf_error' => 'No recommendation found.'])->withStatus(404);
            }
            $soil = $reco->soil;
            $nitrogen = $this->mapSoilLevel($soil->nitrogen_level ?? '') ?: 'L';
            $phosphorus = $this->mapSoilLevel($soil->phosphorus_level ?? '') ?: 'L';
            $potassium = $this->mapSoilLevel($soil->potassium_level ?? '') ?: 'L';
            $reco_crop = $reco->crop->name;
            $fertilizer_recommendations = $this->getFertilizerRecommendations(
                $reco_crop,
                $nitrogen,
                $phosphorus,
                $potassium,
                $reco->soil->soil_type ?? null
            );
            $farmerName = trim($reco->farmer->firstname . ' ' . $reco->farmer->lastname);
            $pdf = Pdf::loadView('pdf.recommendation', [
                'recommendation' => $reco,
                'fertilizer_recommendations' => $fertilizer_recommendations,
            ])->setPaper('a4', 'portrait');
            $fileName = 'Crop_Recommendation_' . preg_replace('/\s+/', '_', $farmerName) . '_' . now()->format('Ymd_His') . '.pdf';
            return $pdf->download($fileName)->withHeaders([
                'Content-Type' => 'application/pdf',
            ])->setStatusCode(200);
        } catch (\Exception $e) {
            return back()->withErrors(['pdf_error' => 'An error occurred while generating the PDF. Please try again later.'])->withStatus(500);
        }
    }

    private function getCropNameVariations(string $cropName): array
    {
        // Create variations of crop names for better matching
        $variations = [
            strtoupper($cropName),
            strtolower($cropName),
            ucfirst(strtolower($cropName)),
            str_replace(' ', '/', $cropName),
            str_replace(' ', '', $cropName),
        ];

        // Add specific mappings based on common crop name differences
        $mappings = [
            'Amapalaya' => ['AMPALAYA', 'UPO', 'AMPALAYA/UPO'],
            'Bataw' => ['BATAO'],
            'Bean' => ['String beans', 'Saguic beans', 'Lima beans', 'Patani beans', 'Winged beans'],
            'Chayote' => ['CHAYOTE'],
            'Cucumber' => ['CUCUMBER'],
            'Parsnip' => ['PARSNIP'],
            'Patani' => ['PATANI', 'Lima (Patani) beans'],
        ];

        if (isset($mappings[$cropName])) {
            $variations = array_merge($variations, $mappings[$cropName]);
        }

        // Also check reverse mappings
        foreach ($mappings as $key => $values) {
            if (in_array($cropName, $values)) {
                $variations[] = $key;
                $variations = array_merge($variations, $values);
            }
        }

        return array_unique($variations);
    }

    private function getFertilizerRecommendations(
        string $cropName,
        string $nLevel,
        string $pLevel,
        string $kLevel,
        ?string $soilType = null,
        ?string $growthStage = null
    ): array {
        // Define soil type categories
        $lightSoils = ['Sandy loam', 'Loamy sand'];
        $mediumHeavySoils = ['Clay loam', 'Silty clay loam', 'Sandy clay loam'];
        $heavySoils = ['Clay', 'Silty clay'];

        // 🔹 Normalize crop name for case-insensitive matching
        $cropName = trim(strtolower($cropName));

        // 🔹 Find best matching crop name
        $cropRecord = CropFertilizer::whereRaw('LOWER(crop_name) = ?', [$cropName])->first();

        if (! $cropRecord) {
            // Try fuzzy / partial match
            $cropRecord = CropFertilizer::whereRaw('LOWER(crop_name) LIKE ?', ["%{$cropName}%"])->first();
        }

        if (! $cropRecord) {
            return [
                'nitrogen' => ['level' => $nLevel, 'crop_fertilizer' => []],
                'phosphorus' => ['level' => $pLevel, 'crop_fertilizer' => []],
                'potassium' => ['level' => $kLevel, 'crop_fertilizer' => []],
            ];
        }

        $finalCropName = $cropRecord->crop_name;

        // 🔹 Build main query
        $query = CropFertilizer::where('crop_name', $finalCropName);

        // 🔹 Apply soil type filter
        if ($soilType) {
            $query->where(function ($sub) use ($soilType, $lightSoils, $mediumHeavySoils, $heavySoils) {
                $sub->whereNull('soil_type')
                    ->orWhere('soil_type', 'N/A');

                // Map soil types
                if (in_array($soilType, $lightSoils)) {
                    $sub->orWhere('soil_type', 'LIGHT SOILS');
                } elseif (in_array($soilType, $mediumHeavySoils) || in_array($soilType, $heavySoils)) {
                    $sub->orWhere('soil_type', 'MED-HEAVY SOILS');
                } elseif (in_array(strtoupper($soilType), ['LIGHT SOILS', 'MED-HEAVY SOILS'])) {
                    $sub->orWhere('soil_type', strtoupper($soilType));
                }
            });
        }

        // 🔹 Apply growth stage filter
        if ($growthStage) {
            $query->where(function ($sub) use ($growthStage) {
                $sub->where('growth_stage', $growthStage)
                    ->orWhereNull('growth_stage')
                    ->orWhere('growth_stage', 'N/A');
            });
        }

        // 🔹 Retrieve fertilizers matching any of the NPK levels
        $fertilizers = $query
            ->where(function ($sub) use ($nLevel, $pLevel, $kLevel) {
                $sub->where('nitrogen_level', $nLevel)
                    ->orWhere('phosphorus_level', $pLevel)
                    ->orWhere('potassium_level', $kLevel);
            })
            ->get();

        // 🔹 Group by nutrient level
        $grouped = [
            'nitrogen' => [
                'level' => $nLevel,
                'crop_fertilizer' => $fertilizers
                    ->where('nitrogen_level', $nLevel)
                    ->map(fn($f) => [
                        'id' => $f->id,
                        'crop_name' => $f->crop_name,
                        'growth_stage' => $f->growth_stage,
                        'soil_type' => $f->soil_type,
                        'nitrogen_level' => $f->nitrogen_level,
                        'nitrogen_rate' => $f->nitrogen_rate,
                        'unit_of_measure' => $f->unit_of_measure,
                    ])->values()->toArray(),
            ],
            'phosphorus' => [
                'level' => $pLevel,
                'crop_fertilizer' => $fertilizers
                    ->where('phosphorus_level', $pLevel)
                    ->map(fn($f) => [
                        'id' => $f->id,
                        'crop_name' => $f->crop_name,
                        'growth_stage' => $f->growth_stage,
                        'soil_type' => $f->soil_type,
                        'phosphorus_level' => $f->phosphorus_level,
                        'phosphorus_rate' => $f->phosphorus_rate,
                        'unit_of_measure' => $f->unit_of_measure,
                    ])->values()->toArray(),
            ],
            'potassium' => [
                'level' => $kLevel,
                'crop_fertilizer' => $fertilizers
                    ->where('potassium_level', $kLevel)
                    ->map(fn($f) => [
                        'id' => $f->id,
                        'crop_name' => $f->crop_name,
                        'growth_stage' => $f->growth_stage,
                        'soil_type' => $f->soil_type,
                        'potassium_level' => $f->potassium_level,
                        'potassium_rate' => $f->potassium_rate,
                        'unit_of_measure' => $f->unit_of_measure,
                    ])->values()->toArray(),
            ],
        ];

        return $grouped;
    }


    private function mapSoilLevel($level)
    {
        switch (strtolower($level)) {
            case 'Low':
                return 'L';
            case 'Medium':
                return 'M';
            case 'High':
                return 'H';
            default:
                return 'L'; // Default to Low instead of null
        }
    }

    public function store(CropRecommendationRequest $request)
    {
        $validated = $request->validated();

        // 🔹 Get location info
        $getLocation = Location::where('id', Farm::where('id', $validated['farm_id'])->value('location_id'))->first();
        $provinceName = $getLocation?->province?->name ?? null;
        $municipalityName = $getLocation?->municipality?->name ?? null;

        // 🔹 Determine current season
        $month = now()->month;
        $wetMonths = [5, 6, 7, 8, 9, 10];
        $season = in_array($month, $wetMonths) ? 'wet' : 'dry';

        $farmSoilType = Farm::where('id', $validated['farm_id'])->value('soil_type');


        // 🔹 Build API input
        $apiInput = [
            'province' => $provinceName,
            'municipality' => $municipalityName,
            'temperature' => $validated['temperature'],
            'humidity' => $validated['humidity'],
            'rainfall' => $validated['rainfall'],
            'ph' => (float) $validated['ph_level'],
            'n_level' => $validated['nitrogen_level'],
            'p_level' => $validated['phosphorus_level'],
            'k_level' => $validated['potassium_level'],
            'season' => $season,
        ];

        try {
            $response = $this->cropRecommender->getCropRecommendation($apiInput);

            $recommendedCrops = [];

            // ✅ Check success and recommendations
            if (($response['success'] ?? false) && isset($response['recommendations'])) {

                // 🔹 Create soil record
                $soil = Soil::create([
                    'ph' => $response['soil_conditions']['ph'] ?? $validated['ph_level'],
                    'n_level' => $response['soil_conditions']['n_level'] ?? $apiInput['n_level'],
                    'p_level' => $response['soil_conditions']['p_level'] ?? $apiInput['p_level'],
                    'k_level' => $response['soil_conditions']['k_level'] ?? $apiInput['k_level'],
                    'farm_id' => $validated['farm_id'],
                    'test_date' => now(),
                ]);

                // 🔹 Create climate record
                $climate = Climate::create([
                    'farm_id' => $validated['farm_id'],
                    'temperature' => $response['climate_conditions']['temperature'] ?? $validated['temperature'],
                    'rainfall' => $response['climate_conditions']['rainfall'] ?? $validated['rainfall'],
                    'humidity' => $response['climate_conditions']['humidity'] ?? $validated['humidity'],
                    'season' => ucfirst($season),
                    'climate_record_date' => now(),
                ]);

                // 🔹 Iterate over API recommendations
                foreach ($response['recommendations'] as $rec) {
                    $cropName = $rec['Crop'] ?? null;
                    $suitabilityScore = $rec['Predicted_Suitability_Score'] ?? 0;
                    $suitabilityClass = $rec['Predicted_Suitability_Class'] ?? 'Unknown';
                    $avgYield = $rec['Avg_Yield'] ?? null;
                    $yieldTrend = $rec['Yield_Trend_Pct'] ?? null;

                    if (! $cropName) continue;

                    $crop = Crop::where('name', $cropName)->first();

                    if ($crop) {
                        // 🔹 Save recommendation
                        $reco = Recommendation::create([
                            'farmer_id' => $validated['farmer_id'],
                            'farm_id' => $validated['farm_id'],
                            'crop_id' => $crop->id,
                            'soil_id' => $soil->id,
                            'climate_id' => $climate->id,
                            'suitability_score' => $suitabilityScore,
                            'recommendation_date' => now(),
                        ]);

                        // 🔹 Get fertilizer advice
                        $fertilizer_recommendations = $this->getFertilizerRecommendations(
                            $crop->name,
                            $this->mapSoilLevel($apiInput['n_level']),
                            $this->mapSoilLevel($apiInput['p_level']),
                            $this->mapSoilLevel($apiInput['k_level']),
                            $farmSoilType
                        );

                        // 🔹 Add formatted result for frontend
                        $recommendedCrops[] = [
                            'recommendation_id' => $reco->id,
                            'farmer_id' => $validated['farmer_id'],
                            'crop_name' => $crop->name,
                            'suitability_class' => $suitabilityClass,
                            'avg_yield' => $avgYield,
                            'yield_trend' => $yieldTrend,
                            'fertilizer_recommendations' => $fertilizer_recommendations,
                            'suitability_score' => round($suitabilityScore, 2),
                        ];
                    }
                }
            }

            // dd($recommendedCrops);


            // ✅ Return data to Inertia view
            return Inertia::render('recommendation/crop', [
                'farmers' => Farmer::with('farms')->get(),
                'recent_recommendations' => Recommendation::with('farmer', 'crop', 'farm')->latest()->take(5)->get(),
                'recommendationResult' => $recommendedCrops,
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['api_error' => $e->getMessage()]);
        }
    }



    public function showCropRecommendation($recommendation)
    {
        try {
            // Get the recommendation with all necessary relationships
            $reco = Recommendation::where('id', $recommendation)
                ->with([
                    'farmer.location.province',
                    'farmer.location.municipality',
                    'farmer.location.barangay',
                    'crop.category',
                    'farm.location.province',
                    'farm.location.municipality',
                    'farm.location.barangay',
                    'soil',
                    'climate',
                ])
                ->first();

            if (! $reco) {
                return back()->withErrors(['pdf_error' => 'No recommendation found.']);
            }

            // Map soil levels to single-letter codes
            $soil = $reco->soil;
            $nitrogen = $this->mapSoilLevel($soil->nitrogen_level ?? '') ?: 'L';
            $phosphorus = $this->mapSoilLevel($soil->phosphorus_level ?? '') ?: 'L';
            $potassium = $this->mapSoilLevel($soil->potassium_level ?? '') ?: 'L';

            $reco_crop = $reco->crop->name;

            // Get detailed fertilizer recommendations
            $fertilizer_recommendations = $this->getFertilizerRecommendations(
                $reco_crop,
                $nitrogen,
                $phosphorus,
                $potassium,
                $reco->soil->soil_type ?? null
            );

            $pdf = Pdf::loadView('pdf.recommendation', [
                'recommendation' => $reco,
                'fertilizer_recommendations' => $fertilizer_recommendations,
            ])->setPaper('a4', 'portrait');

            return $pdf->stream();
        } catch (\Exception $e) {
            Log::error('PDF Generation Error: ' . $e->getMessage());

            return back()->withErrors(['pdf_error' => 'An error occurred while generating the PDF. Please try again later.']);
        }
    }

    public function fertilizer(Request $request)
    {
        $search = $request->get('search', '');
        $perPage = $request->get('per_page', 5);

        // Get fertilizer products for the table
        $query = Fertilizer::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'LIKE', "%{$search}%")
                    ->orWhere('company', 'LIKE', "%{$search}%")
                    ->orWhere('type_of_product', 'LIKE', "%{$search}%")
                    ->orWhere('target_crops', 'LIKE', "%{$search}%")
                    ->orWhere('registration_number', 'LIKE', "%{$search}%");
            });
        }

        $fertilizers = $query->paginate($perPage)->withQueryString();

        // Get available crops, growth stages, and soil types for filters
        $crops = CropFertilizer::select('crop_name')
            ->distinct()
            ->orderBy('crop_name')
            ->pluck('crop_name');

        $growthStages = CropFertilizer::select('growth_stage')
            ->distinct()
            ->whereNotNull('growth_stage')
            ->where('growth_stage', '!=', '')
            ->where('growth_stage', '!=', 'N/A')
            ->limit(20) // Limit to prevent timeout
            ->orderBy('growth_stage')
            ->pluck('growth_stage');

        $soilTypes = [
            'light' => 'Light Soils',
            'med-heavy' => 'Medium-Heavy Soils',
            'heavy' => 'Heavy Soils',
        ];

        // Get recommendations and filters from session (if redirected from POST) or from request parameters
        $fertilizerRecommendations = session('fertilizerRecommendations', null);
        $selectedFilters = [
            'crop_type' => $request->get('crop_type', session('selectedFilters.crop_type')),
            'growth_stage' => $request->get('growth_stage', session('selectedFilters.growth_stage')),
            'soil_type' => $request->get('soil_type', session('selectedFilters.soil_type')),
            'nitrogen_level' => $request->get('nitrogen_level', session('selectedFilters.nitrogen_level')),
            'phosphorus_level' => $request->get('phosphorus_level', session('selectedFilters.phosphorus_level')),
            'potassium_level' => $request->get('potassium_level', session('selectedFilters.potassium_level')),
        ];

        // If we have form data from request parameters and no session recommendations, generate them
        if (
            ! $fertilizerRecommendations &&
            $selectedFilters['crop_type'] &&
            $selectedFilters['nitrogen_level'] &&
            $selectedFilters['phosphorus_level'] &&
            $selectedFilters['potassium_level']
        ) {

            $nLevel = $this->mapNutrientLevel($selectedFilters['nitrogen_level']);
            $pLevel = $this->mapNutrientLevel($selectedFilters['phosphorus_level']);
            $kLevel = $this->mapNutrientLevel($selectedFilters['potassium_level']);

            $fertilizerRecommendations = $this->getFertilizerRecommendations(
                $selectedFilters['crop_type'],
                $nLevel,
                $pLevel,
                $kLevel,
                $selectedFilters['soil_type'],
                $selectedFilters['growth_stage']
            );
        }

        // Get crop-specific growth stages and soil types for dynamic filtering (optimized query)
        $cropSpecificData = [];

        // Get all crop fertilizer data in one query for efficiency
        $allCropData = CropFertilizer::select('crop_name', 'growth_stage', 'soil_type')
            ->whereIn('crop_name', $crops)
            ->get()
            ->groupBy('crop_name');

        foreach ($crops as $crop) {
            $cropData = $allCropData->get($crop, collect());

            $cropGrowthStages = $cropData
                ->pluck('growth_stage')
                ->filter(function ($stage) {
                    return ! is_null($stage) && $stage !== '' && $stage !== 'N/A';
                })
                ->unique()
                ->sort()
                ->values()
                ->toArray();

            $cropSoilTypes = $cropData
                ->pluck('soil_type')
                ->filter(function ($type) {
                    return ! is_null($type) && $type !== '' && $type !== 'N/A';
                })
                ->unique()
                ->sort()
                ->values()
                ->toArray();

            $cropSpecificData[$crop] = [
                'growth_stages' => $cropGrowthStages,
                'soil_types' => $cropSoilTypes,
            ];
        }

        return Inertia::render('recommendation/fertilizer', [
            'fertilizers' => $fertilizers,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
            'crops' => $crops,
            'growthStages' => $growthStages,
            'soilTypes' => $soilTypes,
            'cropSpecificData' => $cropSpecificData,
            'fertilizerRecommendations' => $fertilizerRecommendations,
            'selectedFilters' => $selectedFilters,
        ]);
    }

    public function generateFertilizerRecommendation(FertilizerRecommendationRequest $request)
    {

        $cropName = $request->get('crop_type', '');
        $nLevel = $this->mapNutrientLevel($request->get('nitrogen_level'));
        $pLevel = $this->mapNutrientLevel($request->get('phosphorus_level'));
        $kLevel = $this->mapNutrientLevel($request->get('potassium_level'));
        $soilType = $request->get('soil_type');
        $growthStage = $request->get('growth_stage');

        $fertilizerRecommendations = [];
        if (! empty($cropName)) {
            $fertilizerRecommendations = $this->getFertilizerRecommendations(
                $cropName,
                $nLevel,
                $pLevel,
                $kLevel,
                $soilType,
                $growthStage
            );
        }

        // Redirect back with the recommendations
        return redirect()->route('recommendation.fertilizer')->with([
            'fertilizerRecommendations' => $fertilizerRecommendations,
            'selectedFilters' => [
                'crop_type' => $request->get('crop_type'),
                'growth_stage' => $request->get('growth_stage'),
                'soil_type' => $request->get('soil_type'),
                'nitrogen_level' => $request->get('nitrogen_level'),
                'phosphorus_level' => $request->get('phosphorus_level'),
                'potassium_level' => $request->get('potassium_level'),
            ],
        ]);
    }

    public function showFertilizer(Request $request, $fertilizer)
    {
        $fertilizer = Fertilizer::findOrFail($fertilizer);

        return Inertia::render('recommendation/showFertilizer', [
            'fertilizer' => $fertilizer,
        ]);
    }

    public function pesticide(Request $request)
    {
        $search = $request->get('search', '');
        $cropSearch = $request->get('crop_search', '');
        $pestSearch = $request->get('pest_search', '');
        $weedSearch = $request->get('weed_search', '');
        $diseaseSearch = $request->get('disease_search', '');
        $toxicitySearch = $request->get('toxicity_search', '');
        $pesticideSearch = $request->get('pesticide_search', '');
        $perPage = $request->get('per_page', 5);

        $query = Pesticide::query();

        // General search
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'LIKE', "%{$search}%")
                    ->orWhere('active_ingredient', 'LIKE', "%{$search}%")
                    ->orWhere('registration_number', 'LIKE', "%{$search}%");
            });
        }

        // Specific field searches
        if ($cropSearch) {
            $query->where('crops', 'LIKE', "%{$cropSearch}%");
        }

        if ($pestSearch) {
            $query->where('pests', 'LIKE', "%{$pestSearch}%");
        }

        if ($weedSearch) {
            $query->where('weeds', 'LIKE', "%{$weedSearch}%");
        }

        if ($diseaseSearch) {
            $query->where('diseases', 'LIKE', "%{$diseaseSearch}%");
        }

        if ($toxicitySearch) {
            $query->where('toxicity_category', 'LIKE', "%{$toxicitySearch}%");
        }

        if ($pesticideSearch) {
            $query->where('uses', 'LIKE', "%{$pesticideSearch}%");
        }

        $pesticides = $query->paginate($perPage)->withQueryString();

        $unique_crops = [
            'Abaca',
            'Ampalaya',
            'Asparagus',
            'Avocado',
            'Banana',
            'Beans',
            'Bell pepper',
            'Bitter gourd',
            'Broccoli',
            'Cabbage',
            'Cacao',
            'Calamansi',
            'Cantaloupe',
            'Carrot',
            'Cassava',
            'Cauliflower',
            'Cavendish Banana',
            'Celery',
            'Chili',
            'Chinese Cabbage',
            'Chrysanthemum',
            'Citrus',
            'Cocoa',
            'Coconut',
            'Coconut oil',
            'Coffee',
            'Corn',
            'Cotton',
            'Cowpea',
            'Crucifers',
            'Cucumber',
            'Cucurbits',
            'Cutflower',
            'Durian',
            'Eggplant',
            'Fruit trees',
            'Garlic',
            'Ginger',
            'Grapes',
            'Green peas',
            'Lanzones',
            'Leeks',
            'Legumes',
            'Lettuce',
            'Mandarin',
            'Mango',
            'Melon',
            'Mungbean',
            'Mustard',
            'Nuts',
            'Okra',
            'Oil palm',
            'Onion',
            'Orange',
            'Orchids',
            'Ornamentals',
            'Palm oil',
            'Papaya',
            'Peanut',
            'Peas',
            'Pechay',
            'Pepper',
            'Perennial fruits',
            'Pineapple',
            'Pomelo',
            'Potato',
            'Ramie',
            'Rice',
            'Roses',
            'Rubber',
            'Rubber tree',
            'Shallots',
            'Sitao',
            'Snap Beans',
            'Sorghum',
            'Soybean',
            'Squash',
            'Stored grain',
            'Strawberry',
            'Stringbeans',
            'Sugarcane',
            'Sweet peas',
            'Sweet pepper',
            'Sweet potato',
            'Tobacco',
            'Tomato',
            'Turf',
            'Turf grass',
            'Vegetables',
            'Watermelon',
            'Wheat',
            'White potato',
            'Wongbok',
        ];

        $pests = [
            '28 spotted beetle',
            '28-spotted lady beetle',
            'Aphids',
            'Armyworm',
            'Black bug',
            'Cutworm',
            'Fall armyworm',
            'Fruitfly',
            'Green leafhopper',
            'Leaffolder',
            'Leafhoppers',
            'Mites',
            'Podborer',
            'Rice bug',
            'Rust-red grain beetle',
            'Soil insects',
            'Squash bug',
            'Thrips',
        ];

        $weeds = [
            'Bamyard grass',
            'Barnyard grass',
            'Bermuda grass',
            'Broadleaves',
            'Button weed',
            'Carabao grass',
            'Cogon',
            'Crabgrasses',
            'Crowfoot grass',
            'Fern',
            'Goosegrass',
            'Grasses',
            'Itchgrass',
            'Nutsedge',
            'Paragrass',
            'Sedges',
            'Weeds',
        ];

        $diseases = [
            'Alternaria leaf spot',
            'Anthracnose',
            'Bacterial blight',
            'Bacterial canker',
            'Bacterial heart rot',
            'Bacterial leaf blight',
            'Bacterial leaf streak',
            'Bacterial spot',
            'Bacterial wilt',
            'Banded leaf and sheath blight',
            'Basal rot',
            'Bean rust',
            'Berry disease',
            'Black leaf streak',
            'Black rot',
            'Black sigatoka',
            'Black spot',
            'Black stripe',
            'Blast sheath blight',
            'Blight',
            'Botrytis leaf blight',
            'Botrytis rot',
            'Brown bark rot',
            'Brown eye spot',
            'Brown leaf spot',
            'Brown spots',
            'Bulb rot',
            'Butt molds',
            'Butt rot',
            'Canker',
            'Carrot blight',
            'Ceratocystis rot',
            'Cercospora leaf spot',
            'Chocolate spots',
            'Coffee berry disease',
            'Coffee rust',
            'Corn downy mildew',
            'Corn rust',
            'Crown rot',
            'Damping-off',
            'Dead arm disease',
            'Diamond fruit spot',
            'Diplodia rot',
            'Dirty panicle disease',
            'Downy mildew',
            'Ear rot',
            'Early blight',
            'Finger rot',
            'Freckle disease',
            'Frog eye leaf spot',
            'Frogeye disease',
            'Fruit rot',
            'Fungal crown mold',
            'Fungal heart rot',
            'Fusarium wilt',
            'Gray leaf spot',
            'Greasy spot',
            'Gummy stem blight',
            'Heart rot',
            'Helminthosporium leaf spot',
            'Late blight',
            'Leaf blight',
            'Leaf rust',
            'Leaf spot',
            'Melanose',
            'Mildew',
            'Moko disease',
            'Neck rot',
            'Node blast',
            'Northern corn leaf blight',
            'Nut rot',
            'Panama disease',
            'Panicle blast',
            'Panicle blight',
            'Phoma blight',
            'Phomopsis blight',
            'Phytophthora fruit rot',
            'Phytophthora heart rot',
            'Phytophthora rot',
            'Pineapple disease',
            'Pink disease',
            'Pink rot',
            'Pod rot',
            'Powdery mildew',
            'Rhizoctania sheath blight',
            'Rice blast',
            'Ringspot',
            'Root disease',
            'Root rot',
            'Rot',
            'Rust',
            'Scab',
            'Seeding blight',
            'Septoria fruit rot',
            'Septoria leaf spot',
            'Sheath blight',
            'Sheath rot',
            'Shot hole disease',
            'Sigatoka',
            'Southern leaf blight',
            'Spear rot',
            'Stem and leaf blight',
            'Stem blight',
            'Stem end rot',
            'Stem rot',
            'Strawberry leafspot',
            'Sugarcane smut',
            'Tungro virus',
            'Twister disease',
            'Vine rot',
            'Wet-bud rot',
            'White leaf spot',
            'White rust',
            'White spot',
            'Wilt',
            'Yellow sigatoka',
        ];

        $crops = $unique_crops;

        $peste = [
            'pests' => $pests,
            'weeds' => $weeds,
            'diseases' => $diseases,
        ];

        return Inertia::render('recommendation/pesticide', [
            'pesticides' => $pesticides,
            'crops' => $crops,
            'peste' => $peste,
            'filters' => [
                'search' => $search,
                'crop_search' => $cropSearch,
                'pest_search' => $pestSearch,
                'weed_search' => $weedSearch,
                'disease_search' => $diseaseSearch,
                'toxicity_search' => $toxicitySearch,
                'pesticide_search' => $pesticideSearch,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function downloadPesticide(Pesticide $pesticide)
    {
        try {
            $pdf = Pdf::loadView('pdf.recommendationPesticide', [
                'pesticide' => $pesticide,
            ])->setPaper('a4', 'portrait');

            return $pdf->download('Pesticide_' . preg_replace('/\s+/', '_', $pesticide->product_name) . '.pdf');
        } catch (\Exception $e) {
            Log::error('Pesticide PDF Generation Error: ' . $e->getMessage());

            return back()->withErrors(['pdf_error' => 'An error occurred while generating the PDF. Please try again later.']);
        }
    }

    public function showPesticide(Request $request, $pesticide)
    {
        $pesticide = Pesticide::findOrFail($pesticide);

        return Inertia::render('recommendation/showPesticide', [
            'pesticide' => $pesticide,
        ]);
    }

    /**
     * Map frontend nutrient level to database nutrient level format
     */
    private function mapNutrientLevel(string $level): string
    {
        return match ($level) {
            'Low' => 'L',
            'Medium' => 'M',
            'High' => 'H',
            default => 'L'
        };
    }

    /**
     * Download fertilizer rate recommendations as PDF
     */
    // public function downloadFertilizerRatePdf(Request $request): mixed
    // {
    //     try {
    //         $cropType = $request->get('crop_type');
    //         $nitrogenLevel = $request->get('nitrogen_level');
    //         $phosphorusLevel = $request->get('phosphorus_level');
    //         $potassiumLevel = $request->get('potassium_level');
    //         $growthStage = $request->get('growth_stage');
    //         $soilType = $request->get('soil_type');

    //         // Validate required parameters
    //         if (! $cropType || ! $nitrogenLevel || ! $phosphorusLevel || ! $potassiumLevel) {
    //             return back()->withErrors(['pdf_error' => 'Missing required parameters for PDF generation.']);
    //         }

    //         // Map nutrient levels
    //         $nLevel = $this->mapNutrientLevel($nitrogenLevel);
    //         $pLevel = $this->mapNutrientLevel($phosphorusLevel);
    //         $kLevel = $this->mapNutrientLevel($potassiumLevel);

    //         // Get fertilizer recommendations
    //         $recommendations = $this->getFertilizerRecommendations(
    //             $cropType,
    //             $nLevel,
    //             $pLevel,
    //             $kLevel,
    //             $soilType,
    //             $growthStage
    //         );

    //         // Prepare filters data for display
    //         $filters = [
    //             'crop_type' => $cropType,
    //             'growth_stage' => $growthStage,
    //             'soil_type' => $soilType,
    //             'nitrogen_level' => $nitrogenLevel,
    //             'phosphorus_level' => $phosphorusLevel,
    //             'potassium_level' => $potassiumLevel,
    //         ];


    //         $pdf = Pdf::loadView('pdf.fertilizerRate', [
    //             'recommendations' => $recommendations,
    //             'filters' => $filters,
    //         ])->setPaper('a4', 'portrait');

    //         $fileName = 'Fertilizer_Rate_'.preg_replace('/\s+/', '_', $cropType).'_'.now()->format('Ymd_His').'.pdf';

    //         return $pdf->download($fileName)->withHeaders([
    //             'Content-Type' => 'application/pdf',
    //         ])->setStatusCode(200);
    //     } catch (\Exception $e) {
    //         Log::error('Fertilizer Rate PDF Generation Error: '.$e->getMessage());

    //         return back()->withErrors(['pdf_error' => 'An error occurred while generating the PDF. Please try again later.'])->withStatus(500);
    //     }
    // }
}
