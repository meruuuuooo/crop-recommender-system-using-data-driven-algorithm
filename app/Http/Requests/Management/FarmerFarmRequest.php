<?php

namespace App\Http\Requests\Management;

use Illuminate\Foundation\Http\FormRequest;

class FarmerFarmRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Farmer validation rules
            'farmer.firstname' => 'required|string|max:255',
            'farmer.middlename' => 'nullable|string|max:255',
            'farmer.lastname' => 'required|string|max:255',
            'farmer.contact_number' => 'required|string|max:20',
            'farmer.farming_experience' => 'required|integer|min:0|max:80',
            'farmer.registration_date' => 'required|date',
            'farmer.province_id' => 'required|exists:provinces,id',
            'farmer.municipality_id' => 'required|exists:municipalities,id',
            'farmer.barangay_id' => 'required|exists:barangays,id',
            'farmer.street' => 'required|string|max:255',

            // Farm validation rules
            'farm.name' => 'required|string|max:255',
            'farm.total_area' => 'required|numeric|min:0.01|max:1000',
            'farm.prev_crops' => 'nullable|string|max:500',
            'farm.province_id' => 'required|exists:provinces,id',
            'farm.municipality_id' => 'required|exists:municipalities,id',
            'farm.barangay_id' => 'required|exists:barangays,id',
        ];
    }
}
