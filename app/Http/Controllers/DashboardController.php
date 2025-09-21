<?php

namespace App\Http\Controllers;

use App\Models\Crop;
use App\Models\Farm;
use App\Models\Farmer;
use App\Models\Recommendation;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index()
    {
        // Get key metrics
        $totalFarms = Farm::count();
        $totalFarmers = Farmer::count();
        $totalCrops = Crop::count();
        $totalRecommendations = Recommendation::count();

        $recentRecommendations = Recommendation::with('farmer', 'crop', 'farm')->latest()->take(6)->get();

        // Top 5 most recommended crops
        $topRecommendedCrops = Recommendation::join('crops', 'recommendations.crop_id', '=', 'crops.id')
            ->select('crops.name as crop', DB::raw('COUNT(*) as recommendations'))
            ->groupBy('crops.id', 'crops.name')
            ->orderBy('recommendations', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'crop' => $item->crop,
                    'recommendations' => $item->recommendations,
                ];
            });

        // Recent activity (farms vs farmers registrations trend)
        $activityTrend = collect(range(5, 0))->map(function ($monthsAgo) {
            $date = now()->subMonths($monthsAgo);

            return [
                'date' => $date->format('Y-m-d'),
                'farms' => Farm::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->count(),
                'farmers' => Farmer::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->count(),
            ];
        });

        $supportedCrops = $this->getSupportedCropsAPI();

        return Inertia::render('dashboard', [
            'metrics' => [
                'totalFarms' => $totalFarms,
                'totalFarmers' => $totalFarmers,
                'totalCrops' => $totalCrops,
                'totalRecommendations' => $totalRecommendations,
            ],
            'topRecommendedCrops' => $topRecommendedCrops,
            'activityTrend' => $activityTrend,
            'recentRecommendations' => $recentRecommendations,
            'supportedCrops' => $supportedCrops,
        ]);
    }

    private function getSupportedCropsAPI()
    {
        try {
            $response = Http::timeout(10)->get('http://127.0.0.1:5000/api/crops');
            if ($response->successful()) {
                $data = $response->json();

                // Transform the API response to match frontend expectations
                if (isset($data['supported_crops']) && is_array($data['supported_crops'])) {
                    return collect($data['supported_crops'])->map(function ($crop) {
                        return [
                            'supported_crops' => $crop,
                            'total_count' => 1, // You could get actual counts from your database if needed
                        ];
                    })->toArray();
                }

                return [];
            }
        } catch (\Exception $e) {
            Log::error('Error fetching supported crops: ' . $e->getMessage());
        }
        return [];
    }

}
