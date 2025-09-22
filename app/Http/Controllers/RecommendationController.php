<?php

namespace App\Http\Controllers;

use App\Http\Requests\CropRecommendationRequest;
use App\Models\Category;
use App\Models\Climate;
use App\Models\Crop;
use App\Models\CropFertilizer;
use App\Models\Farmer;
use App\Models\Fertilizer;
use App\Models\Pesticide;
use App\Models\Recommendation;
use App\Models\Soil;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RecommendationController extends Controller
{
    public function crop(Request $request)
    {
        $farmers = Farmer::with('farms')->orderByDesc('id')->get();

        $recent_recommendations = Recommendation::with('farmer', 'crop', 'farm')->latest()->take(5)->get();

        return Inertia::render('recommendation/crop', [
            'farmers' => $farmers,
            'recent_recommendations' => $recent_recommendations,
            'recommendationResult' => [],
        ]);
    }

    public function downloadRecommendationPdf($recommendation)
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
                $potassium
            );

            $farmerName = trim($reco->farmer->firstname.' '.$reco->farmer->lastname);

            $pdf = Pdf::loadView('pdf.recommendation', [
                'recommendation' => $reco,
                'fertilizer_recommendations' => $fertilizer_recommendations,
            ])->setPaper('a4', 'portrait');

            $fileName = 'Crop_Recommendation_'.preg_replace('/\s+/', '_', $farmerName).'_'.now()->format('Ymd_His').'.pdf';

            return $pdf->download($fileName);
        } catch (\Exception $e) {
            Log::error('PDF Generation Error: '.$e->getMessage());

            return back()->withErrors(['pdf_error' => 'An error occurred while generating the PDF. Please try again later.']);
        }
    }

    private function getFertilizerRecommendations(string $cropName, string $nLevel, string $pLevel, string $kLevel): array
    {
        $recommendations = [];

        // Get Nitrogen recommendations
        $nitrogenFertilizers = CropFertilizer::where('crop_name', $cropName)
            ->where('nutrient', 'NITROGEN')
            ->where('soil_level', $nLevel)
            ->get();

        // Get Phosphorus recommendations
        $phosphorusFertilizers = CropFertilizer::where('crop_name', $cropName)
            ->where('nutrient', 'PHOSPHORUS')
            ->where('soil_level', $pLevel)
            ->get();

        // Get Potassium recommendations
        $potassiumFertilizers = CropFertilizer::where('crop_name', $cropName)
            ->where('nutrient', 'POTASSIUM')
            ->where('soil_level', $kLevel)
            ->get();

        return [
            'nitrogen' => [
                'crop_fertilizer' => $nitrogenFertilizers->toArray(),
            ],
            'phosphorus' => [
                'crop_fertilizer' => $phosphorusFertilizers->toArray(),
            ],
            'potassium' => [
                'crop_fertilizer' => $potassiumFertilizers->toArray(),
            ],
        ];
    }

    private function mapSoilLevel($level)
    {
        switch (strtolower($level)) {
            case 'low':
                return 'L';
            case 'medium':
                return 'M';
            case 'high':
                return 'H';
            default:
                return 'L'; // Default to Low instead of null
        }
    }

    private function convertNitrogenToKgHa($level)
    {
        switch (strtolower($level)) {
            case 'very low':
                return ['min' => 0, 'max' => 20];
            case 'low':
                return ['min' => 21, 'max' => 40];
            case 'medium':
                return ['min' => 41, 'max' => 60];
            case 'high':
                return ['min' => 61, 'max' => 80];
            case 'very high':
                return ['min' => 81, 'max' => 100];
            default:
                return ['min' => 0, 'max' => 0];
        }
    }

    private function convertPhosphorusToKgHa($level)
    {
        switch (strtolower($level)) {
            case 'very low':
                return ['min' => 0, 'max' => 15];
            case 'low':
                return ['min' => 16, 'max' => 30];
            case 'medium':
                return ['min' => 31, 'max' => 45];
            case 'high':
                return ['min' => 46, 'max' => 60];
            case 'very high':
                return ['min' => 61, 'max' => 75];
            default:
                return ['min' => 0, 'max' => 0];
        }
    }

    private function convertPotassiumToKgHa($level)
    {
        switch (strtolower($level)) {
            case 'very low':
                return ['min' => 0, 'max' => 25];
            case 'low':
                return ['min' => 26, 'max' => 50];
            case 'medium':
                return ['min' => 51, 'max' => 75];
            case 'high':
                return ['min' => 76, 'max' => 100];
            case 'very high':
                return ['min' => 101, 'max' => 125];
            default:
                return ['min' => 0, 'max' => 0];
        }
    }

    public function store(CropRecommendationRequest $request)
    {
        $validated = $request->validated();

        $nitrogen = $this->convertNitrogenToKgHa($validated['nitrogen_level']);
        $phosphorus = $this->convertPhosphorusToKgHa($validated['phosphorus_level']);
        $potassium = $this->convertPotassiumToKgHa($validated['potassium_level']);

        $apiInput = [
            'Soil_Type' => $validated['soilType'],
            'Soil_pH' => (float) $validated['ph_level'],
            'Temperature' => (float) $validated['temperature'],
            'Humidity' => (float) $validated['humidity'],
            'N' => $nitrogen['max'] ?? 0,
            'P' => $phosphorus['max'] ?? 0,
            'K' => $potassium['max'] ?? 0,
        ];

        try {
            $recommendations = $this->callCropRecommendationApi($apiInput);

            $recommendedCrops = [];

            // Check if API response has recommendations array
            if (isset($recommendations['recommendations'])) {
                // Save soil and climate records once (not per recommendation)
                $soil = Soil::create([
                    'soil_type' => $validated['soilType'],
                    'pH' => $validated['ph_level'],
                    'nitrogen_level' => $validated['nitrogen_level'],
                    'phosphorus_level' => $validated['phosphorus_level'],
                    'potassium_level' => $validated['potassium_level'],
                    'nitrogen' => $apiInput['N'],
                    'phosphorus' => $apiInput['P'],
                    'potassium' => $apiInput['K'],
                    'farm_id' => $validated['farm_id'],
                    'test_date' => now(),
                ]);

                $climate = Climate::create([
                    'farm_id' => $validated['farm_id'],
                    'temperature' => $validated['temperature'],
                    'rainfall' => $validated['rainfall'],
                    'humidity' => $validated['humidity'],
                    'climate_record_date' => now(),
                ]);

                // Process each crop recommendation
                foreach ($recommendations['recommendations'] as $rec) {

                    $crop = Crop::where('name', $rec['crop'])->first();

                    if ($crop) {
                        // Save recommendation to database
                        $reco = Recommendation::create([
                            'farmer_id' => $validated['farmer_id'],
                            'farm_id' => $validated['farm_id'],
                            'crop_id' => $crop->id,
                            'soil_id' => $soil->id,
                            'climate_id' => $climate->id,
                            'confidence_score' => $rec['confidence'], // Use decimal value directly
                            'recommendation_date' => now(),
                        ]);

                        // Get soil level mappings for fertilizer recommendations
                        $nLevel = $this->mapSoilLevel($validated['nitrogen_level']);
                        $pLevel = $this->mapSoilLevel($validated['phosphorus_level']);
                        $kLevel = $this->mapSoilLevel($validated['potassium_level']);

                        // Get detailed fertilizer recommendations
                        $fertilizer_recommendations = $this->getFertilizerRecommendations(
                            $crop->name,
                            $nLevel,
                            $pLevel,
                            $kLevel
                        );

                        // Add to the array for frontend display
                        $recommendedCrops[] = [
                            'recommendation_id' => $reco->id,
                            'farmer_id' => $validated['farmer_id'],
                            'crop_name' => $crop->name,
                            'fertilizer_recommendations' => $fertilizer_recommendations,
                            'confidence_score' => $rec['confidence'] * 100, // Convert to percentage for display
                        ];
                    }
                }
            }

            return Inertia::render('recommendation/crop', [
                'farmers' => Farmer::with('farms')->get(),
                'recent_recommendations' => Recommendation::with('farmer', 'crop', 'farm')->latest()->take(5)->get(),
                'recommendationResult' => $recommendedCrops,
            ]);
        } catch (\Exception $e) {
            Log::error('Crop recommendation error: '.$e->getMessage());

            return back()->withErrors(['api_error' => $e->getMessage()]);
        }
    }

    private function callCropRecommendationApi(array $data)
    {
        try {
            $response = Http::timeout(30)->post('http://127.0.0.1:5000/api/predict/topk?k=3', $data);

            if ($response->successful()) {
                $predictions = $response->json();

                return $predictions;
            } else {
                $statusCode = $response->status();
                $errorMessage = "Failed to get recommendations from the model. HTTP Status: {$statusCode}";

                if ($response->body()) {
                    $errorMessage .= ' Response: '.$response->body();
                }

                throw new \Exception($errorMessage);
            }
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            $errorMessage = 'The crop recommendation service is currently unavailable.
            The Model recommendation service may not be running or there may be network connectivity issues.';

            throw new \Exception($errorMessage);
        }
    }

    // public function getCropRecommendation(CropRecommendationRequest $request)
    // {

    //     // $validated = $request->validated();

    //     // dd($validated);

    //     // // $npkInKgHa = [
    //     // //     'nitrogen' => $this->convertNitrogenToKgHa($validated['nitrogen_level']),
    //     // //     'phosphorus' => $this->convertPhosphorusToKgHa($validated['phosphorus_level'], $validated['ph_level']),
    //     // //     'potassium' => $this->convertPotassiumToKgHa($validated['potassium_level']),
    //     // // ];

    //     // $apiData = [
    //     //     'soil_type' => $validated['soilType'],
    //     //     'soil_ph' => (float) $validated['ph_level'],
    //     //     'temperature' => (float) $validated['temperature'],
    //     //     'humidity' => (float) $validated['humidity'],
    //     //     'nitrogen' => $npkInKgHa['nitrogen']['max'] ?? 0,
    //     //     'phosphorus' => $npkInKgHa['phosphorus']['max'] ?? 0,
    //     //     'potassium' => $npkInKgHa['potassium']['max'] ?? 0,
    //     // ];

    //     // // Call the Python ML model API with timeout and error handling
    //     // try {
    //     //     $response = Http::timeout(30)->post('http://localhost:5000/predict', $apiData);

    //     //     if ($response->successful()) {
    //     //         $predictions = $response->json();

    //     //         // Validate farmer and farm data for saving
    //     //         $saveRecommendation = $request->validate([
    //     //             'farmer_id' => 'required|exists:farmers,id',
    //     //             'farm_id' => 'required|exists:farms,id',
    //     //         ]);

    //     //         // Check if the API response is successful and has recommendations
    //     //         if ($predictions['status'] === 'success' && isset($predictions['recommended_crop'])) {
    //     //             $recommendedCrops = [];

    //     //             // Process the single recommendation
    //     //             $cropName = $predictions['recommended_crop'];
    //     //             $confidenceScore = (float) str_replace('%', '', $predictions['confidence_score']);

    //     //             // Find the crop in the database
    //     //             $crop = Crop::where('name', $cropName)->first();

    //     //             if ($crop) {
    //     //                 // Create soil record
    //     //                 Soil::create([
    //     //                     'soil_type' => $validated['soilType'],
    //     //                     'pH' => $validated['ph_level'],
    //     //                     'nitrogen_level' => $validated['nitrogen_level'],
    //     //                     'phosphorus_level' => $validated['phosphorus_level'],
    //     //                     'potassium_level' => $validated['potassium_level'],
    //     //                     'nitrogen' => $apiData['nitrogen'],
    //     //                     'phosphorus' => $apiData['phosphorus'],
    //     //                     'potassium' => $apiData['potassium'],
    //     //                     'farm_id' => $saveRecommendation['farm_id'],
    //     //                     'test_date' => now(),
    //     //                 ]);

    //     //                 // Create climate record
    //     //                 Climate::create([
    //     //                     'farm_id' => $saveRecommendation['farm_id'],
    //     //                     'temperature' => $validated['temperature'],
    //     //                     'rainfall' => $validated['rainfall'],
    //     //                     'humidity' => $validated['humidity'],
    //     //                     'climate_record_date' => now(),
    //     //                 ]);

    //     //                 // Save the recommendation to the database
    //     //                 Recommendation::create([
    //     //                     'farmer_id' => $saveRecommendation['farmer_id'],
    //     //                     'farm_id' => $saveRecommendation['farm_id'],
    //     //                     'crop_id' => $crop->id,
    //     //                     'confidence_score' => $confidenceScore / 100, // Convert percentage to decimal
    //     //                     'recommendation_date' => now(),
    //     //                 ]);

    //     //                 $nitrogen = $this->mapSoilLevel($validated['nitrogen_level']);
    //     //                 $phosphorus = $this->mapSoilLevel($validated['phosphorus_level']);
    //     //                 $potassium = $this->mapSoilLevel($validated['potassium_level']);

    //     //                 $reco_crop = $crop->name;

    //     //                 // Get detailed fertilizer recommendations
    //     //                 $fertilizer_recommendations = $this->getFertilizerRecommendations(
    //     //                     $reco_crop,
    //     //                     $nitrogen,
    //     //                     $phosphorus,
    //     //                     $potassium
    //     //                 );

    //     //                 // Add to the array for frontend display
    //     //                 $recommendedCrops[] = [
    //     //                     'farmer_id' => $saveRecommendation['farmer_id'],
    //     //                     'crop_name' => $crop->name,
    //     //                     'fertilizer_recommendations' => $fertilizer_recommendations,
    //     //                     'confidence_score' => $confidenceScore,
    //     //                 ];
    //     //             }
    //     //         }

    //     //         return Inertia::render('recommendation/crop', [
    //     //             'farmers' => Farmer::with('farms')->get(),
    //     //             'recent_recommendations' => Recommendation::with('farmer', 'crop', 'farm')->latest()->take(5)->get(),
    //     //             'recommendationResult' => $recommendedCrops ?? [],
    //     //             'apiResponse' => $predictions,
    //     //         ]);
    //     //     } else {
    //     //         // Handle HTTP error responses
    //     //         $statusCode = $response->status();
    //     //         $errorMessage = "Failed to get recommendations from the model. HTTP Status: {$statusCode}";

    //     //         if ($response->body()) {
    //     //             $errorMessage .= ' Response: ' . $response->body();
    //     //         }

    //     //         return back()->withErrors(['api_error' => $errorMessage]);
    //     //     }
    //     // } catch (\Illuminate\Http\Client\ConnectionException $e) {
    //     //     // Handle connection errors (cURL error 7, network issues, etc.)
    //     //     $errorMessage = $e->getMessage();

    //     //     if (
    //     //         str_contains($errorMessage, 'cURL error 7') ||
    //     //         str_contains($errorMessage, 'Failed to connect') ||
    //     //         str_contains($errorMessage, 'Connection refused') ||
    //     //         str_contains($errorMessage, 'Couldn\'t connect to server')
    //     //     ) {

    //     //         return back()->withErrors([
    //     //             'api_error' => 'The crop recommendation service is currently unavailable. The Model recommendation service may not be running or there may be network connectivity issues.',
    //     //         ]);
    //     //     }

    //     //     // Generic connection error
    //     //     return back()->withErrors([
    //     //         'api_error' => 'Unable to connect to the recommendation service: ' . $errorMessage,
    //     //     ]);
    //     // } catch (\Illuminate\Http\Client\RequestException $e) {
    //     //     // Handle other HTTP client errors
    //     //     return back()->withErrors([
    //     //         'api_error' => 'Request failed: ' . $e->getMessage(),
    //     //     ]);
    //     // } catch (\Exception $e) {
    //     //     // Handle any other unexpected errors
    //     //     return back()->withErrors([
    //     //         'api_error' => 'An unexpected error occurred while generating recommendations: ' . $e->getMessage(),
    //     //     ]);
    //     // }
    // }

    public function fertilizer(Request $request)
    {
        $search = $request->get('search', '');
        $perPage = $request->get('per_page', 10);

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

        // $crops = Crop::with('category')->get();

        $categories = Category::with('crops')->get();

        return Inertia::render('recommendation/fertilizer', [
            'fertilizers' => $fertilizers,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
            'categories' => $categories,
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
        $perPage = $request->get('per_page', 12);

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

        return Inertia::render('recommendation/pesticide', [
            'pesticides' => $pesticides,
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

    public function showPesticide(Request $request, $pesticide)
    {
        $pesticide = Pesticide::findOrFail($pesticide);

        return Inertia::render('recommendation/showPesticide', [
            'pesticide' => $pesticide,
        ]);
    }
}
