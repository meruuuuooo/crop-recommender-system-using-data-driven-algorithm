<?php

namespace App\Http\Controllers;

use App\Models\farmer;
use App\Http\Controllers\Controller;
use App\Models\Province;
use App\Models\Municipality;
use App\Models\Barangay;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FarmerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);

        $farmers = farmer::with([
            'location.province',
            'location.municipality',
            'location.barangay',
            'user:id,last_name,email'
        ])
        ->when($search, function ($query, $search) {
            return $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('middle_name', 'like', "%{$search}%")
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

        return Inertia::render('management/farmer/index', [
            'farmers' => $farmers,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage
            ]
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

        return Inertia::render('management/farmer/create', [
            'provinces' => $province,
            'municipalities' => $municipality,
            'barangays' => $barangay
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // To view all request data
        // dd($request->all());

        $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'contact_number' => 'required|string|max:15',
            'farming_experience' => 'nullable|string|max:255',
            'street' => 'required|string|max:255',
            'province_id' => 'required|exists:provinces,id',
            'municipality_id' => 'required|exists:municipalities,id',
            'barangay_id' => 'required|exists:barangays,id'
        ]);

        $location = Location::create([
            'province_id' => $request->province_id,
            'municipality_id' => $request->municipality_id,
            'barangay_id' => $request->barangay_id,
            'street' => $request->street,
        ]);

        $user_id = Auth::user()->id;

        $farmer = farmer::create([
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'contact_number' => $request->contact_number,
            'farming_experience' => $request->farming_experience,
            'registration_date' => now(),
            'location_id' => $location->id,
            'user_id' => $user_id,
        ]);

        $farmer->save();

        return redirect()->route('management.farmer.index')->with('success', 'Farmer created successfully.');

    }

    /**
     * Display the specified resource.
     */
    public function show(farmer $farmer)
    {
        $farmer->load([
            'location.province',
            'location.municipality',
            'location.barangay',
            'user:id,last_name,email'
        ]);

        return Inertia::render('management/farmer/view', [
            'farmer' => $farmer
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(farmer $farmer)
    {
        $provinces = Province::all();
        $municipalities = Municipality::all();
        $barangays = Barangay::all();

        $farmer->load([
            'location.province',
            'location.municipality',
            'location.barangay',
            'user:id,last_name,email'
        ]);

        return Inertia::render('management/farmer/edit', [
            'farmer' => $farmer,
            'provinces' => $provinces,
            'municipalities' => $municipalities,
            'barangays' => $barangays
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, farmer $farmer)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'contact_number' => 'required|string|max:255',
            'farming_experience' => 'nullable|string|max:255',
            'province_id' => 'required|exists:provinces,id',
            'municipality_id' => 'required|exists:municipalities,id',
            'barangay_id' => 'required|exists:barangays,id',
            'street' => 'required|string|max:255',
        ]);

        // Store the old location ID for potential cleanup
        $oldLocationId = $farmer->location_id;

        // Create a new location for this farmer
        $location = Location::create([
            'province_id' => $request->province_id,
            'municipality_id' => $request->municipality_id,
            'barangay_id' => $request->barangay_id,
            'street' => $request->street,
        ]);

        // Update farmer
        $farmer->update([
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'contact_number' => $request->contact_number,
            'farming_experience' => $request->farming_experience,
            'location_id' => $location->id,
        ]);

        // Check if the old location is still being used by other farmers
        // If not, delete it to prevent orphaned records
        if ($oldLocationId) {
            $otherFarmersWithSameLocation = farmer::where('location_id', $oldLocationId)
                ->where('id', '!=', $farmer->id)
                ->count();
            
            if ($otherFarmersWithSameLocation === 0) {
                Location::find($oldLocationId)?->delete();
            }
        }

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
