<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\FarmerRepositoryInterface;
use App\Repositories\FarmerRepository;
use App\Repositories\FarmRepositoryInterface;
use App\Repositories\FarmRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(FarmerRepositoryInterface::class, FarmerRepository::class);
        $this->app->bind(FarmRepositoryInterface::class, FarmRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
