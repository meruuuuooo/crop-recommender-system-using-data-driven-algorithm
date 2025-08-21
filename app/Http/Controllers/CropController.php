<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Crop;
use App\Models\Category;
use App\Models\Variety;

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
                  ->orWhere('season', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
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
                'per_page' => $perPage
            ]
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
            'season' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $crop = Crop::create([
            'name' => $validated['name'],
            'season' => $validated['season'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'],
        ]);

        $crop->save();


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
            'season' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $crop->update([
            'name' => $validated['name'],
            'season' => $validated['season'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'],
        ]);

        return redirect()->route('management.crop.index')->with('success', 'Crop updated successfully.');
    }

}
