<?php
namespace App\Http\Requests\Management;
use Illuminate\Foundation\Http\FormRequest;

class FarmerFarmRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Farmer fields
            'farmer.firstname' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z\s\-]+$/'],
            'farmer.middlename' => ['nullable', 'string', 'max:50', 'regex:/^[a-zA-Z\s\-]+$/'],
            'farmer.lastname' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z\s\-]+$/'],
            'farmer.contact_number' => ['required', 'string', 'max:15', 'regex:/^[\+]?[0-9\s]+$/'],
            'farmer.farming_experience' => ['required', 'numeric'],
            'farmer.street' => ['required', 'string', 'max:60'], // Made required to match frontend
            'farmer.province_id' => ['required', 'exists:provinces,id'],
            'farmer.municipality_id' => ['required', 'exists:municipalities,id'],
            'farmer.barangay_id' => ['required', 'exists:barangays,id'],
            // Farm fields
            'farm.name' => ['required', 'string', 'max:30'],
            'farm.total_area' => ['nullable', 'numeric'],
            'farm.cropping_system' => ['required', 'string', 'max:30'],
            'farm.prev_crops' => ['nullable', 'string'],
            'farm.street' => ['nullable', 'string', 'max:60'],
            'farm.province_id' => ['required', 'exists:provinces,id'],
            'farm.municipality_id' => ['required', 'exists:municipalities,id'],
            'farm.barangay_id' => ['required', 'exists:barangays,id'],
        ];
    }
}
