<?php

namespace App\Http\Controllers;

use App\Services\CropRecommenderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CropRecommendationController extends Controller
{
    protected $recommender;

    public function __construct(CropRecommenderService $recommender)
    {
        $this->recommender = $recommender;
    }

    /**
     * Get crop recommendation
     */
    public function recommend(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'province' => 'required|string',
            'municipality' => 'required|string',
            'temperature' => 'required|numeric',
            'humidity' => 'required|numeric',
            'rainfall' => 'required|numeric',
            'n_level' => 'required|string',
            'p_level' => 'required|string',
            'k_level' => 'required|string',
            'season' => 'required|string',
        ]);

        $result = $this->recommender->getCropRecommendation($validated);

        if ($result['success'] ?? false) {
            return response()->json($result, 200);
        }

        return response()->json($result, 400);
    }

    /**
     * Get model information
     */
    // public function modelInfo(): JsonResponse
    // {
    //     $result = $this->recommender->getModelInfo();

    //     return response()->json($result);
    // }

    /**
     * Get available soil types
     */
    // public function getSoilTypes(): JsonResponse
    // {
    //     $result = $this->recommender->getAvailableSoilTypes();

    //     return response()->json($result);
    // }

    /**
     * Get available crops
     */
    // public function getCrops(): JsonResponse
    // {
    //     $result = $this->recommender->getAvailableCrops();

    //     return response()->json($result);
    // }

    /**
     * Check API health
     */
    public function health(): JsonResponse
    {
        $result = $this->recommender->checkHealth();

        return response()->json($result);
    }
}
