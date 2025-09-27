import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { type EditFarmerProps } from '@/types/farmer';
import { useForm } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { usePage } from '@inertiajs/react';
import { type LocationProps } from '@/types/farmer';

interface FarmerIndexPropsExtended extends EditFarmerProps {
    farmer: EditFarmerProps['farmer'];
    asMenuItem?: boolean;
}

interface Location extends LocationProps {
    provinces: LocationProps['provinces'];
    municipalities: LocationProps['municipalities'];
    barangays: LocationProps['barangays'];
}

export default function EditFarmerFormDialog({ farmer, asMenuItem }: FarmerIndexPropsExtended) {
    const { provinces, municipalities, barangays } = usePage().props as unknown as Location;
    
    
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        firstname: farmer.firstname || '',
        middlename: farmer.middlename || '',
        lastname: farmer.lastname || '',
        contact_number: farmer.contact_number || '',
        farming_experience: farmer.farming_experience || '',
        province_id: String(farmer.location?.province_id || ''),
        municipality_id: String(farmer.location?.municipality_id || ''),
        barangay_id: String(farmer.location?.barangay_id || ''),
        street: farmer.location?.street || '',
    });

    const farmerMunicipalities = municipalities.filter((m) => String(m.province_id) === data.province_id);
    const farmerBarangays = barangays.filter((b) => String(b.municipality_id) === data.municipality_id);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('management.farmer.update', farmer.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success('Farmer updated successfully!');
                setOpen(false);
            },
            onError: (errors) => {
                console.log('Form errors:', errors);
                toast.error('Please fix the errors in the form.');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
                {asMenuItem ? (
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                ) : (
                    <Button size="sm" variant="outline" className="h-8 w-8 cursor-pointer border-[#D6E3D4] p-0 hover:border-[#619154] hover:bg-[#F8FAF8]">
                        <Edit className="h-4 w-4 text-[#619154]" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-h-[800px] overflow-y-auto rounded-xl bg-white p-8 sm:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Farm Information</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">Fill in the details about the farmer’s farm.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} id="farmer-form" className="space-y-6" noValidate>
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
                                value={data.firstname}
                                onChange={(e) => setData('firstname', e.target.value)}
                                required
                                autoComplete="given-name"
                                placeholder="Enter first name"
                            />
                            <InputError message={errors['firstname']} id="firstname-error" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="middlename" className="text-sm font-medium text-gray-700">
                                Middle Name <span className="text-xs text-gray-500">(Optional)</span>
                            </Label>
                            <Input
                                id="middlename"
                                name="middle_name"
                                className="w-full text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                value={data.middlename}
                                onChange={(e) => setData('middlename', e.target.value)}
                                autoComplete="additional-name"
                                placeholder="Enter middle name"
                            />
                            <InputError message={errors['middlename']} id="middlename-error" />
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
                                value={data.lastname}
                                onChange={(e) => setData('lastname', e.target.value)}
                                required
                                autoComplete="family-name"
                                placeholder="Enter last name"
                            />
                            <InputError message={errors['lastname']} id="lastname-error" />
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
                                value={data.contact_number}
                                onChange={(e) => setData('contact_number', e.target.value)}
                                required
                                autoComplete="tel"
                                placeholder="Enter contact number (e.g., +63 912 345 6789)"
                                type="tel"
                                pattern="[+]?[0-9\s\-\(\)]+"
                            />
                            <div id="contact-number-help" className="text-xs text-gray-500">
                                Include country code and mobile number
                            </div>
                            <InputError message={errors['contact_number']} id="contact-number-error" />
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
                                value={data.farming_experience}
                                onChange={(e) => setData('farming_experience', e.target.value)}
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
                            <InputError message={errors['farming_experience']} id="farming-experience-error" />
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
                                value={data.province_id}
                                onValueChange={(val) => {
                                    setData('province_id', val);
                                    setData('municipality_id', '');
                                    setData('barangay_id', '');
                                }}
                                placeholder="Select Province"
                                portalContainer={document.getElementById('farmer-form')}
                            />
                            <div id="province-help" className="text-xs text-gray-500">
                                Choose the province where the farm is located
                            </div>
                            <InputError message={errors['province_id']} />
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
                                value={data.municipality_id}
                                onValueChange={(val) => {
                                    setData('municipality_id', val);
                                    setData('barangay_id', '');
                                }}
                                placeholder="Select Municipality"
                                disabled={!data.province_id}
                                portalContainer={document.getElementById('farmer-form')}
                            />
                            <div id="municipality-help" className="text-xs text-gray-500">
                                {!data.province_id ? 'Province must be selected first' : 'Choose the municipality within the selected province'}
                            </div>
                            <InputError message={errors['municipality_id']} />
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
                                value={data.barangay_id}
                                onValueChange={(val) => setData('barangay_id', val)}
                                placeholder="Select Barangay"
                                disabled={!data.municipality_id}
                                portalContainer={document.getElementById('farmer-form')}
                            />
                            <div id="barangay-help" className="text-xs text-gray-500">
                                {!data.municipality_id
                                    ? 'Municipality must be selected first'
                                    : 'Choose the barangay within the selected municipality'}
                            </div>
                            <InputError message={errors['barangay_id']} />
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
                            value={data.street}
                            onChange={(e) => setData('street', e.target.value)}
                            required
                            autoComplete="street-address"
                            placeholder="Enter street address"
                        />
                        <InputError message={errors['street']} id="street-error" />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            id="farmer-form"
                            disabled={
                                processing ||
                                !data.firstname ||
                                !data.lastname ||
                                !data.contact_number ||
                                !data.farming_experience ||
                                !data.province_id ||
                                !data.municipality_id ||
                                !data.barangay_id ||
                                !data.street
                            }
                            className="bg-[#619154] text-white hover:bg-[#4F7A43]"
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}