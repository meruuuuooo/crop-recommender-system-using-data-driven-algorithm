<?php

namespace App\Http\Controllers;

use App\Http\Requests\Management\FarmerFarmRequest;
use App\Http\Requests\Management\FarmerRequest;
use App\Models\Barangay;
use App\Models\Farmer;
use App\Models\Location;
use App\Models\Municipality;
use App\Models\Province;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Farm;
use App\Models\Crop;
use Exception;
use Illuminate\Support\Facades\DB;

class FarmerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 6);

        $farmers = Farmer::with([
            'location.province',
            'location.municipality',
            'location.barangay',
            'user:id,lastname,email',
        ])
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('firstname', 'like', "%{$search}%")
                        ->orWhere('lastname', 'like', "%{$search}%")
                        ->orWhere('middlename', 'like', "%{$search}%")
                        ->orWhere('contact_number', 'like', "%{$search}%")
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

        $province = Province::all();
        $municipality = Municipality::all();
        $barangay = Barangay::all();

        $crops = Crop::all(['id', 'name']);

        return Inertia::render('management/farmer/index', [
            'farmers' => $farmers,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
            'provinces' => $province,
            'municipalities' => $municipality,
            'barangays' => $barangay,
            'crops' => $crops,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {

    //     $province = Province::all();
    //     $municipality = Municipality::all();
    //     $barangay = Barangay::all();

    //     return Inertia::render('management/farmer/create', [
    //         'provinces' => $province,
    //         'municipalities' => $municipality,
    //         'barangays' => $barangay,
    //     ]);
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FarmerFarmRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            $farmerLocation = Location::create([
                'province_id' => $validated['farmer']['province_id'],
                'municipality_id' => $validated['farmer']['municipality_id'],
                'barangay_id' => $validated['farmer']['barangay_id'],
                'street' => $validated['farmer']['street'] ?? null,
            ]);

            $farmer = Farmer::create([
                'firstname' => $validated['farmer']['firstname'],
                'middlename' => $validated['farmer']['middlename'] ?? null,
                'lastname' => $validated['farmer']['lastname'],
                'contact_number' => $validated['farmer']['contact_number'],
                'farming_experience' => $validated['farmer']['farming_experience'],
                'location_id' => $farmerLocation->id,
                'user_id' => Auth::id(),
                'registration_date' => now(), // Set registration date to current date
            ]);

            $farmLocation = Location::create([
                'province_id' => $validated['farm']['province_id'],
                'municipality_id' => $validated['farm']['municipality_id'],
                'barangay_id' => $validated['farm']['barangay_id'],
                'street' => $validated['farm']['street'] ?? null,
            ]);

            Farm::create([
                'name' => $validated['farm']['name'],
                'total_area' => $validated['farm']['total_area'] ?? null,
                'prev_crops' => $validated['farm']['prev_crops'] ?? null,
                'location_id' => $farmLocation->id,
                'farmer_id' => $farmer->id,
            ]);

            DB::commit();
            return redirect()->route('management.farmer.index')->with('success', 'Farmer created successfully.');
        } catch (Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['general' => 'Failed to create farmer and farm: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Farmer $farmer)
    {
        $farmer->load([
            'location.province',
            'location.municipality',
            'location.barangay',
            'user:id,lastname,email',
        ]);

        return Inertia::render('management/farmer/view', [
            'farmer' => $farmer,
        ]);
    }

    /**
     * Show the farms owned by the specified farmer.
     */
    // public function showFarms(Farmer $farmer, Request $request)
    // {

    //     $search = $request->get('search');
    //     $perPage = $request->get('per_page', 10);

    //     $farms = Farm::with('location', 'farmer:id,firstname,lastname')
    //         ->where('farmer_id', $farmer->id)
    //         ->when(request('search'), function ($query, $search) {
    //             $query->where('name', 'like', "%{$search}%")
    //                 ->orWhere('size', 'like', "%{$search}%")
    //                 ->orWhereHas('location.province', function ($q) use ($search) {
    //                     $q->where('name', 'like', "%{$search}%");
    //                 })
    //                 ->orWhereHas('location.municipality', function ($q) use ($search) {
    //                     $q->where('name', 'like', "%{$search}%");
    //                 })
    //                 ->orWhereHas('location.barangay', function ($q) use ($search) {
    //                     $q->where('name', 'like', "%{$search}%");
    //                 });
    //         })->orderBy('created_at', 'desc')
    //         ->paginate(5)
    //         ->withQueryString();

    //     return Inertia::render('management/farmer/partials/viewFarmFarmerTable', [
    //         'farms' => $farms,
    //         'filters' => [
    //             'search' => $search,
    //             'per_page' => $perPage,
    //         ],
    //     ]);
    // }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Farmer $farmer)
    {
        $provinces = Province::all();
        $municipalities = Municipality::all();
        $barangays = Barangay::all();

        $farmer->load([
            'location.province',
            'location.municipality',
            'location.barangay',
            'user:id,lastname,email',
        ]);

        return Inertia::render('management/farmer/edit', [
            'farmer' => $farmer,
            'provinces' => $provinces,
            'municipalities' => $municipalities,
            'barangays' => $barangays,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FarmerRequest $request, Farmer $farmer): RedirectResponse
    {
        $validated = $request->validated();
        $location = Location::create([
            'province_id' => $validated['province_id'],
            'municipality_id' => $validated['municipality_id'],
            'barangay_id' => $validated['barangay_id'],
            'street' => $validated['street'],
        ]);
        $farmer->update([
            'firstname' => $validated['firstname'],
            'middlename' => $validated['middlename'],
            'lastname' => $validated['lastname'],
            'contact_number' => $validated['contact_number'],
            'farming_experience' => $validated['farming_experience'],
            'location_id' => $location->id,
        ]);
        return redirect()->route('management.farmer.index')->with('success', 'Farmer updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    // public function destroy(farmer $farmer)
    // {
    //     try {
    //         $farmer->delete();
    //         return redirect()->route('management.farmer.index')->with('success', 'Farmer deleted successfully.');
    //     } catch (\Exception $e) {
    //         return redirect()->route('management.farmer.index')->with('error', 'Failed to delete farmer.');
    //     }
    // }
}
