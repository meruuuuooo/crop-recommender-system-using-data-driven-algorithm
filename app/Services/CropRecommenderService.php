<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CropRecommenderService
{
    protected $apiUrl;

    protected $timeout;

    public function __construct()
    {
        $this->apiUrl = config('services.crop_recommender.api_url', 'http://localhost:5000/api');
        $this->timeout = config('services.crop_recommender.timeout', 30);
    }

    /**
     * Get crop recommendation based on soil and environmental conditions
     *
     * @return array
     */
    public function getCropRecommendation(array $data)
    {
        try {
            $response = Http::timeout($this->timeout)
                ->post($this->apiUrl.'/predict', [
                    'soil_type' => $data['soil_type'],
                    'soil_ph' => $data['soil_ph'],
                    'temperature' => $data['temperature'],
                    'humidity' => $data['humidity'],
                    'nitrogen' => $data['nitrogen'],
                    'phosphorus' => $data['phosphorus'],
                    'potassium' => $data['potassium'],
                ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Crop Recommender API Error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [
                'success' => false,
                'error' => 'API request failed: '.$response->status(),
            ];

        } catch (Exception $e) {
            Log::error('Crop Recommender API Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get model information
     *
     * @return array
     */
    public function getModelInfo()
    {
        try {
            $response = Http::timeout($this->timeout)
                ->get($this->apiUrl.'/model-info');

            if ($response->successful()) {
                return $response->json();
            }

            return [
                'success' => false,
                'error' => 'Failed to fetch model info',
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get available soil types
     *
     * @return array
     */
    public function getAvailableSoilTypes()
    {
        try {
            $response = Http::timeout($this->timeout)
                ->get($this->apiUrl.'/soil-types');

            return $response->json();

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get available crops
     *
     * @return array
     */
    public function getAvailableCrops()
    {
        try {
            $response = Http::timeout($this->timeout)
                ->get($this->apiUrl.'/crops');

            return $response->json();

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Check API health
     *
     * @return array
     */
    public function checkHealth()
    {
        try {
            $response = Http::timeout(5)
                ->get($this->apiUrl.'/health');

            return $response->json();

        } catch (Exception $e) {
            return [
                'status' => 'unhealthy',
                'error' => $e->getMessage(),
            ];
        }
    }
}
