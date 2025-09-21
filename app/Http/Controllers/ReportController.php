<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Soil;
use App\Models\Climate;
use App\Models\Recommendation;
use App\Models\Farm;
use App\Models\Farmer;
use App\Models\Crop;
use App\Models\Location;
use App\Models\Province;
use App\Models\Municipality;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{

    public function index()
    {
        return Inertia::render('reports/index');
    }

    public function report1(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);

        $farms = Farm::with([
            'farmer' => function ($query) {
                $query->select('id', 'firstname', 'middlename', 'lastname');
            },
            'soils' => function ($query) {
                $query->orderBy('test_date', 'desc');
            }
        ])
        ->whereHas('soils')
        ->when($search, function ($query, $search) {
            return $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('farmer', function ($q) use ($search) {
                        $q->where('firstname', 'like', "%{$search}%")
                            ->orWhere('lastname', 'like', "%{$search}%")
                            ->orWhere('middlename', 'like', "%{$search}%");
                    });
            });
        })
        ->orderBy('name')
        ->paginate($perPage)
        ->withQueryString();

        return Inertia::render('reports/report1', [
            'farms' => $farms,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function report2(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);

        $farms = Farm::with([
            'farmer' => function ($query) {
                $query->select('id', 'firstname', 'middlename', 'lastname');
            },
            'location.province',
            'location.municipality',
            'location.barangay',
            'climates' => function ($query) {
                $query->orderBy('climate_record_date', 'desc');
            }
        ])
        ->whereHas('climates')
        ->when($search, function ($query, $search) {
            return $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('farmer', function ($q) use ($search) {
                        $q->where('firstname', 'like', "%{$search}%")
                            ->orWhere('lastname', 'like', "%{$search}%")
                            ->orWhere('middlename', 'like', "%{$search}%");
                    })
                    ->orWhereHas('location.province', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('location.municipality', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('location.barangay', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        })
        ->orderBy('name')
        ->paginate($perPage)
        ->withQueryString();

        return Inertia::render('reports/report2', [
            'farms' => $farms,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    // Report 3: Shows all farms owned by a specific farmer, including location and size details
    public function report3(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 20);
        $farmerId = $request->get('farmer_id');

        $farmers = Farmer::select('id', 'firstname', 'middlename', 'lastname')->get();

        $farms = Farm::with([
            'farmer' => function ($query) {
                $query->select('id', 'firstname', 'middlename', 'lastname');
            },
            'location.province',
            'location.municipality',
            'location.barangay'
        ])
        ->when($farmerId, function ($query, $farmerId) {
            return $query->where('farmer_id', $farmerId);
        })
        ->when($search, function ($query, $search) {
            return $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('total_area', 'like', "%{$search}%")
                    ->orWhereHas('farmer', function ($q) use ($search) {
                        $q->where('firstname', 'like', "%{$search}%")
                            ->orWhere('lastname', 'like', "%{$search}%")
                            ->orWhere('middlename', 'like', "%{$search}%");
                    })
                    ->orWhereHas('location.province', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('location.municipality', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('location.barangay', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        })
        ->orderBy('name')
        ->paginate($perPage)
        ->withQueryString();

        return Inertia::render('reports/report3', [
            'farms' => $farms,
            'farmers' => $farmers,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'farmer_id' => $farmerId,
            ],
        ]);
    }

    // Report 4: Lists crop recommendations for farms in a specific location
    public function report4(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);
        $provinceId = $request->get('province_id');
        $municipalityId = $request->get('municipality_id');

        $provinces = Province::select('id', 'name')->get();
        $municipalities = $provinceId ?
            Municipality::where('province_id', $provinceId)->select('id', 'name')->get() :
            collect();

        $recommendations = Recommendation::with([
            'farmer' => function ($query) {
                $query->select('id', 'firstname', 'middlename', 'lastname');
            },
            'farm.location.province',
            'farm.location.municipality',
            'farm.location.barangay',
            'crop'
        ])
        ->whereHas('farm.location', function ($query) use ($provinceId, $municipalityId) {
            if ($provinceId) {
                $query->where('province_id', $provinceId);
            }
            if ($municipalityId) {
                $query->where('municipality_id', $municipalityId);
            }
        })
        ->when($search, function ($query, $search) {
            return $query->where(function ($q) use ($search) {
                $q->whereHas('farm', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('crop', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('farmer', function ($q) use ($search) {
                    $q->where('firstname', 'like', "%{$search}%")
                        ->orWhere('lastname', 'like', "%{$search}%")
                        ->orWhere('middlename', 'like', "%{$search}%");
                });
            });
        })
        ->orderBy('recommendation_date', 'desc')
        ->paginate($perPage)
        ->withQueryString();

        return Inertia::render('reports/report4', [
            'recommendations' => $recommendations,
            'provinces' => $provinces,
            'municipalities' => $municipalities,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'province_id' => $provinceId,
                'municipality_id' => $municipalityId,
            ],
        ]);
    }

    // Report 5: Details crop recommendations tailored to soil and climate conditions on farms
    public function report5(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);

        $recommendations = Recommendation::with([
            'farmer' => function ($query) {
                $query->select('id', 'firstname', 'middlename', 'lastname');
            },
            'farm' => function ($query) {
                $query->with([
                    'soils' => function ($query) {
                        $query->orderBy('test_date', 'desc')->limit(1);
                    },
                    'climates' => function ($query) {
                        $query->orderBy('climate_record_date', 'desc')->limit(1);
                    }
                ]);
            },
            'crop'
        ])
        ->whereHas('farm.soils')
        ->whereHas('farm.climates')
        ->when($search, function ($query, $search) {
            return $query->where(function ($q) use ($search) {
                $q->whereHas('farm', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('crop', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('farmer', function ($q) use ($search) {
                    $q->where('firstname', 'like', "%{$search}%")
                        ->orWhere('lastname', 'like', "%{$search}%")
                        ->orWhere('middlename', 'like', "%{$search}%");
                });
            });
        })
        ->orderBy('recommendation_date', 'desc')
        ->paginate($perPage)
        ->withQueryString();

        return Inertia::render('reports/report5', [
            'recommendations' => $recommendations,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }


    // Report 7: Lists Farms with Specific Soil Types and Their Recommended Crops
    public function report7(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);
        $soilType = $request->get('soil_type');

        $soilTypes = Soil::distinct()->pluck('soil_type')->filter()->sort()->values();

        $farms = Farm::with([
            'farmer' => function ($query) {
                $query->select('id', 'firstname', 'middlename', 'lastname');
            },
            'soils' => function ($query) use ($soilType) {
                $query->when($soilType, function ($q, $soilType) {
                    return $q->where('soil_type', $soilType);
                })->orderBy('test_date', 'desc');
            },
            'recommendations.crop'
        ])
        ->whereHas('soils', function ($query) use ($soilType) {
            if ($soilType) {
                $query->where('soil_type', $soilType);
            }
        })
        ->when($search, function ($query, $search) {
            return $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('farmer', function ($q) use ($search) {
                        $q->where('firstname', 'like', "%{$search}%")
                            ->orWhere('lastname', 'like', "%{$search}%")
                            ->orWhere('middlename', 'like', "%{$search}%");
                    });
            });
        })
        ->orderBy('name')
        ->paginate($perPage)
        ->withQueryString();

        return Inertia::render('reports/report7', [
            'farms' => $farms,
            'soilTypes' => $soilTypes,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'soil_type' => $soilType,
            ],
        ]);
    }
}
