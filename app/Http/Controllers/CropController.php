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

        $crops = Crop::with('category')->get();

        return Inertia::render('management/crop/index', [
            'crops' => $crops,
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
