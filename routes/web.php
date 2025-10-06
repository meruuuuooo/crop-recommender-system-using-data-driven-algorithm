<?php

use App\Http\Controllers\CropController;
use App\Http\Controllers\CropRecommendationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FarmController;
use App\Http\Controllers\FarmerController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Status Page
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Farmer Management
    Route::prefix('management/farmer')->name('management.farmer.')->group(function () {
        Route::get('/', [FarmerController::class, 'index'])->name('index');
        Route::post('/', [FarmerController::class, 'store'])->name('store');
        Route::get('/show/{farmer}', [FarmerController::class, 'show'])->name('show');
        Route::get('/edit/{farmer}', [FarmerController::class, 'edit'])->name('edit');
        Route::put('/{farmer}', [FarmerController::class, 'update'])->name('update');
        // Route::delete('/{farmer}', [FarmerController::class, 'destroy'])->name('destroy');

        // show farms owned by farmer
        // Route::get('/farm/show/{farmer}', [FarmerController::class, 'showFarms'])->name('farm.show');
    });

    // Farm Management
    Route::prefix('management/farm')->name('management.farm.')->group(function () {
        Route::get('/', [FarmController::class, 'index'])->name('index');
        Route::get('/create', [FarmController::class, 'create'])->name('create');
        Route::post('/', [FarmController::class, 'store'])->name('store');
        Route::get('/show/{farm}', [FarmController::class, 'show'])->name('show');
        Route::get('/edit/{farm}', [FarmController::class, 'edit'])->name('edit');
        Route::put('/{farm}', [FarmController::class, 'update'])->name('update');
    });

    // Crop Management

    // Route::prefix('management/crop')->name('management.crop.')->group(function () {
    //     Route::get('/', [CropController::class, 'index'])->name('index');
    //     Route::get('/create', [CropController::class, 'create'])->name('create');
    //     Route::post('/', [CropController::class, 'store'])->name('store');
    //     Route::get('/show/{crop}', [CropController::class, 'show'])->name('show');
    //     Route::get('/edit/{crop}', [CropController::class, 'edit'])->name('edit');
    //     Route::put('/{crop}', [CropController::class, 'update'])->name('update');
    // });

    Route::prefix('crop-recommender')->group(function () {
        Route::post('/recommend', [CropRecommendationController::class, 'recommend']);
        Route::get('/model-info', [CropRecommendationController::class, 'modelInfo']);
        Route::get('/soil-types', [CropRecommendationController::class, 'getSoilTypes']);
        Route::get('/crops', [CropRecommendationController::class, 'getCrops']);
        Route::get('/health', [CropRecommendationController::class, 'health']);
    });

    // Recommendation

    Route::prefix('recommendation')->name('recommendation.')->group(function () {
        Route::get('/crop', [RecommendationController::class, 'crop'])->name('crop');
        Route::post('/crop', [RecommendationController::class, 'store'])->name('store');
        Route::get('/crop/download/{recommendation}', [RecommendationController::class, 'downloadRecommendationPdf'])->name('downloadRecommendationPdf');
        Route::get('/crop/show/{recommendation}', [RecommendationController::class, 'showCropRecommendation'])->name('showCropRecommendation');

        Route::get('/fertilizer', [RecommendationController::class, 'fertilizer'])->name('fertilizer');
        Route::post('/fertilizer', [RecommendationController::class, 'generateFertilizerRecommendation'])->name('fertilizer.recommend');
        Route::get('/fertilizer/show/{fertilizer}', [RecommendationController::class, 'showFertilizer'])->name('showFertilizer');
        Route::get('/fertilizer/download', [RecommendationController::class, 'downloadFertilizerRatePdf'])->name('downloadFertilizerRatePdf');
        Route::get('/pesticide', [RecommendationController::class, 'pesticide'])->name('pesticide');
        Route::get('/pesticide/show/{pesticide}', [RecommendationController::class, 'showPesticide'])->name('pesticide.show');
        Route::get('/pesticide/download/{pesticide}', [RecommendationController::class, 'downloadPesticide'])->name('downloadPesticide');
    });

    // Route::get('/api/crops', function(){

    // })

    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('/report1', [ReportController::class, 'report1'])->name('report1');
        Route::get('/report2', [ReportController::class, 'report2'])->name('report2');
        Route::get('/report3', [ReportController::class, 'report3'])->name('report3');
        Route::get('/report4', [ReportController::class, 'report4'])->name('report4');
        Route::get('/report5', [ReportController::class, 'report5'])->name('report5');
        Route::get('/report7', [ReportController::class, 'report7'])->name('report7');
    });

    Route::get('/crop/calendar', function () {
        return Inertia::render('cropCalendar', [
            'crops' => \App\Models\Crop::with('category')->get(),
            'categories' => \App\Models\Category::has('crops')->orderBy('name')->get(),
        ]);
    })->name('crop.calendar');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
