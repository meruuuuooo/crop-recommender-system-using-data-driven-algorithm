<?php

namespace App\Http\Controllers;

use App\Models\Crop;
use App\Models\Farm;
use App\Models\Farmer;
use App\Models\Recommendation;
use App\Services\CropRecommenderService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $cropRecommender;

    public function __construct(CropRecommenderService $cropRecommender)
    {
        $this->cropRecommender = $cropRecommender;
    }

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

        // $modelInfo = $this->cropRecommender->getModelInfo();

        // Provide default structure if API call failed
        // if (isset($modelInfo['success']) && $modelInfo['success'] === false) {
        //     $modelInfo = [
        //         'success' => false,
        //         'data' => [
        //             'available_crops' => [],
        //             'available_soil_types' => [],
        //             'features' => [],
        //             'model_type' => '',
        //             'n_estimators' => 0,
        //         ],
        //         'error' => $modelInfo['error'] ?? 'API unavailable',
        //     ];
        // }

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
            // 'modelInfo' => $modelInfo,
        ]);
    }
}
