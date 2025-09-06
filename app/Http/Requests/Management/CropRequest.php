<?php

namespace App\Http\Requests\management;

use Illuminate\Foundation\Http\FormRequest;

class CropRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:30', 'unique:crops,name,' . $this->route('crop')],
            'category_id' => ['required', 'exists:categories,id'],
            'crop_season' => ['required', 'string', 'max:30'],
            'soil_type' => ['nullable', 'string', 'max:30'],
            'time_of_planting' => ['nullable', 'string', 'max:30'],
            'maturity' => ['nullable', 'string', 'max:30'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Crop name is required.',
            'name.unique' => 'Crop name must be unique.',
            'category_id.required' => 'Category is required.',
            'crop_season.required' => 'Crop season is required.',
        ];
    }
}
