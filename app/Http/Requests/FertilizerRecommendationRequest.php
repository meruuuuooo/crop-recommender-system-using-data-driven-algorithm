<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FertilizerRecommendationRequest extends FormRequest
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
            'crop_type' => 'nullable|string',
            'growth_stage' => 'nullable|string',
            'soil_type' => 'nullable|string|in:LIGHT SOILS,MED-HEAVY SOILS,HEAVY SOILS',
            'nitrogen_level' => 'required|string|in:low,medium,high',
            'phosphorus_level' => 'required|string|in:low,medium,high',
            'potassium_level' => 'required|string|in:low,medium,high',
        ];
    }

    /**
     * Get custom error messages for validation.
     */
    public function messages(): array
    {
        return [
            'nitrogen_level.required' => 'Nitrogen level is required.',
            'nitrogen_level.in' => 'Nitrogen level must be low, medium, or high.',
            'phosphorus_level.required' => 'Phosphorus level is required.',
            'phosphorus_level.in' => 'Phosphorus level must be low, medium, or high.',
            'potassium_level.required' => 'Potassium level is required.',
            'potassium_level.in' => 'Potassium level must be low, medium, or high.',
            'soil_type.in' => 'Soil type must be light, med-heavy, or heavy.',
        ];
    }
}
