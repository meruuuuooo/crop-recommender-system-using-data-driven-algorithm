<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Climate;
use App\Models\Crop;
use App\Models\Farmer;
use App\Models\Fertilizer;
use App\Models\Pesticide;
use App\Models\Recommendation;
use App\Models\Soil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

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

    public function downloadRecommendationPdf($farmer)
    {
        try {
            // Get the latest recommendation for the farmer with highest confidence score
            $recommendation = Recommendation::where('farmer_id', $farmer)
                ->with([
                    'farmer.location.province',
                    'farmer.location.municipality',
                    'farmer.location.barangay',
                    'crop.category',
                    'farm.location.province',
                    'farm.location.municipality',
                    'farm.location.barangay',
                    'farm.soils',
                    'farm.climates'
                ])
                ->latest()
                ->orderByDesc('confidence_score')
                ->first();

            if (!$recommendation) {
                return back()->withErrors(['pdf_error' => 'No recommendations found for the selected farmer.']);
            }

            $farmerName = trim($recommendation->farmer->firstname . ' ' . ($recommendation->farmer->middlename ?? '') . ' ' . $recommendation->farmer->lastname);

            $pdf = Pdf::loadView('pdf.recommendation', [
                'recommendation' => $recommendation,
            ])->setPaper('a4', 'portrait');

            $fileName = 'Crop_Recommendation_' . preg_replace('/\s+/', '_', $farmerName) . '_' . now()->format('Ymd_His') . '.pdf';

            return $pdf->download($fileName);

        } catch (\Exception $e) {
            Log::error('PDF Generation Error: ' . $e->getMessage());

            return back()->withErrors(['pdf_error' => 'An error occurred while generating the PDF. Please try again later.']);
        }
    }

    public function showCropRecommendation(Recommendation $recommendation)
    {

        $showRecommendation = Recommendation::with('farmer', 'crop', 'farm')->findOrFail($recommendation->id);

        return Inertia::render('recommendation/showCropRecommendation', [
            'recommendation' => $showRecommendation,
        ]);
    }

    public function getCropRecommendation(Request $request)
    {

        $validated = $request->validate([
            'soilType' => 'required|string',
            'ph_level' => 'required|numeric',
            'rainfall' => 'required|numeric',
            'nitrogen_level' => 'required|string|in:very low,low,medium,high,very high',
            'phosphorus_level' => 'required|string|in:very low,low,medium,high,very high',
            'potassium_level' => 'required|string|in:very low,low,medium,high,very high',
            'temperature' => 'required|numeric',
            'humidity' => 'required|numeric',
        ]);
        $npkInKgHa = [
            'nitrogen' => $this->convertNitrogenToKgHa($validated['nitrogen_level']),
            'phosphorus' => $this->convertPhosphorusToKgHa($validated['phosphorus_level'], $validated['ph_level']),
            'potassium' => $this->convertPotassiumToKgHa($validated['potassium_level']),
        ];

        $apiData = [
            'soil_type' => $validated['soilType'],
            'soil_ph' => (float) $validated['ph_level'],
            'temperature' => (float) $validated['temperature'],
            'humidity' => (float) $validated['humidity'],
            'nitrogen' => $npkInKgHa['nitrogen']['max'] ?? 0,
            'phosphorus' => $npkInKgHa['phosphorus']['max'] ?? 0,
            'potassium' => $npkInKgHa['potassium']['max'] ?? 0,
        ];

        // Call the Python ML model API with timeout and error handling
        try {
            $response = Http::timeout(30)->post('http://localhost:5000/predict', $apiData);

            if ($response->successful()) {
                $predictions = $response->json();

                // Validate farmer and farm data for saving
                $saveRecommendation = $request->validate([
                    'farmer_id' => 'required|exists:farmers,id',
                    'farm_id' => 'required|exists:farms,id',
                ]);

                // Check if the API response is successful and has recommendations
                if ($predictions['status'] === 'success' && isset($predictions['recommended_crop'])) {
                    $recommendedCrops = [];

                    // Process the single recommendation
                    $cropName = $predictions['recommended_crop'];
                    $confidenceScore = (float) str_replace('%', '', $predictions['confidence_score']);

                    // Find the crop in the database
                    $crop = Crop::where('name', $cropName)->first();

                    if ($crop) {
                        // Create soil record
                        Soil::create([
                            'soil_type' => $validated['soilType'],
                            'pH' => $validated['ph_level'],
                            'nitrogen_level' => $validated['nitrogen_level'],
                            'phosphorus_level' => $validated['phosphorus_level'],
                            'potassium_level' => $validated['potassium_level'],
                            'nitrogen' => $apiData['nitrogen'],
                            'phosphorus' => $apiData['phosphorus'],
                            'potassium' => $apiData['potassium'],
                            'farm_id' => $saveRecommendation['farm_id'],
                            'test_date' => now(),
                        ]);

                        // Create climate record
                        Climate::create([
                            'farm_id' => $saveRecommendation['farm_id'],
                            'temperature' => $validated['temperature'],
                            'rainfall' => $validated['rainfall'],
                            'humidity' => $validated['humidity'],
                            'climate_record_date' => now(),
                        ]);

                        // Save the recommendation to the database
                        Recommendation::create([
                            'farmer_id' => $saveRecommendation['farmer_id'],
                            'farm_id' => $saveRecommendation['farm_id'],
                            'crop_id' => $crop->id,
                            'confidence_score' => $confidenceScore / 100, // Convert percentage to decimal
                            'recommendation_date' => now(),
                        ]);

                        // Add to the array for frontend display
                        $recommendedCrops[] = [
                            'farmer_id' => $saveRecommendation['farmer_id'],
                            'crop_name' => $crop->name,
                            'confidence_score' => $confidenceScore,
                        ];
                    }
                }

                return Inertia::render('recommendation/crop', [
                    'farmers' => Farmer::with('farms')->get(),
                    'recent_recommendations' => Recommendation::with('farmer', 'crop', 'farm')->latest()->take(5)->get(),
                    'recommendationResult' => $recommendedCrops ?? [],
                    'apiResponse' => $predictions,
                ]);
            } else {
                // Handle HTTP error responses
                $statusCode = $response->status();
                $errorMessage = "Failed to get recommendations from the model. HTTP Status: {$statusCode}";

                if ($response->body()) {
                    $errorMessage .= ' Response: ' . $response->body();
                }

                return back()->withErrors(['api_error' => $errorMessage]);
            }
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            // Handle connection errors (cURL error 7, network issues, etc.)
            $errorMessage = $e->getMessage();

            if (
                str_contains($errorMessage, 'cURL error 7') ||
                str_contains($errorMessage, 'Failed to connect') ||
                str_contains($errorMessage, 'Connection refused') ||
                str_contains($errorMessage, 'Couldn\'t connect to server')
            ) {

                return back()->withErrors([
                    'api_error' => 'The crop recommendation service is currently unavailable. The Model recommendation service may not be running or there may be network connectivity issues.',
                ]);
            }

            // Generic connection error
            return back()->withErrors([
                'api_error' => 'Unable to connect to the recommendation service: ' . $errorMessage,
            ]);
        } catch (\Illuminate\Http\Client\RequestException $e) {
            // Handle other HTTP client errors
            return back()->withErrors([
                'api_error' => 'Request failed: ' . $e->getMessage(),
            ]);
        } catch (\Exception $e) {
            // Handle any other unexpected errors
            return back()->withErrors([
                'api_error' => 'An unexpected error occurred while generating recommendations: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Convert nitrogen percentage to kg/ha
     * Assumes typical soil bulk density of 1.3 g/cm³ and 20cm depth
     */
    private function convertNitrogenToKgHa(string $level): array
    {
        // Soil bulk density (g/cm³) and depth (cm) for calculation
        $bulkDensity = 1.3; // g/cm³
        $depth = 20; // cm (typical soil sampling depth)
        $conversionFactor = $bulkDensity * $depth * 10; // kg/ha per 1%

        switch ($level) {
            case 'very low':
                // <0.05% = 0-0.049%
                return [
                    'min' => 0,
                    'max' => round(0.049 * $conversionFactor, 1),
                    'range' => '0-' . round(0.049 * $conversionFactor, 1) . ' kg/ha',
                ];
            case 'low':
                // 0.05-0.15%
                return [
                    'min' => round(0.05 * $conversionFactor, 1),
                    'max' => round(0.15 * $conversionFactor, 1),
                    'range' => round(0.05 * $conversionFactor, 1) . '-' . round(0.15 * $conversionFactor, 1) . ' kg/ha',
                ];
            case 'medium':
                // >0.15-0.2%
                return [
                    'min' => round(0.15 * $conversionFactor, 1),
                    'max' => round(0.2 * $conversionFactor, 1),
                    'range' => round(0.15 * $conversionFactor, 1) . '-' . round(0.2 * $conversionFactor, 1) . ' kg/ha',
                ];
            case 'high':
                // >0.2-0.3%
                return [
                    'min' => round(0.2 * $conversionFactor, 1),
                    'max' => round(0.3 * $conversionFactor, 1),
                    'range' => round(0.2 * $conversionFactor, 1) . '-' . round(0.3 * $conversionFactor, 1) . ' kg/ha',
                ];
            case 'very high':
                // >0.3%
                return [
                    'min' => round(0.3 * $conversionFactor, 1),
                    'max' => null,
                    'range' => '>' . round(0.3 * $conversionFactor, 1) . ' kg/ha',
                ];
            default:
                return [
                    'min' => 0,
                    'max' => 0,
                    'range' => 'Unknown',
                ];
        }
    }

    /**
     * Convert phosphorus mg/kg to kg/ha
     * Uses Bray or Olsen method based on pH
     */
    private function convertPhosphorusToKgHa(string $level, float $pH): array
    {
        $bulkDensity = 1.3; // g/cm³
        $depth = 20; // cm
        $conversionFactor = $bulkDensity * $depth / 1000; // kg/ha per 1 mg/kg

        $isBrayMethod = $pH <= 5.5;

        if ($isBrayMethod) {
            // Bray method ranges
            switch ($level) {
                case 'very low':
                    return [
                        'min' => 0,
                        'max' => round(3 * $conversionFactor, 2),
                        'range' => '0-' . round(3 * $conversionFactor, 2) . ' kg/ha (Bray)',
                        'method' => 'Bray',
                    ];
                case 'low':
                    return [
                        'min' => round(3 * $conversionFactor, 2),
                        'max' => round(10 * $conversionFactor, 2),
                        'range' => round(3 * $conversionFactor, 2) . '-' . round(10 * $conversionFactor, 2) . ' kg/ha (Bray)',
                        'method' => 'Bray',
                    ];
                case 'medium':
                    return [
                        'min' => round(10 * $conversionFactor, 2),
                        'max' => round(20 * $conversionFactor, 2),
                        'range' => round(10 * $conversionFactor, 2) . '-' . round(20 * $conversionFactor, 2) . ' kg/ha (Bray)',
                        'method' => 'Bray',
                    ];
                case 'high':
                    return [
                        'min' => round(20 * $conversionFactor, 2),
                        'max' => round(30 * $conversionFactor, 2),
                        'range' => round(20 * $conversionFactor, 2) . '-' . round(30 * $conversionFactor, 2) . ' kg/ha (Bray)',
                        'method' => 'Bray',
                    ];
                case 'very high':
                    return [
                        'min' => round(30 * $conversionFactor, 2),
                        'max' => null,
                        'range' => '>' . round(30 * $conversionFactor, 2) . ' kg/ha (Bray)',
                        'method' => 'Bray',
                    ];
                default:
                    return [
                        'min' => 0,
                        'max' => 0,
                        'range' => 'Unknown',
                        'method' => 'Bray',
                    ];
            }
        } else {
            // Olsen method ranges
            switch ($level) {
                case 'very low':
                    return [
                        'min' => 0,
                        'max' => round(3 * $conversionFactor, 2),
                        'range' => '0-' . round(3 * $conversionFactor, 2) . ' kg/ha (Olsen)',
                        'method' => 'Olsen',
                    ];
                case 'low':
                    return [
                        'min' => 0,
                        'max' => round(7 * $conversionFactor, 2),
                        'range' => '0-' . round(7 * $conversionFactor, 2) . ' kg/ha (Olsen)',
                        'method' => 'Olsen',
                    ];
                case 'medium':
                    return [
                        'min' => round(7 * $conversionFactor, 2),
                        'max' => round(25 * $conversionFactor, 2),
                        'range' => round(7 * $conversionFactor, 2) . '-' . round(25 * $conversionFactor, 2) . ' kg/ha (Olsen)',
                        'method' => 'Olsen',
                    ];
                case 'high':
                    return [
                        'min' => round(25 * $conversionFactor, 2),
                        'max' => round(33 * $conversionFactor, 2),
                        'range' => round(25 * $conversionFactor, 2) . '-' . round(33 * $conversionFactor, 2) . ' kg/ha (Olsen)',
                        'method' => 'Olsen',
                    ];
                case 'very high':
                    return [
                        'min' => round(33 * $conversionFactor, 2),
                        'max' => null,
                        'range' => '>' . round(33 * $conversionFactor, 2) . ' kg/ha (Olsen)',
                        'method' => 'Olsen',
                    ];
                default:
                    return [
                        'min' => 0,
                        'max' => 0,
                        'range' => 'Unknown',
                        'method' => 'Olsen',
                    ];
            }
        }
    }

    /**
     * Convert potassium cmol/kg to kg/ha
     * Uses ammonium acetate extraction method
     */
    private function convertPotassiumToKgHa(string $level): array
    {
        $bulkDensity = 1.3; // g/cm³
        $depth = 20; // cm
        $potassiumAtomicWeight = 39.1; // g/mol
        // 1 cmol/kg = 39.1 mg K/kg soil
        $conversionFactor = $bulkDensity * $depth * $potassiumAtomicWeight / 1000; // kg/ha per 1 cmol/kg

        switch ($level) {
            case 'very low':
                // <0.3 cmol/kg
                return [
                    'min' => 0,
                    'max' => round(0.3 * $conversionFactor, 1),
                    'range' => '0-' . round(0.3 * $conversionFactor, 1) . ' kg/ha',
                ];
            case 'low':
                // 0.3-1.0 cmol/kg
                return [
                    'min' => round(0.3 * $conversionFactor, 1),
                    'max' => round(1.0 * $conversionFactor, 1),
                    'range' => round(0.3 * $conversionFactor, 1) . '-' . round(1.0 * $conversionFactor, 1) . ' kg/ha',
                ];
            case 'medium':
                // 1.0-3.0 cmol/kg
                return [
                    'min' => round(1.0 * $conversionFactor, 1),
                    'max' => round(3.0 * $conversionFactor, 1),
                    'range' => round(1.0 * $conversionFactor, 1) . '-' . round(3.0 * $conversionFactor, 1) . ' kg/ha',
                ];
            case 'high':
                // 3.0-8.0 cmol/kg
                return [
                    'min' => round(3.0 * $conversionFactor, 1),
                    'max' => round(8.0 * $conversionFactor, 1),
                    'range' => round(3.0 * $conversionFactor, 1) . '-' . round(8.0 * $conversionFactor, 1) . ' kg/ha',
                ];
            case 'very high':
                // >8.0 cmol/kg
                return [
                    'min' => round(8.0 * $conversionFactor, 1),
                    'max' => null,
                    'range' => '>' . round(8.0 * $conversionFactor, 1) . ' kg/ha',
                ];
            default:
                return [
                    'min' => 0,
                    'max' => 0,
                    'range' => 'Unknown',
                ];
        }
    }

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
