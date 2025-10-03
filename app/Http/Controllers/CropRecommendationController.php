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
            'soil_type' => 'required|string|in:Clay,Loamy,Sandy,Peaty,Saline',
            'soil_ph' => 'required|numeric|min:4|max:9',
            'temperature' => 'required|numeric|min:0|max:50',
            'humidity' => 'required|numeric|min:0|max:100',
            'nitrogen' => 'required|numeric|min:0',
            'phosphorus' => 'required|numeric|min:0',
            'potassium' => 'required|numeric|min:0',
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
    public function modelInfo(): JsonResponse
    {
        $result = $this->recommender->getModelInfo();

        return response()->json($result);
    }

    /**
     * Get available soil types
     */
    public function getSoilTypes(): JsonResponse
    {
        $result = $this->recommender->getAvailableSoilTypes();

        return response()->json($result);
    }

    /**
     * Get available crops
     */
    public function getCrops(): JsonResponse
    {
        $result = $this->recommender->getAvailableCrops();

        return response()->json($result);
    }

    /**
     * Check API health
     */
    public function health(): JsonResponse
    {
        $result = $this->recommender->checkHealth();

        return response()->json($result);
    }
}
