<?php

namespace App\Http\Controllers;

use App\Http\Requests\Management\FarmerFarmRequest;
use App\Models\Barangay;
use App\Models\Farm;
use App\Models\Farmer;
use App\Models\Location;
use App\Models\Municipality;
use App\Models\Province;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RegisteredFarmerController extends Controller
{
    public function registration()
    {
        $provinces = Province::all();
        $municipalities = Municipality::all();
        $barangays = Barangay::all();

        return Inertia::render('registration', [
            'provinces' => $provinces,
            'municipalities' => $municipalities,
            'barangays' => $barangays,
        ]);
    }

    public function store(FarmerFarmRequest $request)
    {
        $validated = $request->validated();
        try {
            DB::beginTransaction();

            // Create farmer location
            $farmerLocation = Location::create([
                'province_id' => $validated['farmer.province_id'],
                'municipality_id' => $validated['farmer.municipality_id'],
                'barangay_id' => $validated['farmer.barangay_id'],
                'street' => $validated['farmer.street'],
            ]);

            // Create farmer
            $farmer = Farmer::create([
                'firstname' => $validated['farmer.firstname'],
                'middlename' => $validated['farmer.middlename'],
                'lastname' => $validated['farmer.lastname'],
                'contact_number' => $validated['farmer.contact_number'],
                'farming_experience' => $validated['farmer.farming_experience'],
                'registration_date' => $validated['farmer.registration_date'],
                'location_id' => $farmerLocation->id,
                'user_id' => Auth::id(),
            ]);

            // Create farm location
            $farmLocation = Location::create([
                'province_id' => $validated['farm.province_id'],
                'municipality_id' => $validated['farm.municipality_id'],
                'barangay_id' => $validated['farm.barangay_id'],
                'street' => null, // Farm doesn't have street field in this form
            ]);

            // Create farm
            Farm::create([
                'name' => $validated['farm.name'],
                'total_area' => $validated['farm.total_area'],
                'prev_crops' => $validated['farm.prev_crops'],
                'farmer_id' => $farmer->id,
                'location_id' => $farmLocation->id,
            ]);

            DB::commit();

            return redirect()->route('recommendation.crop')->with('success', 'Farmer and farm registered successfully!');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['general' => 'An error occurred while registering. Please try again.']);
        }
    }
}
