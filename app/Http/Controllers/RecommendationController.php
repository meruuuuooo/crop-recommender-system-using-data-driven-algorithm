<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Fertilizer;

class RecommendationController extends Controller
{
    public function crop(Request $request)
    {
        return Inertia::render('recommendation/crop');
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

        return Inertia::render('recommendation/fertilizer', [
            'fertilizers' => $fertilizers,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    Public function showFertilizer(Request $request, $fertilizer)
    {
        $fertilizer = Fertilizer::findOrFail($fertilizer);

        return Inertia::render('recommendation/showFertilizer', [
            'fertilizer' => $fertilizer,
        ]);
    }

    public function pesticide(Request $request)
    {
        return Inertia::render('recommendation/pesticide');
    }
}
