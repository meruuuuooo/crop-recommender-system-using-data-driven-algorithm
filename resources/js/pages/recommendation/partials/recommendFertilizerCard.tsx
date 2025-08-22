import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { BeakerIcon, CheckCircle, FlaskConical, Info, Loader2, Sprout, TestTube } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Crop {
    id: string;
    name: string;
    category_id: string;
    season: string;
}

interface Category {
    id: string;
    name: string;
    description?: string;
}

interface FertilizerRecommendation {
    id: string;
    product_name: string;
    company: string;
    type: string;
    npk_ratio: string;
    application_rate: string;
    application_method: string;
    confidence_score: number;
}

interface RecommendFertilizerCardProps {
    categories?: Category[];
    crops?: Crop[];
    onRecommendationGenerated?: (recommendations: FertilizerRecommendation[]) => void;
}

export default function RecommendFertilizerCard({ categories = [], crops = [], onRecommendationGenerated }: RecommendFertilizerCardProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCrop, setSelectedCrop] = useState<string>('');
    const [nitrogen, setNitrogen] = useState<string>('medium');
    const [phosphorus, setPhosphorus] = useState<string>('medium');
    const [potassium, setPotassium] = useState<string>('medium');
    const [phLevel, setPhLevel] = useState<number[]>([7.0]);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [recommendations, setRecommendations] = useState<FertilizerRecommendation[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);

    const categoriesToUse = categories;
    const cropsToUse = crops;
    const availableCrops = cropsToUse && selectedCategory
        ? cropsToUse.filter((crop) => crop.category_id === selectedCategory)
        : [];

    // Reset crop selection when category changes
    useEffect(() => {
        setSelectedCrop('');
    }, [selectedCategory]);

    const getNutrientLevelColor = (level: string) => {
        switch (level) {
            case 'very-low':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'low':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'medium':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'high':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'very-high':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getPhLevelColor = (ph: number) => {
        if (ph < 6.5) return 'text-red-600'; // Acidic
        if (ph > 7.2) return 'text-blue-600'; // Alkaline
        return 'text-green-600'; // Near neutral
    };

    const getPhLevelDescription = (ph: number) => {
        if (ph < 4.5) return 'Extremely acidic';
        if (ph >= 4.5 && ph <= 5.5) return 'Strongly acidic';
        if (ph > 5.5 && ph <= 6.5) return 'Moderately or slightly acidic';
        if (ph > 6.5 && ph <= 7.2) return 'Near neutral';
        if (ph > 7.2 && ph <= 8.5) return 'Moderately or slightly alkaline';
        if (ph > 8.5 && ph <= 9.0) return 'Strongly alkaline';
        if (ph > 9.0) return 'Very strongly alkaline';
        return '';
    };

    const handleGenerateRecommendation = async () => {
        if (!selectedCategory || !selectedCrop) {
            alert('Please select both crop category and crop');
            return;
        }

        setIsGenerating(true);
        setShowResults(false);

        // Simulate API call
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Mock recommendations based on soil analysis
            const mockRecommendations: FertilizerRecommendation[] = [
                {
                    id: '1',
                    product_name: 'Complete NPK 14-14-14',
                    company: 'AgriTech Solutions',
                    type: 'Granular',
                    npk_ratio: '14-14-14',
                    application_rate: '200-300 kg/ha',
                    application_method: 'Broadcast before planting',
                    confidence_score: 95,
                },
                {
                    id: '2',
                    product_name: 'Organic Compost Blend',
                    company: 'GreenGrow Organic',
                    type: 'Organic',
                    npk_ratio: '3-2-4',
                    application_rate: '500-800 kg/ha',
                    application_method: 'Mix with soil during land preparation',
                    confidence_score: 88,
                },
                {
                    id: '3',
                    product_name: 'Urea 46-0-0',
                    company: 'ChemFarm Industries',
                    type: 'Inorganic',
                    npk_ratio: '46-0-0',
                    application_rate: '100-150 kg/ha',
                    application_method: 'Side dress 3-4 weeks after planting',
                    confidence_score: 82,
                },
            ];

            setRecommendations(mockRecommendations);
            setShowResults(true);

            if (onRecommendationGenerated) {
                onRecommendationGenerated(mockRecommendations);
            }
        } catch (error) {
            console.error('Error generating recommendations:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const resetForm = () => {
        setSelectedCategory('');
        setSelectedCrop('');
        setNitrogen('medium');
        setPhosphorus('medium');
        setPotassium('medium');
        setPhLevel([7.0]);
        setShowResults(false);
        setRecommendations([]);
    };

    return (
        <div className="mx-auto w-full space-y-6">
            {/* Header */}
            <Card className="border-[#D6E3D4] bg-gradient-to-r from-[#F0F7ED] to-[#E6F4EA]">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl text-[#619154]">
                        <FlaskConical className="h-6 w-6" />
                        Fertilizer Recommendation System
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Get personalized fertilizer recommendations based on your crop selection and soil analysis
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Input Form */}
            <Card className="border-[#D6E3D4]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-[#619154]">
                        <Sprout className="h-5 w-5" />
                        Crop Information
                    </CardTitle>
                    <CardDescription>Select your crop category and specific crop variety</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Crop Category */}
                        <div className="space-y-2">
                            <Label htmlFor="crop-category" className="text-sm font-medium text-gray-700">
                                Crop Category <span className="text-red-500">*</span>
                            </Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="border-[#D6E3D4] text-[#619154] focus:border-[#619154] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2">
                                    <SelectValue placeholder="Select crop category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoriesToUse.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Specific Crop */}
                        <div className="space-y-2">
                            <Label htmlFor="crop" className="text-sm font-medium text-gray-700">
                                Specific Crop <span className="text-red-500">*</span>
                            </Label>
                            <Select value={selectedCrop} onValueChange={setSelectedCrop} disabled={!selectedCategory}>
                                <SelectTrigger className="border-[#D6E3D4] text-[#619154] focus:border-[#619154] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2 disabled:opacity-50">
                                    <SelectValue placeholder={selectedCategory ? 'Select crop' : 'Select category first'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCrops.map((crop) => (
                                        <SelectItem key={crop.id} value={crop.id}>
                                            {crop.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Soil Analysis */}
            <Card className="border-[#D6E3D4]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-[#619154]">
                        <BeakerIcon className="h-5 w-5" />
                        Soil Analysis
                    </CardTitle>
                    <CardDescription>Provide your soil nutrient levels and pH measurement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* pH Level Slider */}
                    <div className="space-y-4">
                        <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <TestTube className="h-4 w-4 text-green-500" />
                            Soil pH Level
                        </Label>
                        <div className="space-y-4">
                            <div className="px-4">
                                <Slider value={phLevel} onValueChange={setPhLevel} max={14} min={3} step={0.1} className="w-full" />
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Acidic (3.0)</span>
                                <div className="text-center">
                                    <div className={`text-lg font-bold ${getPhLevelColor(phLevel[0])}`}>{phLevel[0].toFixed(1)}</div>
                                    <div className="text-xs">{getPhLevelDescription(phLevel[0])}</div>
                                </div>
                                <span>Alkaline (14.0)</span>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-[#D6E3D4]" />

                    {/* Nutrient Levels */}
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-medium text-gray-700">
                            <TestTube className="h-4 w-4" />
                            Primary Nutrients (NPK)
                        </h4>

                        {/* Nitrogen */}
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                Nitrogen (N) Level
                            </Label>
                            <RadioGroup value={nitrogen} onValueChange={setNitrogen} className="flex gap-6">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="very-low" id="n-very-low" className="border-[#619154] text-[#619154]" />
                                    <Label htmlFor="n-very-low" className="cursor-pointer">
                                        <Badge variant="secondary" className={getNutrientLevelColor('low')}>
                                            Very Low (&lt;0.05%)
                                        </Badge>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="low" id="n-low" className="border-[#619154] text-[#619154]" />
                                    <Label htmlFor="n-low" className="cursor-pointer">
                                        <Badge variant="secondary" className={getNutrientLevelColor('low')}>
                                            Low (0.05-0.15%)
                                        </Badge>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="medium" id="n-medium" className="border-[#619154] text-[#619154]" />
                                    <Label htmlFor="n-medium" className="cursor-pointer">
                                        <Badge variant="secondary" className={getNutrientLevelColor('medium')}>
                                            Medium (&gt;0.15-0.2%)
                                        </Badge>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="high" id="n-high" className="border-[#619154] text-[#619154]" />
                                    <Label htmlFor="n-high" className="cursor-pointer">
                                        <Badge variant="secondary" className={getNutrientLevelColor('high')}>
                                            High (&gt;0.2-0.3%)
                                        </Badge>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="very-high" id="n-very-high" className="border-[#619154] text-[#619154]" />
                                    <Label htmlFor="n-very-high" className="cursor-pointer">
                                        <Badge variant="secondary" className={getNutrientLevelColor('high')}>
                                            Very High (&gt;0.3%)
                                        </Badge>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Phosphorus */}
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                Phosphorus (P) Level
                                <div className="ml-2 text-xs text-gray-500">{phLevel[0] <= 5.5 ? '(Bray 1 Method)' : '(Olsen Method)'}</div>
                            </Label>
                            <div className="mb-2 text-xs text-gray-500">
                                {phLevel[0] <= 5.5
                                    ? 'Using Bray 1 extraction method for acidic soil (pH ≤ 5.5)'
                                    : 'Using Olsen extraction method for alkaline soil (pH > 5.5)'}
                            </div>
                            <RadioGroup value={phosphorus} onValueChange={setPhosphorus} className="flex flex-wrap gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="very-low" id="p-very-low" className="border-[#619154] text-[#619154]" />
                                    <Label htmlFor="p-very-low" className="cursor-pointer">
                                        <Badge variant="secondary" className={getNutrientLevelColor('low')}>
                                            {phLevel[0] <= 5.5 ? 'Very Low (<3 ppm)' : 'Very Low (<3 mg/kg)'}
                                        </Badge>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="low" id="p-low" className="border-[#619154] text-[#619154]" />
                                    <Label htmlFor="p-low" className="cursor-pointer">
                                        <Badge variant="secondary" className={getNutrientLevelColor('low')}>
                                            {phLevel[0] <= 5.5 ? 'Low (3-10 ppm)' : 'Low (0-7 mg/kg)'}
                                        </Badge>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="medium" id="p-medium" className="border-[#619154] text-[#619154]" />
                                    <Label htmlFor="p-medium" className="cursor-pointer">
                                        <Badge variant="secondary" className={getNutrientLevelColor('medium')}>
                                            {phLevel[0] <= 5.5 ? 'Medium (>10-20 ppm)' : 'Medium (>7-25 mg/kg)'}
                                        </Badge>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="high" id="p-high" className="border-[#619154] text-[#619154]" />
                                    <Label htmlFor="p-high" className="cursor-pointer">
                                        <Badge variant="secondary" className={getNutrientLevelColor('high')}>
                                            {phLevel[0] <= 5.5 ? 'High (>20-30 ppm)' : 'High (>25-33 mg/kg)'}
                                        </Badge>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="very-high" id="p-very-high" className="border-[#619154] text-[#619154]" />
                                    <Label htmlFor="p-very-high" className="cursor-pointer">
                                        <Badge variant="secondary" className={getNutrientLevelColor('high')}>
                                            {phLevel[0] <= 5.5 ? 'Very High (>30 ppm)' : 'Very High (>33 mg/kg)'}
                                        </Badge>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Potassium */}
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                Potassium (K) Level
                                <div className="ml-2 text-xs text-gray-500">(Ammonium Acetate Method)</div>
                            </Label>
                            <div className="mb-2 text-xs text-gray-500">Exchangeable cations measured using ammonium acetate extraction method</div>
                            <RadioGroup value={potassium} onValueChange={setPotassium} className="flex flex-wrap gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="very-low" id="k-very-low" className="border-[#619154] text-[#619154]" />
                                    <Label htmlFor="k-very-low" className="cursor-pointer">
                                        <Badge variant="secondary" className={getNutrientLevelColor('very-low')}>
                                            Very Low (&lt;0.3 cmol/kg)
                                        </Badge>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="low" id="k-low" className="border-[#619154] text-[#619154]" />
                                    <Label htmlFor="k-low" className="cursor-pointer">
                                        <Badge variant="secondary" className={getNutrientLevelColor('low')}>
                                            Low (0.3-1.0 cmol/kg)
                                        </Badge>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="medium" id="k-medium" className="border-[#619154] text-[#619154]" />
                                    <Label htmlFor="k-medium" className="cursor-pointer">
                                        <Badge variant="secondary" className={getNutrientLevelColor('medium')}>
                                            Medium (1.0-3.0 cmol/kg)
                                        </Badge>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="high" id="k-high" className="border-[#619154] text-[#619154]" />
                                    <Label htmlFor="k-high" className="cursor-pointer">
                                        <Badge variant="secondary" className={getNutrientLevelColor('high')}>
                                            High (3.0-8.0 cmol/kg)
                                        </Badge>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="very-high" id="k-very-high" className="border-[#619154] text-[#619154]" />
                                    <Label htmlFor="k-very-high" className="cursor-pointer">
                                        <Badge variant="secondary" className={getNutrientLevelColor('very-high')}>
                                            Very High (&gt;8.0 cmol/kg)
                                        </Badge>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <Separator className="bg-[#D6E3D4]" />

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={handleGenerateRecommendation}
                            disabled={!selectedCategory || !selectedCrop || isGenerating}
                            className="flex-1 bg-[#619154] text-white hover:bg-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            {isGenerating ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Generating...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <FlaskConical className="h-4 w-4" />
                                    <span>Get Recommendations</span>
                                </div>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={resetForm}
                            className="border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                        >
                            Reset
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recommendations Results */}
            {showResults && recommendations.length > 0 && (
                <Card className="border-[#D6E3D4]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-[#619154]">
                            <CheckCircle className="h-5 w-5" />
                            Fertilizer Recommendations
                        </CardTitle>
                        <CardDescription>Based on your crop selection and soil analysis, here are our recommended fertilizers</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recommendations.map((recommendation, index) => (
                            <Card key={recommendation.id} className="border-[#D6E3D4] bg-gray-50">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="bg-[#619154] text-white">
                                                    #{index + 1}
                                                </Badge>
                                                <h4 className="font-semibold text-[#619154]">{recommendation.product_name}</h4>
                                                <Badge variant="outline" className="text-xs">
                                                    {recommendation.type}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600">{recommendation.company}</p>
                                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                                                <div>
                                                    <span className="font-medium">NPK Ratio:</span>
                                                    <span className="ml-1 text-[#619154]">{recommendation.npk_ratio}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Application Rate:</span>
                                                    <span className="ml-1 text-[#619154]">{recommendation.application_rate}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Confidence:</span>
                                                    <span className="ml-1 text-[#619154]">{recommendation.confidence_score}%</span>
                                                </div>
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium">Application Method:</span>
                                                <span className="ml-1 text-gray-600">{recommendation.application_method}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-start gap-3">
                                <Info className="mt-0.5 h-5 w-5 text-blue-600" />
                                <div>
                                    <div className="font-medium text-blue-800">Application Guidelines</div>
                                    <div className="mt-1 text-sm text-blue-700">
                                        Always follow the manufacturer's instructions and consider local soil conditions. It's recommended to conduct
                                        a detailed soil test before applying fertilizers. Consult with local agricultural extension services for best
                                        practices.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
