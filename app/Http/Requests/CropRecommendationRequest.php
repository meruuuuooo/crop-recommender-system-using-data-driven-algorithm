<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CropRecommendationRequest extends FormRequest
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
            'farmer_id' => 'required|exists:farmers,id',
            'soilType' => 'required|string|in:sand,Sandy loam,loam,Silt Loam,Clay Loam, Clay',
            'nitrogen_level' => 'required|string|in:very_low,low,medium,high,very_high',
            'potassium_level' => 'required|string|in:very_low,low,medium,high,very_high',
            'phosphorus_level' => 'required|string|in:very_low,low,medium,high,very_high',
            'ph_level' => 'required|numeric|min:0|max:14',
            'temperature' => 'required|numeric|min:-10|max:50',
            'rainfall' => 'required|numeric|min:0|max:1000',
            'humidity' => 'required|numeric|min:0|max:100',
        ];
    }


    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'farmer_id.required' => 'Please select a farmer.',
            'farmer_id.exists' => 'The selected farmer is invalid.',
            'soilType.required' => 'Please select a soil type.',
            'soilType.in' => 'Please select a valid soil type.',
            'nitrogen_level.required' => 'Please select nitrogen level.',
            'potassium_level.required' => 'Please select potassium level.',
            'phosphorus_level.required' => 'Please select phosphorus level.',
            'ph_level.required' => 'Please enter pH level.',
            'ph_level.min' => 'pH level must be between 0 and 14.',
            'ph_level.max' => 'pH level must be between 0 and 14.',
            'temperature.required' => 'Please enter temperature.',
            'rainfall.required' => 'Please enter rainfall amount.',
            'humidity.required' => 'Please enter humidity level.',
        ];
    }
}
