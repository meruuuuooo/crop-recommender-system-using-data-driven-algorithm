import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    firstname: string;
    middlename: string;
    lastname: string;
    contact_number: string;
    email: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name ?? '',
        firstname: auth.user.firstname ?? '',
        middlename: auth.user.middlename ?? '',
        lastname: auth.user.lastname ?? '',
        contact_number: auth.user.contact_number ?? '',
        email: auth.user.email ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => toast.success('Profile updated successfully.'),
            onError: () => toast.error('Failed to update profile.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2 md:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="first_name">First name</Label>

                                <Input
                                    id="first_name"
                                    className="mt-1 block w-full"
                                    value={data.firstname}
                                    onChange={(e) => setData('firstname', e.target.value)}
                                    required
                                    autoComplete="given-name"
                                    placeholder="First name"
                                />

                                <InputError className="mt-2" message={errors.firstname} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="middle_name">Middle name</Label>

                                <Input
                                    id="middle_name"
                                    className="mt-1 block w-full"
                                    value={data.middlename}
                                    onChange={(e) => setData('middlename', e.target.value)}
                                    autoComplete="additional-name"
                                    placeholder="Middle name"
                                />

                                <InputError className="mt-2" message={errors.middlename} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="last_name">Last name</Label>

                                <Input
                                    id="last_name"
                                    className="mt-1 block w-full"
                                    value={data.lastname}
                                    onChange={(e) => setData('lastname', e.target.value)}
                                    autoComplete="family-name"
                                    placeholder="Last name"
                                />

                                <InputError className="mt-2" message={errors.lastname} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="contact_number">Contact number</Label>

                            <Input
                                id="contact_number"
                                className="mt-1 block w-full"
                                value={data.contact_number}
                                onChange={(e) => setData('contact_number', e.target.value)}
                                required
                                autoComplete="tel"
                                placeholder="Contact number"
                            />

                            <InputError className="mt-2" message={errors.contact_number} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
