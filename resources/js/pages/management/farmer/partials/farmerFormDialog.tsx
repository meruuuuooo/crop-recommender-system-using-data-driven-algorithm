import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type CreateFarmerProps } from '@/types/farmer';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface FarmerIndexPropsExtended extends CreateFarmerProps {
    provinces: CreateFarmerProps['provinces'];
    municipalities: CreateFarmerProps['municipalities'];
    barangays: CreateFarmerProps['barangays'];
    crops: {
        id: number;
        name: string;
    }[];
}

export default function FarmerFormDialog({ provinces, municipalities, barangays, crops }: FarmerIndexPropsExtended) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [sameAsHome, setSameAsHome] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        farmer: {
            firstname: '',
            middlename: '',
            lastname: '',
            contact_number: '',
            farming_experience: '',
            province_id: '',
            municipality_id: '',
            barangay_id: '',
            street: '',
        },
        farm: {
            name: '',
            total_area: '',
            cropping_system: '',
            prev_crops: '',
            province_id: '',
            municipality_id: '',
            barangay_id: '',
            street: '',
        },
    });

    const farmerMunicipalities = municipalities.filter((m) => String(m.province_id) === data.farmer.province_id);
    const farmerBarangays = barangays.filter((b) => String(b.municipality_id) === data.farmer.municipality_id);
    const farmMunicipalities = municipalities.filter((m) => String(m.province_id) === data.farm.province_id);
    const farmBarangays = barangays.filter((b) => String(b.municipality_id) === data.farm.municipality_id);

    useEffect(() => {
        if (sameAsHome) {
            setData('farm.province_id', data.farmer.province_id);
            setData('farm.municipality_id', data.farmer.municipality_id);
            setData('farm.barangay_id', data.farmer.barangay_id);
            setData('farm.street', data.farmer.street);
        }
    }, [sameAsHome, data.farmer.province_id, data.farmer.municipality_id, data.farmer.barangay_id, data.farmer.street, setData]);

    const handleSameAsHomeChange = (checked: boolean) => {
        setSameAsHome(checked);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('management.farmer.store'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Farmer added successfully!');
                setOpen(false);
                setStep(1);
                setSameAsHome(false);
                reset();
            },
            onError: (errors) => {
                console.log('Form errors:', errors);
                toast.error('Please fix the errors in the form.' + Object.values(errors).join(' '));
            },
        });
    };

    const croppingSystems = [
        { Monocropping: 'Monocropping' },
        { MixedCropping: 'Mixed Cropping' },
        { InterCropping: 'Inter Cropping' },
        { CropRotation: 'Crop Rotation' },
        { RelayCropping: 'Relay Cropping' },
        { SequentialCropping: 'Sequential Cropping' },
        { AlleyCropping: 'Alley Cropping' },
        { StripCropping: 'Strip Cropping' },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer bg-[#619154] text-white hover:bg-[#4F7A43]">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Farmer
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[800px] overflow-y-auto rounded-xl bg-white p-8 sm:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                        {step === 1 ? 'Farmer Information' : 'Farm Information'}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        {step === 1 ? 'Fill in the farmer’s personal and contact details.' : 'Fill in the details about the farmer’s farm.'}
                    </DialogDescription>
                </DialogHeader>
                {/* STEP 1 - FARMER INFO */}
                {step === 1 && (
                    <form id="farmer-form" className="space-y-6" noValidate>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                                    First Name{' '}
                                    <span className="text-red-500" aria-label="required">
                                        *
                                    </span>
                                </Label>
                                <Input
                                    id="firstname"
                                    name="first_name"
                                    className="w-full text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                    value={data.farmer.firstname}
                                    onChange={(e) => setData('farmer.firstname', e.target.value)}
                                    required
                                    autoComplete="given-name"
                                    placeholder="Enter first name"
                                />
                                <InputError message={errors['farmer.firstname']} id="firstname-error" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="middlename" className="text-sm font-medium text-gray-700">
                                    Middle Name <span className="text-xs text-gray-500">(Optional)</span>
                                </Label>
                                <Input
                                    id="middlename"
                                    name="middle_name"
                                    className="w-full text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                    value={data.farmer.middlename}
                                    onChange={(e) => setData('farmer.middlename', e.target.value)}
                                    autoComplete="additional-name"
                                    placeholder="Enter middle name"
                                />
                                <InputError message={errors['farmer.middlename']} id="middlename-error" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                                    Last Name{' '}
                                    <span className="text-red-500" aria-label="required">
                                        *
                                    </span>
                                </Label>
                                <Input
                                    id="lastname"
                                    name="last_name"
                                    className="w-full text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                    value={data.farmer.lastname}
                                    onChange={(e) => setData('farmer.lastname', e.target.value)}
                                    required
                                    autoComplete="family-name"
                                    placeholder="Enter last name"
                                />
                                <InputError message={errors['farmer.lastname']} id="lastname-error" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2 lg:col-span-2">
                                <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">
                                    Contact Number{' '}
                                    <span className="text-red-500" aria-label="required">
                                        *
                                    </span>
                                </Label>
                                <Input
                                    id="contactNumber"
                                    name="contact_number"
                                    className="w-full text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                    value={data.farmer.contact_number}
                                    onChange={(e) => setData('farmer.contact_number', e.target.value)}
                                    required
                                    autoComplete="tel"
                                    placeholder="Enter contact number (e.g., +63 912 345 6789)"
                                    type="tel"
                                    pattern="[+]?[0-9\s\-\(\)]+"
                                />
                                <div id="contact-number-help" className="text-xs text-gray-500">
                                    Include country code and mobile number
                                </div>
                                <InputError message={errors['farmer.contact_number']} id="contact-number-error" />
                            </div>
                            <div className="space-y-2 lg:col-span-1">
                                <Label htmlFor="farmingExperience" className="text-sm font-medium text-gray-700">
                                    Farming Experience (Years){' '}
                                    <span className="text-red-500" aria-label="required">
                                        *
                                    </span>
                                </Label>
                                <Input
                                    id="farmingExperience"
                                    name="farming_experience"
                                    className="w-full text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                    value={data.farmer.farming_experience}
                                    onChange={(e) => setData('farmer.farming_experience', e.target.value)}
                                    autoComplete="off"
                                    placeholder="e.g., 5"
                                    type="number"
                                    min="0"
                                    max="80"
                                    step="1"
                                />
                                <div id="farming-experience-help" className="text-xs text-gray-500">
                                    Years of farming experience (0-80)
                                </div>
                                <InputError message={errors['farmer.farming_experience']} id="farming-experience-error" />
                            </div>
                        </div>
                        {/* Farmer Address */}
                        <h3 className="font-semibold text-gray-900">Home Address</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <Label>
                                    Province{' '}
                                    <span className="text-red-500" aria-label="required">
                                        *
                                    </span>
                                </Label>
                                <SearchableSelect
                                    options={provinces.map((p) => ({ value: String(p.id), label: p.name }))}
                                    value={data.farmer.province_id}
                                    onValueChange={(val) => {
                                        setData('farmer.province_id', val);
                                        setData('farmer.municipality_id', '');
                                        setData('farmer.barangay_id', '');
                                    }}
                                    placeholder="Select Province"
                                    portalContainer={document.getElementById('farmer-form')}
                                />
                                <div id="province-help" className="text-xs text-gray-500">
                                    Choose the province where the farm is located
                                </div>
                                <InputError message={errors['farmer.province_id']} />
                            </div>
                            <div>
                                <Label>
                                    Municipality{' '}
                                    <span className="text-red-500" aria-label="required">
                                        *
                                    </span>
                                </Label>
                                <SearchableSelect
                                    options={farmerMunicipalities.map((m) => ({ value: String(m.id), label: m.name }))}
                                    value={data.farmer.municipality_id}
                                    onValueChange={(val) => {
                                        setData('farmer.municipality_id', val);
                                        setData('farmer.barangay_id', '');
                                    }}
                                    placeholder="Select Municipality"
                                    disabled={!data.farmer.province_id}
                                    portalContainer={document.getElementById('farmer-form')}
                                />
                                <div id="municipality-help" className="text-xs text-gray-500">
                                    {!data.farmer.province_id
                                        ? 'Province must be selected first'
                                        : 'Choose the municipality within the selected province'}
                                </div>
                                <InputError message={errors['farmer.municipality_id']} />
                            </div>
                            <div>
                                <Label>
                                    Barangay{' '}
                                    <span className="text-red-500" aria-label="required">
                                        *
                                    </span>
                                </Label>
                                <SearchableSelect
                                    options={farmerBarangays.map((b) => ({ value: String(b.id), label: b.name }))}
                                    value={data.farmer.barangay_id}
                                    onValueChange={(val) => setData('farmer.barangay_id', val)}
                                    placeholder="Select Barangay"
                                    disabled={!data.farmer.municipality_id}
                                    portalContainer={document.getElementById('farmer-form')}
                                />
                                <div id="barangay-help" className="text-xs text-gray-500">
                                    {!data.farmer.municipality_id
                                        ? 'Municipality must be selected first'
                                        : 'Choose the barangay within the selected municipality'}
                                </div>
                                <InputError message={errors['farmer.barangay_id']} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                                Street Address{' '}
                                <span className="text-red-500" aria-label="required">
                                    *
                                </span>
                            </Label>
                            <Input
                                id="street"
                                name="street"
                                className="w-full text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.farmer.street}
                                onChange={(e) => setData('farmer.street', e.target.value)}
                                required
                                autoComplete="street-address"
                                placeholder="Enter street address"
                            />
                            <InputError message={errors['farmer.street']} id="street-error" />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <Button variant="outline" type='button' onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setStep(2)}
                                disabled={
                                    processing ||
                                    !data.farmer.firstname ||
                                    !data.farmer.lastname ||
                                    !data.farmer.contact_number ||
                                    !data.farmer.farming_experience ||
                                    !data.farmer.province_id ||
                                    !data.farmer.municipality_id ||
                                    !data.farmer.barangay_id ||
                                    !data.farmer.street
                                }
                                className="bg-[#619154] text-white hover:bg-[#4F7A43]"
                            >
                                Next
                            </Button>
                        </div>
                    </form>
                )}
                {/* STEP 2 - FARM INFO */}
                {step === 2 && (
                    <form onSubmit={submit} id="farm-form" className="space-y-6">
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="farmname" className="text-sm font-medium text-gray-700">
                                    Farm Name{' '}
                                    <span className="text-red-500" aria-label="required">
                                        *
                                    </span>
                                </Label>
                                <Input
                                    id="farmname"
                                    name="name"
                                    className="w-full border text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                    value={data.farm.name}
                                    onChange={(e) => setData('farm.name', e.target.value)}
                                    required
                                    autoComplete="off"
                                    placeholder="Enter farm name"
                                />
                                <div id="farm-name-help" className="text-xs text-gray-500">
                                    Enter a descriptive name for the farm
                                </div>
                                <InputError message={errors['farm.name']} id="farm-name-error" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="totalarea" className="text-sm font-medium text-gray-700">
                                    Total Area (hectares) <span className="text-xs text-gray-500">(Optional)</span>
                                </Label>
                                <Input
                                    id="totalarea"
                                    name="total_area"
                                    className="w-full border text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                    value={data.farm.total_area}
                                    onChange={(e) => setData('farm.total_area', e.target.value)}
                                    autoComplete="off"
                                    placeholder="0.00"
                                    type="number"
                                />
                                <div id="total-area-help" className="text-xs text-gray-500">
                                    Enter area in hectares (0.01 - 1000)
                                </div>
                                <InputError message={errors['farm.total_area']} id="total-area-error" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cropping_system" className="text-sm font-medium text-gray-700">
                                    Cropping System{' '}
                                    <span className="text-red-500" aria-label="required">
                                        *
                                    </span>
                                </Label>
                                <Select
                                    onValueChange={(value) => {
                                        setData('farm.cropping_system', value);
                                        if (value === 'Monocropping' && data.farm.prev_crops && data.farm.prev_crops.includes(', ')) {
                                            setData('farm.prev_crops', '');
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
                                        <SelectValue placeholder="Select Cropping System" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {croppingSystems.map((system) => {
                                            const key = Object.keys(system)[0];
                                            return (
                                                <SelectItem key={key} value={key}>
                                                    {system[key as keyof typeof system]}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <div id="cropping-system-help" className="text-xs text-gray-500">
                                    Choose the cropping system used on the farm
                                </div>
                                <InputError message={errors['farm.cropping_system']} id="cropping-system-error" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prevcrops" className="text-sm font-medium text-gray-700">
                                    Previous Crops <span className="text-xs text-gray-500">(Optional)</span>
                                </Label>
                                <div className="relative">
                                    <Select
                                        onValueChange={(value) => {
                                            if (value) {
                                                if (data.farm.cropping_system === 'Monocropping') {
                                                    setData('farm.prev_crops', value);
                                                } else {
                                                    const currentCrops = data.farm.prev_crops ? data.farm.prev_crops.split(', ') : [];
                                                    if (!currentCrops.includes(value)) {
                                                        const newCrops = [...currentCrops, value].join(', ');
                                                        setData('farm.prev_crops', newCrops);
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
                                            <SelectValue
                                                placeholder={
                                                    data.farm.cropping_system === 'Monocropping'
                                                        ? 'Select one previous crop'
                                                        : 'Select previous crops'
                                                }
                                            >
                                                {data.farm.prev_crops ||
                                                    (data.farm.cropping_system === 'Monocropping'
                                                        ? 'Select one previous crop'
                                                        : 'Select previous crops')}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {crops?.map((crop) => (
                                                <SelectItem key={crop.id} value={crop.name}>
                                                    {crop.name}
                                                </SelectItem>
                                            )) || []}
                                        </SelectContent>
                                    </Select>
                                    {data.farm.prev_crops && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setData('farm.prev_crops', '');
                                            }}
                                            className="absolute top-1/2 right-8 -translate-y-1/2 transform px-1 text-xs text-gray-400 hover:text-red-600 focus:outline-none"
                                            aria-label="Clear all crops"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                                <div id="prev-crops-help" className="text-xs text-gray-500">
                                    {data.farm.cropping_system === 'Monocropping'
                                        ? 'Select one crop that was previously grown on this farm.'
                                        : 'Select crops that were previously grown on this farm. You can select multiple crops.'}
                                </div>
                                <InputError message={errors['farm.prev_crops']} id="prev-crops-error" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" checked={sameAsHome} onChange={(e) => handleSameAsHomeChange(e.target.checked)} />
                            <span className="text-sm text-gray-700">Farm address is the same as home address</span>
                        </div>
                        {!sameAsHome && (
                            <>
                                <h3 className="font-semibold text-gray-900">Farm Address</h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <Label>Province *</Label>
                                        <SearchableSelect
                                            options={provinces.map((p) => ({ value: String(p.id), label: p.name }))}
                                            value={data.farm.province_id}
                                            onValueChange={(val) => {
                                                setData('farm.province_id', val);
                                                setData('farm.municipality_id', '');
                                                setData('farm.barangay_id', '');
                                            }}
                                            placeholder="Select Province"
                                            portalContainer={document.getElementById('farm-form')}
                                        />
                                        <div id="province-help" className="text-xs text-gray-500">
                                            Choose the province where the farm is located
                                        </div>
                                        <InputError message={errors['farm.province_id']} />
                                    </div>
                                    <div>
                                        <Label>Municipality *</Label>
                                        <SearchableSelect
                                            options={farmMunicipalities.map((m) => ({ value: String(m.id), label: m.name }))}
                                            value={data.farm.municipality_id}
                                            onValueChange={(val) => {
                                                setData('farm.municipality_id', val);
                                                setData('farm.barangay_id', '');
                                            }}
                                            placeholder="Select Municipality"
                                            disabled={!data.farm.province_id}
                                            portalContainer={document.getElementById('farm-form')}
                                        />
                                        <div id="municipality-help" className="text-xs text-gray-500">
                                            {!data.farm.province_id
                                                ? 'Province must be selected first'
                                                : 'Choose the municipality within the selected province'}
                                        </div>
                                        <InputError message={errors['farm.municipality_id']} />
                                    </div>
                                    <div>
                                        <Label>Barangay *</Label>
                                        <SearchableSelect
                                            options={farmBarangays.map((b) => ({ value: String(b.id), label: b.name }))}
                                            value={data.farm.barangay_id}
                                            onValueChange={(val) => setData('farm.barangay_id', val)}
                                            placeholder="Select Barangay"
                                            disabled={!data.farm.municipality_id}
                                            portalContainer={document.getElementById('farm-form')}
                                        />
                                        <div id="barangay-help" className="text-xs text-gray-500">
                                            {!data.farm.municipality_id
                                                ? 'Municipality must be selected first'
                                                : 'Choose the barangay within the selected municipality'}
                                        </div>
                                        <InputError message={errors['farm.barangay_id']} />
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="flex justify-between">
                            <Button type="button" onClick={() => setStep(1)} variant="outline">
                                Back
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    processing ||
                                    !data.farm.name ||
                                    !data.farm.cropping_system ||
                                    !data.farm.province_id ||
                                    !data.farm.municipality_id ||
                                    !data.farm.barangay_id
                                }
                                className="bg-[#619154] text-white hover:bg-[#4F7A43]"
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
