<?php

namespace App\Http\Controllers;

use App\Http\Requests\Management\FarmRequest;
use App\Models\Barangay;
use App\Models\Farm;
use App\Models\Farmer;
use App\Models\Location;
use App\Models\Municipality;
use App\Models\Province;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FarmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);

        $farms = Farm::with([
            'location.province',
            'location.municipality',
            'location.barangay',
            'farmer' => function ($query) {
                $query->select('id', 'lastname', 'firstname', 'middlename', 'contact_number');
            },
        ])
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('prev_crops', 'like', "%{$search}%")
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
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('management/farm/index', [
            'farms' => $farms,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $province = Province::all();
        $municipality = Municipality::all();
        $barangay = Barangay::all();
        $farmer = Farmer::all();

        return Inertia::render('management/farm/create', [
            'provinces' => $province,
            'municipalities' => $municipality,
            'barangays' => $barangay,
            'farmers' => $farmer,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FarmRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $location = Location::create([
            'province_id' => $validated['province_id'],
            'municipality_id' => $validated['municipality_id'],
            'barangay_id' => $validated['barangay_id'],
        ]);

        $farmer_id = Farmer::find($validated['farmer_id']);

        Farm::create([
            'name' => $validated['name'],
            'total_area' => $validated['total_area'],
            'prev_crops' => $validated['prev_crops'],
            'farmer_id' => $farmer_id->id,
            'location_id' => $location->id,
        ]);

        return redirect()->route('management.farm.create')->with('success', 'Farm created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Farm $farm)
    {
        $farm = Farm::with([
            'location.province',
            'location.municipality',
            'location.barangay',
            'farmer' => function ($query) {
                $query->select('id', 'lastname', 'firstname', 'middlename', 'contact_number');
            },
        ])->findOrFail($farm->id);

        return Inertia::render('management/farm/view', [
            'farm' => $farm,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Farm $farm)
    {
        $provinces = Province::all();
        $municipalities = Municipality::all();
        $barangays = Barangay::all();
        $farmers = Farmer::all();

        $farm->load([
            'location.province',
            'location.municipality',
            'location.barangay',
            'farmer',
        ]);

        return Inertia::render('management/farm/edit', [
            'farm' => $farm,
            'provinces' => $provinces,
            'municipalities' => $municipalities,
            'barangays' => $barangays,
            'farmers' => $farmers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FarmRequest $request, Farm $farm): RedirectResponse
    {
        $validated = $request->validated();

        $location = Location::create([
            'province_id' => $validated['province_id'],
            'municipality_id' => $validated['municipality_id'],
            'barangay_id' => $validated['barangay_id'],
        ]);

        $farmer_id = Farmer::find($validated['farmer_id']);

        $farm->update([
            'name' => $validated['name'],
            'total_area' => $validated['total_area'],
            'prev_crops' => $validated['prev_crops'],
            'farmer_id' => $farmer_id->id,
            'location_id' => $location->id,
        ]);

        return redirect()->route('management.farm.index')->with('success', 'Farm updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Farm $farm)
    {
        //
    }







}
