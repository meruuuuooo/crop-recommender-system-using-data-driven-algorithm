<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecommendationController extends Controller
{
    public function crop(Request $request)
    {
        return Inertia::render('recommendation/crop');
    }

    public function fertilizer(Request $request)
    {
        return Inertia::render('recommendation/fertilizer');
    }

    public function pesticide(Request $request)
    {
        return Inertia::render('recommendation/pesticide');
    }
}
