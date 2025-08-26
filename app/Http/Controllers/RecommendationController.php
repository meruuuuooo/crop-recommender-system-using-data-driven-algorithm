<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Farmer;
use App\Models\Fertilizer;
use App\Models\Pesticide;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecommendationController extends Controller
{
    public function crop(Request $request)
    {

        $farmers = Farmer::all();

        return Inertia::render('recommendation/crop', [
            'farmers' => $farmers,
        ]);
    }

    public function fertilizer(Request $request)
    {
        $search = $request->get('search', '');
        $perPage = $request->get('per_page', 10);

        $query = Fertilizer::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'LIKE', "%{$search}%")
                    ->orWhere('company', 'LIKE', "%{$search}%")
                    ->orWhere('type_of_product', 'LIKE', "%{$search}%")
                    ->orWhere('target_crops', 'LIKE', "%{$search}%")
                    ->orWhere('registration_number', 'LIKE', "%{$search}%");
            });
        }

        $fertilizers = $query->paginate($perPage)->withQueryString();

        // $crops = Crop::with('category')->get();

        $categories = Category::with('crops')->get();

        return Inertia::render('recommendation/fertilizer', [
            'fertilizers' => $fertilizers,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
            'categories' => $categories,
        ]);
    }

    public function showFertilizer(Request $request, $fertilizer)
    {
        $fertilizer = Fertilizer::findOrFail($fertilizer);

        return Inertia::render('recommendation/showFertilizer', [
            'fertilizer' => $fertilizer,
        ]);
    }

    public function pesticide(Request $request)
    {
        $search = $request->get('search', '');
        $cropSearch = $request->get('crop_search', '');
        $pestSearch = $request->get('pest_search', '');
        $weedSearch = $request->get('weed_search', '');
        $diseaseSearch = $request->get('disease_search', '');
        $toxicitySearch = $request->get('toxicity_search', '');
        $pesticideSearch = $request->get('pesticide_search', '');
        $perPage = $request->get('per_page', 12);

        $query = Pesticide::query();

        // General search
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'LIKE', "%{$search}%")
                    ->orWhere('active_ingredient', 'LIKE', "%{$search}%")
                    ->orWhere('registration_number', 'LIKE', "%{$search}%");
            });
        }

        // Specific field searches
        if ($cropSearch) {
            $query->where('crops', 'LIKE', "%{$cropSearch}%");
        }

        if ($pestSearch) {
            $query->where('pests', 'LIKE', "%{$pestSearch}%");
        }

        if ($weedSearch) {
            $query->where('weeds', 'LIKE', "%{$weedSearch}%");
        }

        if ($diseaseSearch) {
            $query->where('diseases', 'LIKE', "%{$diseaseSearch}%");
        }

        if ($toxicitySearch) {
            $query->where('toxicity_category', 'LIKE', "%{$toxicitySearch}%");
        }

        if ($pesticideSearch) {
            $query->where('uses', 'LIKE', "%{$pesticideSearch}%");
        }

        $pesticides = $query->paginate($perPage)->withQueryString();

        return Inertia::render('recommendation/pesticide', [
            'pesticides' => $pesticides,
            'filters' => [
                'search' => $search,
                'crop_search' => $cropSearch,
                'pest_search' => $pestSearch,
                'weed_search' => $weedSearch,
                'disease_search' => $diseaseSearch,
                'toxicity_search' => $toxicitySearch,
                'pesticide_search' => $pesticideSearch,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function showPesticide(Request $request, $pesticide)
    {
        $pesticide = Pesticide::findOrFail($pesticide);

        return Inertia::render('recommendation/showPesticide', [
            'pesticide' => $pesticide,
        ]);
    }
}
