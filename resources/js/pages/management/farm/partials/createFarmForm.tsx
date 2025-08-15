import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect, type SearchableSelectOption } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

// Sample data for searchable selects
const farmerOptions: SearchableSelectOption[] = [
    { value: 'mailem', label: 'Mailem' },
    { value: 'dano', label: 'Dano' },
    { value: 'pelin', label: 'Pelin' },
    { value: 'john', label: 'John Smith' },
    { value: 'jane', label: 'Jane Doe' },
    { value: 'mike', label: 'Mike Johnson' },
    { value: 'sarah', label: 'Sarah Williams' },
    { value: 'david', label: 'David Brown' },
];

export default function CreateFarmForm() {
    const [selectedFarmer, setSelectedFarmer] = useState<string>('');
    return (
        <div>
            <div className="mt-2 grid max-w-6/12 grid-cols-1 gap-6 px-2 md:grid-cols-2 lg:grid-cols-1">
                <div className="grid gap-2">
                    <Label htmlFor="farmname">Farm Name</Label>
                    <Input
                        id="farmname"
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        required
                        autoComplete="farmname"
                        placeholder="Enter farm name"
                    />
                    <InputError className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="owner">Owner (Farmer Name)</Label>
                    <SearchableSelect
                        options={farmerOptions}
                        value={selectedFarmer}
                        onValueChange={setSelectedFarmer}
                        placeholder="Select Farmer"
                        searchPlaceholder="Search farmers..."
                        className="w-full"
                        clearable
                    />
                    <InputError className="mt-2" />
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="province">Province</Label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Province" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="province1">Province 1</SelectItem>
                                <SelectItem value="province2">Province 2</SelectItem>
                                <SelectItem value="province3">Province 3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="municipality">Municipality</Label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Municipality" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="municipality1">Municipality 1</SelectItem>
                                <SelectItem value="municipality2">Municipality 2</SelectItem>
                                <SelectItem value="municipality3">Municipality 3</SelectItem>
                                <SelectItem value="municipality4">Municipality 4</SelectItem>
                                <SelectItem value="municipality5">Municipality 5</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="barangay">Barangay</Label>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Barangay" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="barangay1">Barangay 1</SelectItem>
                            <SelectItem value="barangay2">Barangay 2</SelectItem>
                            <SelectItem value="barangay3">Barangay 3</SelectItem>
                            <SelectItem value="barangay4">Barangay 4</SelectItem>
                            <SelectItem value="barangay5">Barangay 5</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="farmSize">Farm Size (hectares)</Label>
                    <Input
                        id="farmSize"
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        required
                        autoComplete="farmSize"
                        placeholder="Enter farm size in hectares"
                        type="number"
                        min="0"
                        step="0.01"
                    />
                    <InputError className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="previousCrops">Previous Crops</Label>
                    <Input
                        id="previousCrops"
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        required
                        autoComplete="previousCrops"
                        placeholder="Enter previous crops (comma separated)"
                    />
                    <InputError className="mt-2" />
                </div>

                <Button className="cursor-pointer bg-[#619154] text-white hover:bg-[#4F7A43]">Save</Button>
            </div>
        </div>
    );
}
