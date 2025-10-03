import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Card } from '@/components/ui/card';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/settings/profile',
        icon: null,
    },
    {
        title: 'Password',
        href: '/settings/password',
        icon: null,
    },
    // {
    //     title: 'Appearance',
    //     href: '/settings/appearance',
    //     icon: null,
    // },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div>
            <div className="flex h-full flex-1 flex-col overflow-x-auto p-4">
                <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto">
                    <Card className="flex flex-col gap-4 rounded-xl bg-white p-8 dark:border-sidebar-border">
                        <div className="flex items-center justify-between">
                            <Heading title="Settings" description="Manage your profile and account settings" />
                        </div>
                        <Card className="flex flex-col gap-6 space-y-8 rounded-sm bg-white p-8 lg:flex-row lg:space-y-0 lg:space-x-12 dark:border-sidebar-border">
                            <aside className="w-full max-w-xl lg:w-48">
                                <nav className="flex flex-col space-y-1 space-x-0">
                                    {sidebarNavItems.map((item, index) => (
                                        <Button
                                            key={`${item.href}-${index}`}
                                            size="sm"
                                            variant="ghost"
                                            asChild
                                            className={cn('w-full justify-start', {
                                                'bg-muted': currentPath === item.href,
                                            })}
                                        >
                                            <Link href={item.href} prefetch>
                                                {item.title}
                                            </Link>
                                        </Button>
                                    ))}
                                </nav>
                            </aside>

                            <Separator className="my-6 md:hidden" />

                            <div className="flex-1 md:max-w-2xl">
                                <section className="max-w-xl space-y-12">{children}</section>
                            </div>
                        </Card>
                    </Card>
                </div>
            </div>
        </div>
    );
}
