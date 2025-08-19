<?php

use App\Http\Controllers\FarmController;
use App\Http\Controllers\FarmerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Farmer
    Route::prefix('management/farmer')->name('management.farmer.')->group(function () {
        Route::get('/', [FarmerController::class, 'index'])->name('index');
        Route::get('/create', [FarmerController::class, 'create'])->name('create');
        Route::post('/', [FarmerController::class, 'store'])->name('store');
        Route::get('/show/{farmer}', [FarmerController::class, 'show'])->name('show');
        Route::get('/edit/{farmer}', [FarmerController::class, 'edit'])->name('edit');
        Route::put('/{farmer}', [FarmerController::class, 'update'])->name('update');
        // Route::delete('/{farmer}', [FarmerController::class, 'destroy'])->name('destroy');
    });

    // Farm
    Route::prefix('management/farm')->name('management.farm.')->group(function () {
        Route::get('/', [FarmController::class, 'index'])->name('index');
        Route::get('/create', [FarmController::class, 'create'])->name('create');
        Route::post('/', [FarmController::class, 'store'])->name('store');
        Route::get('/show/{farm}', [FarmController::class, 'show'])->name('show');
        Route::get('/edit/{farm}', [FarmController::class, 'edit'])->name('edit');
        Route::put('/{farm}', [FarmController::class, 'update'])->name('update');
    });


    Route::get('management/farm/edit', function () {
        return Inertia::render('management/farm/edit');
    })->name('management.farm.edit');

    Route::get('management/farm/view', function () {
        return Inertia::render('management/farm/view');
    })->name('management.farm.view');

    Route::get('recommendation', function () {
        return Inertia::render('recommendation/index');
    })->name('recommendation');

    Route::get('crop', function () {
        return Inertia::render('recommendation/crop/index');
    })->name('crop');

    Route::get('reports', function () {
        return Inertia::render('reports/index');
    })->name('reports');


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
