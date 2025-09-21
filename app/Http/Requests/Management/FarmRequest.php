<?php

namespace App\Http\Requests\Management;

use Illuminate\Foundation\Http\FormRequest;

class FarmRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:30'],
            'total_area' => ['nullable', 'numeric'],
            'cropping_system' => ['nullable', 'string', 'max:30'],
            'prev_crops' => ['nullable', 'string'],
            'farmer_id' => ['required', 'exists:farmers,id'],
            'province_id' => ['required', 'exists:provinces,id'],
            'municipality_id' => ['required', 'exists:municipalities,id'],
            'barangay_id' => ['required', 'exists:barangays,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Farm name is required.',
            'total_area.required' => 'Total area is required.',
            'cropping_system.max' => 'Cropping system may not be greater than 30 characters.',
            'prev_crops.max' => 'Previous crops may not be greater than 30 characters.',
            'farmer_id.required' => 'Farmer is required.',
            'province_id.required' => 'Province is required.',
            'municipality_id.required' => 'Municipality is required.',
            'barangay_id.required' => 'Barangay is required.',
        ];
    }

}
