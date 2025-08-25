<?php

namespace App\Http\Requests\Management;

use Illuminate\Foundation\Http\FormRequest;

class FarmerRequest extends FormRequest
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
            'firstname' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'middlename' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['required', 'string', 'max:15'],
            'street' => ['required', 'string', 'max:255'],
            'farming_experience' => ['nullable', 'numeric'],
            'province_id' => ['required', 'exists:provinces,id'],
            'municipality_id' => ['required', 'exists:municipalities,id'],
            'barangay_id' => ['required', 'exists:barangays,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'firstname.required' => 'First name is required.',
            'lastname.required' => 'Last name is required.',
            'contact_number.required' => 'Contact number is required.',
            'street.required' => 'Street address is required.',
            'province_id.required' => 'Province is required.',
            'municipality_id.required' => 'Municipality is required.',
            'barangay_id.required' => 'Barangay is required.',
        ];
    }
}
