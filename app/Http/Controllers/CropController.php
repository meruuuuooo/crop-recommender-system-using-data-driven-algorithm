<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Crop;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CropController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);

        $crops = Crop::with('category')
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('crop_season', 'like', "%{$search}%")
                        ->orWhere('soil_type', 'like', "%{$search}%")
                        ->orWhere('time_of_planting', 'like', "%{$search}%")
                        ->orWhere('plant_population_per_hectare', 'like', "%{$search}%")
                        ->orWhere('maturity', 'like', "%{$search}%")
                        ->orWhere('volume_of_production', 'like', "%{$search}%")
                        ->orWhere('distance_of_planting_hills', 'like', "%{$search}%")
                        ->orWhere('distance_of_planting_rows', 'like', "%{$search}%")
                        ->orWhere('yield_per_hectare', 'like', "%{$search}%")
                        ->orWhereHas('category', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('management/crop/index', [
            'crops' => $crops,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        $categories = Category::all();

        return Inertia::render('management/crop/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'crop_season' => 'required|string|max:255',
            'soil_type' => 'nullable|string|max:255',
            'time_of_planting' => 'required|string|max:255',
            'plant_population_per_hectare' => 'nullable|string|max:255',
            'maturity' => 'required|string|max:255',
            'volume_of_production' => 'nullable|string|max:255',
            'distance_of_planting_hills' => 'nullable|string|max:255',
            'distance_of_planting_rows' => 'nullable|string|max:255',
            'yield_per_hectare' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        $crop = Crop::create([
            'name' => $validated['name'],
            'crop_season' => $validated['crop_season'],
            'soil_type' => $validated['soil_type'] ?? null,
            'time_of_planting' => $validated['time_of_planting'],
            'plant_population_per_hectare' => $validated['plant_population_per_hectare'] ?? null,
            'maturity' => $validated['maturity'],
            'volume_of_production' => $validated['volume_of_production'] ?? null,
            'distance_of_planting_hills' => $validated['distance_of_planting_hills'] ?? null,
            'distance_of_planting_rows' => $validated['distance_of_planting_rows'] ?? null,
            'yield_per_hectare' => $validated['yield_per_hectare'],
            'category_id' => $validated['category_id'],
        ]);

        return redirect()->route('management.crop.index')->with('success', 'Crop created successfully.');
    }

    public function show(Crop $crop)
    {
        return Inertia::render('management/crop/show', [
            'crop' => $crop->load('category'),
        ]);
    }

    public function edit(Crop $crop)
    {
        $categories = Category::all();

        return Inertia::render('management/crop/edit', [
            'crop' => $crop->load('category'),
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Crop $crop)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'crop_season' => 'required|string|max:255',
            'soil_type' => 'nullable|string|max:255',
            'time_of_planting' => 'required|string|max:255',
            'plant_population_per_hectare' => 'nullable|string|max:255',
            'maturity' => 'required|string|max:255',
            'volume_of_production' => 'nullable|string|max:255',
            'distance_of_planting_hills' => 'nullable|string|max:255',
            'distance_of_planting_rows' => 'nullable|string|max:255',
            'yield_per_hectare' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        $crop->update([
            'name' => $validated['name'],
            'crop_season' => $validated['crop_season'],
            'soil_type' => $validated['soil_type'] ?? null,
            'time_of_planting' => $validated['time_of_planting'],
            'plant_population_per_hectare' => $validated['plant_population_per_hectare'] ?? null,
            'maturity' => $validated['maturity'],
            'volume_of_production' => $validated['volume_of_production'] ?? null,
            'distance_of_planting_hills' => $validated['distance_of_planting_hills'] ?? null,
            'distance_of_planting_rows' => $validated['distance_of_planting_rows'] ?? null,
            'yield_per_hectare' => $validated['yield_per_hectare'],
            'category_id' => $validated['category_id'],
        ]);

        return redirect()->route('management.crop.index')->with('success', 'Crop updated successfully.');
    }
}
