<?php

use App\Http\Controllers\FarmController;
use App\Http\Controllers\FarmerController;
use App\Http\Controllers\CropController;
use App\Http\Controllers\RecommendationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Farmer Management
    Route::prefix('management/farmer')->name('management.farmer.')->group(function () {
        Route::get('/', [FarmerController::class, 'index'])->name('index');
        Route::get('/create', [FarmerController::class, 'create'])->name('create');
        Route::post('/', [FarmerController::class, 'store'])->name('store');
        Route::get('/show/{farmer}', [FarmerController::class, 'show'])->name('show');
        Route::get('/edit/{farmer}', [FarmerController::class, 'edit'])->name('edit');
        Route::put('/{farmer}', [FarmerController::class, 'update'])->name('update');
        // Route::delete('/{farmer}', [FarmerController::class, 'destroy'])->name('destroy');
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

    Route::prefix('management/crop')->name('management.crop.')->group(function () {
        Route::get('/', [CropController::class, 'index'])->name('index');
        Route::get('/create', [CropController::class, 'create'])->name('create');
        Route::post('/', [CropController::class, 'store'])->name('store');
        Route::get('/show/{crop}', [CropController::class, 'show'])->name('show');
        Route::get('/edit/{crop}', [CropController::class, 'edit'])->name('edit');
        Route::put('/{crop}', [CropController::class, 'update'])->name('update');
    });

    Route::prefix('recommendation')->name('recommendation.')->group(function () {
        Route::get('/crop', [RecommendationController::class, 'crop'])->name('crop');
        Route::get('/fertilizer', [RecommendationController::class, 'fertilizer'])->name('fertilizer');
        Route::get('/fertilizer/show/{fertilizer}', [RecommendationController::class, 'showFertilizer'])->name('showFertilizer');
        Route::get('/pesticide', [RecommendationController::class, 'pesticide'])->name('pesticide');
    });



    Route::get('reports', function () {
        return Inertia::render('reports/index');
    })->name('reports');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
