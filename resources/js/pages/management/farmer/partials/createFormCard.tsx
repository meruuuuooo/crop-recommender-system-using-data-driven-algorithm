import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function CreateFormCard() {
    return (
        <div>
            <div className="mt-2 grid max-w-6/12 grid-cols-1 gap-6 px-2 md:grid-cols-2 lg:grid-cols-1">
                <div className="grid gap-2">
                    <Label htmlFor="firstname">First Name</Label>

                    <Input
                        id="firstname"
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        required
                        autoComplete="firstname"
                        placeholder="Enter first name"
                    />

                    <InputError className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="middlename">Middle Name</Label>

                    <Input
                        id="middlename"
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        required
                        autoComplete="middlename"
                        placeholder="Enter middle name"
                    />

                    <InputError className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="lastname">Last Name</Label>

                    <Input
                        id="lastname"
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        required
                        autoComplete="lastname"
                        placeholder="Enter last name"
                    />

                    <InputError className="mt-2" />
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>

                        <Input
                            id="contactNumber"
                            className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                            required
                            autoComplete="contactNumber"
                            placeholder="Enter contact number"
                        />

                        <InputError className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="farmingExperience">Farming Experience</Label>

                        <Input
                            id="farmingExperience"
                            className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                            required
                            autoComplete="farmingExperience"
                            placeholder="Enter farming experience (in years)"
                        />

                        <InputError className="mt-2" />
                    </div>
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
                    <Label htmlFor="registrationDate">Registration date</Label>

                    <Input
                        id="registrationDate"
                        className="mt-1 block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                        required
                        autoComplete="registrationDate"
                        placeholder="Enter registration date"
                        type="date"
                    />

                    <InputError className="mt-2" />
                </div>
                <Button className="cursor-pointer bg-[#619154] text-white hover:bg-[#4F7A43]">Save</Button>
            </div>
        </div>
    );
}
