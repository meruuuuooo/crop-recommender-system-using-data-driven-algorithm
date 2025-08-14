<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('management/farmer', function () {
        return Inertia::render('management/farmer/index');
    })->name('management.farmer');

    Route::get('management/farm', function () {
        return Inertia::render('management/farm/index');
    })->name('management.farm');

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
