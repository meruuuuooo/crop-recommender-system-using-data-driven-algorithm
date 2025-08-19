<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use App\Models\Farmer;
use App\Models\Location;
use App\Models\Province;
use App\Models\Municipality;
use App\Models\Barangay;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FarmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $farms = Farm::with([
            'location.province',
            'location.municipality',
            'location.barangay',
            'farmer' => function ($query) {
                $query->select('id', 'last_name', 'first_name', 'middle_name', 'contact_number');
            }
        ])
            ->orderBy('created_at', 'desc')
            ->paginate(10);


        return Inertia::render('management/farm/index', [
            'farms' => $farms,
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
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'total_area' => 'required|numeric|min:0',
            'prev_crops' => 'nullable|string|max:255',
            'farmer_id' => 'required|exists:farmers,id',
            'province_id' => 'required|exists:provinces,id',
            'municipality_id' => 'required|exists:municipalities,id',
            'barangay_id' => 'required|exists:barangays,id',
        ]);

        $location = Location::create([
            'province_id' => $request->province_id,
            'municipality_id' => $request->municipality_id,
            'barangay_id' => $request->barangay_id,
        ]);

        $farm = Farm::create([
            'name' => $request->name,
            'total_area' => $request->total_area,
            'prev_crops' => $request->prev_crops,
            'farmer_id' => $request->farmer_id,
            'location_id' => $location->id,
        ]);

        $farm->save();

        return redirect()->route('management.farm.create')->with('success', 'Farm created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Farm $farm)
    {
        $farm = Farm::with(['location', 'farmer'])->findOrFail($farm->id);

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
            'farmer'
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
    public function update(Request $request, Farm $farm)
    {
        // $request->validate([
        //     'name' => 'required|string|max:255',
        //     'total_area' => 'required|numeric|min:0',
        //     'prev_crops' => 'nullable|string|max:255',
        //     'farmer_id' => 'required|exists:farmers,id',
        //     'province_id' => 'required|exists:provinces,id',
        //     'municipality_id' => 'required|exists:municipalities,id',
        //     'barangay_id' => 'required|exists:barangays,id',
        // ]);

        // // Update or create location
        // if ($farm->location) {
        //     $farm->location->update([
        //         'province_id' => $request->province_id,
        //         'municipality_id' => $request->municipality_id,
        //         'barangay_id' => $request->barangay_id,
        //     ]);
        // } else {
        //     $location = Location::create([
        //         'province_id' => $request->province_id,
        //         'municipality_id' => $request->municipality_id,
        //         'barangay_id' => $request->barangay_id,
        //     ]);
        //     $farm->location_id = $location->id;
        // }

        // // Update farm
        // $farm->update([
        //     'name' => $request->name,
        //     'total_area' => $request->total_area,
        //     'prev_crops' => $request->prev_crops,
        //     'farmer_id' => $request->farmer_id,
        // ]);

        // return redirect()->route('management.farm.index')->with('success', 'Farm updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Farm $farm)
    {
        //
    }
}
