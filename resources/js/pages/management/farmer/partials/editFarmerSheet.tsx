import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { type EditFarmerProps, type LocationProps } from '@/types/farmer';
import { useForm, usePage } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

interface FarmerIndexPropsExtended extends EditFarmerProps {
    farmer: EditFarmerProps['farmer'];
    asMenuItem?: boolean;
}

interface Location extends LocationProps {
    provinces: LocationProps['provinces'];
    municipalities: LocationProps['municipalities'];
    barangays: LocationProps['barangays'];
}

export default function EditFarmerSheet({ farmer }: FarmerIndexPropsExtended) {
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
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 w-8 cursor-pointer border-[#D6E3D4] p-0 hover:border-[#619154] hover:bg-[#F8FAF8]">
                    <Edit className="h-4 w-4 text-[#619154]" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-xl lg:max-w-2xl bg-white">
                <div className="flex h-full flex-col">
                    <SheetHeader className="space-y-1 border-b border-gray-200 px-4 py-4 sm:px-6">
                        <SheetTitle className="text-base font-semibold text-gray-900 sm:text-lg">Edit Farmer Information</SheetTitle>
                        <SheetDescription className="text-xs text-gray-600 sm:text-sm">
                            Update the farmer&apos;s personal and contact details.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-2 py-2 sm:px-4 sm:py-4">
                        <form onSubmit={submit} id="farmer-form" className="space-y-2 sm:space-y-4" noValidate>
                            {/* Personal Information */}
                            <div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstname" className="text-xs font-medium text-gray-700 sm:text-sm">
                                            First Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="firstname"
                                            name="first_name"
                                            className="h-9 text-sm text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154] sm:h-10"
                                            value={data.firstname}
                                            onChange={(e) => setData('firstname', e.target.value)}
                                            required
                                            autoComplete="given-name"
                                            placeholder="Enter first name"
                                            maxLength={50}
                                        />
                                        <InputError message={errors.firstname} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="middlename" className="text-xs font-medium text-gray-700 sm:text-sm">
                                            Middle Name <span className="text-xs text-gray-500">(Optional)</span>
                                        </Label>
                                        <Input
                                            id="middlename"
                                            name="middle_name"
                                            className="h-9 text-sm text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154] sm:h-10"
                                            value={data.middlename}
                                            onChange={(e) => setData('middlename', e.target.value)}
                                            autoComplete="additional-name"
                                            placeholder="Enter middle name"
                                            maxLength={50}
                                        />
                                        <InputError message={errors.middlename} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastname" className="text-xs font-medium text-gray-700 sm:text-sm">
                                            Last Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="lastname"
                                            name="last_name"
                                            className="h-9 text-sm text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154] sm:h-10"
                                            value={data.lastname}
                                            onChange={(e) => setData('lastname', e.target.value)}
                                            required
                                            autoComplete="family-name"
                                            placeholder="Enter last name"
                                            maxLength={50}
                                        />
                                        <InputError message={errors.lastname} />
                                    </div>
                                </div>
                            </div>

                            {/* Contact & Experience */}
                            <div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="contactNumber" className="text-xs font-medium text-gray-700 sm:text-sm">
                                            Contact Number <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="contactNumber"
                                            name="contact_number"
                                            className="h-9 text-sm text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154] sm:h-10"
                                            value={data.contact_number}
                                            onChange={(e) => setData('contact_number', e.target.value)}
                                            required
                                            autoComplete="tel"
                                            placeholder="09123456789"
                                            type="tel"
                                            maxLength={15}
                                        />
                                        <div className="text-xs text-gray-500">Numbers only, max 15 characters</div>
                                        <InputError message={errors.contact_number} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="farmingExperience" className="text-xs font-medium text-gray-700 sm:text-sm">
                                            Farming Experience (Years) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="farmingExperience"
                                            name="farming_experience"
                                            className="h-9 text-sm text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154] sm:h-10"
                                            value={data.farming_experience}
                                            onChange={(e) => setData('farming_experience', e.target.value)}
                                            autoComplete="off"
                                            placeholder="e.g., 5"
                                            type="number"
                                            min="0"
                                            max="80"
                                            step="1"
                                        />
                                        <div className="text-xs text-gray-500">Years of farming experience (0-80)</div>
                                        <InputError message={errors.farming_experience} />
                                    </div>
                                </div>
                            </div>

                            {/* Home Address */}
                            <div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-gray-700 sm:text-sm">
                                            Province <span className="text-red-500">*</span>
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
                                        <div className="text-xs text-gray-500">Choose the province</div>
                                        <InputError message={errors.province_id} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-gray-700 sm:text-sm">
                                            Municipality <span className="text-red-500">*</span>
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
                                        <div className="text-xs text-gray-500">
                                            {!data.province_id ? 'Select province first' : 'Choose the municipality'}
                                        </div>
                                        <InputError message={errors.municipality_id} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-gray-700 sm:text-sm">
                                            Barangay <span className="text-red-500">*</span>
                                        </Label>
                                        <SearchableSelect
                                            options={farmerBarangays.map((b) => ({ value: String(b.id), label: b.name }))}
                                            value={data.barangay_id}
                                            onValueChange={(val) => setData('barangay_id', val)}
                                            placeholder="Select Barangay"
                                            disabled={!data.municipality_id}
                                            portalContainer={document.getElementById('farmer-form')}
                                        />
                                        <div className="text-xs text-gray-500">
                                            {!data.municipality_id ? 'Select municipality first' : 'Choose the barangay'}
                                        </div>
                                        <InputError message={errors.barangay_id} />
                                    </div>

                                    <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                                        <Label htmlFor="street" className="text-xs font-medium text-gray-700 sm:text-sm">
                                            Street Address <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="street"
                                            name="street"
                                            className="h-9 text-sm text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154] sm:h-10"
                                            value={data.street}
                                            onChange={(e) => setData('street', e.target.value)}
                                            required
                                            autoComplete="street-address"
                                            placeholder="Enter street address"
                                            maxLength={60}
                                        />
                                        <div className="text-xs text-gray-500">House number, street name, etc.</div>
                                        <InputError message={errors.street} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <SheetFooter className="border-t border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
                            <SheetClose asChild>
                                <Button type="button" variant="outline" className="w-full sm:w-auto">
                                    Cancel
                                </Button>
                            </SheetClose>
                            <Button
                                type="submit"
                                form="farmer-form"
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
                                className="w-full bg-[#619154] text-white hover:bg-[#4F7A43] sm:w-auto"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}
