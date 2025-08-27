<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Soil;
use App\Models\Climate;
use App\Models\Recommendation;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('reports/index');
    }

}
