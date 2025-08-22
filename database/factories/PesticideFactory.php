<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pesticide>
 */
class PesticideFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $companies = [
            'AGCHEM MANUFACTURING CORPORATION',
            'BAYER CROPSCIENCE PHILIPPINES INC.',
            'SYNGENTA PHILIPPINES INC.',
            'CORTEVA AGRISCIENCE PHILIPPINES',
            'BASF PHILIPPINES INC.',
            'FMC CORPORATION PHILIPPINES',
            'NUFARM PHILIPPINES INC.',
            'ADAMA PHILIPPINES INC.',
            'UPL PHILIPPINES INC.',
            'MONSANTO PHILIPPINES INC.',
        ];

        $activeIngredients = [
            'GLYPHOSATE',
            'LAMBDA-CYHALOTHRIN',
            'CYPERMETHRIN',
            'IMIDACLOPRID',
            'CHLORPYRIFOS',
            'MANCOZEB',
            'COPPER SULFATE',
            'BISPYRIBAC SODIUM',
            'ATRAZINE',
            'DIURON',
            'PENDIMETHALIN',
            'CARBENDAZIM',
            'TEBUCONAZOLE',
            'PROPICONAZOLE',
            '2,4-D AMINE',
        ];

        $formulationTypes = ['EC', 'SC', 'WP', 'SL', 'WG', 'DF', 'GR', 'FS', 'CS', 'SE'];
        $uses = ['HERBICIDE', 'INSECTICIDE', 'FUNGICIDE', 'NEMATICIDE', 'ACARICIDE', 'BACTERICIDE'];
        $toxicityCategories = ['IA', 'IB', 'II', 'III', 'U'];
        $modesOfEntry = ['Systemic', 'Contact', 'Selective (Post-Emergence)', 'Non-selective', 'Translocated'];

        $crops = [
            'Rice', 'Corn', 'Sugarcane', 'Coconut', 'Banana', 'Mango', 'Tomato', 'Cabbage',
            'Eggplant', 'Onion', 'Sweet Potato', 'Cassava', 'Peanut', 'Soybean', 'Coffee',
            'Cacao', 'Papaya', 'Pineapple', 'Citrus', 'Vegetables',
        ];

        $pests = [
            'Aphids', 'Armyworm', 'Stem borer', 'Green leafhopper', 'Brown planthopper',
            'Rice bug', 'Corn borer', 'Fall armyworm', 'Thrips', 'Whiteflies',
            'Fruit fly', 'Scale insects', 'Mites', 'Nematodes', 'Caterpillars',
            'Grasses', 'Broadleaf weeds', 'Sedges', 'Nutgrass', 'Water hyacinth',
            'Blast', 'Bacterial blight', 'Sheath blight', 'Brown spot', 'Downy mildew',
            'Powdery mildew', 'Anthracnose', 'Leaf spot', 'Root rot', 'Wilt',
        ];

        $weeds = [
            'Cogon grass', 'Guinea grass', 'Sedges', 'Crabgrass', 'Barnyard grass',
            'Lantana', 'Morning glory', 'Sesbania', 'Pigweed', 'Ragweed',
            'Broadleaf signalgrass', 'Bermudagrass', 'Johnson grass', 'Kyllinga',
            'Paspalum', 'Water hyacinth',
        ];

        $diseases = [
            'Rice blast', 'Bacterial blight', 'Sheath blight', 'Brown spot', 'Downy mildew',
            'Powdery mildew', 'Anthracnose', 'Leaf spot', 'Root rot', 'Wilt',
            'Fusarium wilt', 'Phytophthora blight', 'Alternaria leaf spot',
            'Cercospora leaf spot', 'Botrytis gray mold',
        ];

        $activeIngredient = $this->faker->randomElement($activeIngredients);
        $formulationType = $this->faker->randomElement($formulationTypes);
        $use = $this->faker->randomElement($uses);
        $crop = $this->faker->randomElement($crops);

        // Generate concentration based on formulation type
        $concentration = match ($formulationType) {
            'EC' => $this->faker->numberBetween(10, 480).' g/L',
            'SC' => $this->faker->numberBetween(50, 500).' g/L',
            'WP' => $this->faker->numberBetween(25, 80).'%',
            'SL' => $this->faker->numberBetween(200, 600).' g/L',
            'WG' => $this->faker->numberBetween(50, 85).'%',
            'GR' => $this->faker->numberBetween(3, 10).'%',
            default => $this->faker->numberBetween(10, 90).'%'
        };

        // Generate product name
        $productName = strtoupper($this->faker->company()).' '.$activeIngredient.' '.$formulationType;

        // Generate registration number
        $regNumber = $this->faker->numberBetween(100, 999).'-'.
                    $this->faker->numberBetween(100, 999).'-'.
                    $this->faker->numberBetween(1000, 9999);

        // Generate expiry date (1-3 years from now)
        $expiryDate = $this->faker->dateTimeBetween('now', '+3 years')->format('Y-m-d');

        // Generate recommended rate based on use type
        $recommendedRate = match ($use) {
            'HERBICIDE' => $this->faker->numberBetween(15, 50).'ml/16L water',
            'INSECTICIDE' => $this->faker->numberBetween(10, 30).'ml/16L water',
            'FUNGICIDE' => $this->faker->numberBetween(20, 40).'g/16L water',
            default => $this->faker->numberBetween(15, 35).'ml/16L water'
        };

        // Generate PHI (Pre-Harvest Interval)
        $phi = match ($use) {
            'HERBICIDE' => $this->faker->randomElement(['3 days', '7 days', '14 days', '-']),
            'INSECTICIDE' => $this->faker->randomElement(['3 days', '7 days', '14 days', '21 days']),
            'FUNGICIDE' => $this->faker->randomElement(['7 days', '14 days', '21 days', '28 days']),
            default => $this->faker->randomElement(['7 days', '14 days'])
        };

        return [
            'company' => $this->faker->randomElement($companies),
            'active_ingredient' => $activeIngredient,
            'product_name' => $productName,
            'concentration' => $concentration,
            'formulation_type' => $formulationType,
            'uses' => $use,
            'toxicity_category' => $this->faker->randomElement($toxicityCategories),
            'registration_number' => $regNumber,
            'expiry_date' => $expiryDate,
            'mode_of_entry' => $this->faker->randomElement($modesOfEntry),
            'crops' => $crop.($this->faker->boolean(30) ? ', '.$this->faker->randomElement($crops) : ''),
            'pests' => $this->faker->randomElement($pests).($this->faker->boolean(30) ? ', '.$this->faker->randomElement($pests) : ''),
            'weeds' => $this->faker->randomElement($weeds).($this->faker->boolean(30) ? ', '.$this->faker->randomElement($weeds) : ''),
            'diseases' => $this->faker->randomElement($diseases).($this->faker->boolean(30) ? ', '.$this->faker->randomElement($diseases) : ''),
            'recommended_rate' => $recommendedRate,
            'MRL' => $this->faker->randomElement(['0.01 ppm', '0.05 ppm', '0.1 ppm', '0.5 ppm', '1.0 ppm', '-']),
            'PHI' => $phi,
            're_entry_period' => $this->faker->randomElement([
                'Entry allowed when spray deposits dry',
                'Re-entry allowed after 12 hours',
                'Re-entry allowed after 24 hours',
                'Re-entry allowed after 48 hours',
                'Re-entry allowed after 72 hours',
            ]),
        ];
    }
}
