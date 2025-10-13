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
        $this->apiUrl = config('services.crop_recommender.api_url', 'http://localhost:8000/api');
        $this->timeout = config('services.crop_recommender.timeout', 30);
    }
    public function getCropRecommendation(array $data)
    {
        try {
            $response = Http::timeout($this->timeout)
                ->post($this->apiUrl.'/api/recommend', [
                    'province' => $data['province'],
                    'municipality' => $data['municipality'],
                    'temperature' => $data['temperature'],
                    'humidity' => $data['humidity'],
                    'rainfall' => $data['rainfall'],
                    'ph' => $data['ph'],
                    'n_level' => $data['n_level'],
                    'p_level' => $data['p_level'],
                    'k_level' => $data['k_level'],
                    'season' => $data['season'],
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
    // public function getModelInfo()
    // {
    //     try {
    //         $response = Http::timeout($this->timeout)
    //             ->get($this->apiUrl.'/model-info');

    //         if ($response->successful()) {
    //             return $response->json();
    //         }

    //         return [
    //             'success' => false,
    //             'error' => 'Failed to fetch model info',
    //         ];

    //     } catch (Exception $e) {
    //         return [
    //             'success' => false,
    //             'error' => $e->getMessage(),
    //         ];
    //     }
    // }
    // public function getAvailableSoilTypes()
    // {
    //     try {
    //         $response = Http::timeout($this->timeout)
    //             ->get($this->apiUrl.'/soil-types');

    //         return $response->json();

    //     } catch (Exception $e) {
    //         return [
    //             'success' => false,
    //             'error' => $e->getMessage(),
    //         ];
    //     }
    // }
    // public function getAvailableCrops()
    // {
    //     try {
    //         $response = Http::timeout($this->timeout)
    //             ->get($this->apiUrl.'/crops');

    //         return $response->json();

    //     } catch (Exception $e) {
    //         return [
    //             'success' => false,
    //             'error' => $e->getMessage(),
    //         ];
    //     }
    // }

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
