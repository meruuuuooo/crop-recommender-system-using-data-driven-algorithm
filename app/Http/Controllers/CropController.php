<?php

namespace App\Http\Controllers;

use App\Http\Requests\management\CropRequest;
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
                        ->orWhere('maturity', 'like', "%{$search}%")
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

    public function store(CropRequest $request)
    {
        $validated = $request->validated();

        Crop::create([
            'name' => $validated['name'],
            'soil_type' => $validated['soil_type'] ?? null,
            'time_of_planting' => $validated['time_of_planting'] ?? null,
            'maturity' => $validated['maturity'] ?? null,
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

    // public function cropCalendar()
    // {



    //     return Inertia::render('cropCalendar', [
    //         'crops' => Crop::all(),
    //     ]);
    // }

    public function edit(Crop $crop)
    {
        $categories = Category::all();

        return Inertia::render('management/crop/edit', [
            'crop' => $crop->load('category'),
            'categories' => $categories,
        ]);
    }

    public function update(CropRequest $request, Crop $crop)
    {
        $validated = $request->validated();

        $crop->update([
            'name' => $validated['name'],
            'soil_type' => $validated['soil_type'] ?? null,
            'time_of_planting' => $validated['time_of_planting'] ?? null,
            'maturity' => $validated['maturity'] ?? null,
            'category_id' => $validated['category_id'],
        ]);

        return redirect()->route('management.crop.index')->with('success', 'Crop updated successfully.');
    }
}
