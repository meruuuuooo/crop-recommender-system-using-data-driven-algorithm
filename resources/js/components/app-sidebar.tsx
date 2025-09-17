import { NavFooter } from '@/components/nav-footer';
import { NavMainCollapsible } from '@/components/nav-main-collapsible';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Calendar, File, Folder, LayoutGrid, ScrollText, FlaskConical, Snail, Sparkles, Sprout, Tractor, User } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Recommendation',
        href: '/recommendation',
        icon: Sparkles,

        items: [
            {
                title: 'Crop',
                href: '/recommendation/crop',
                icon: Sprout,
            },
            {
                title: 'Fertilizer',
                href: '/recommendation/fertilizer',
                icon: FlaskConical,
            },
            {
                title: 'Pesticide',
                href: '/recommendation/pesticide',
                icon: Snail,
            },
        ],
    },
    {
        title: 'Management',
        href: '/management',
        icon: File,

        items: [
            {
                title: 'Farmer',
                href: '/management/farmer',
                icon: User,
            },
            {
                title: 'Farm',
                href: '/management/farm',
                icon: Tractor,
            },
            // {
            //     title: 'Crop',
            //     href: '/management/crop',
            //     icon: Sprout,
            // },
        ],
    },
    {
        title: 'Crop Calendar',
        href: '/crop/calendar',
        icon: Calendar,
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: ScrollText,

        items: [
            {
                title: 'All Reports',
                href: '/reports',
                icon: ScrollText,
            },
            {
                title: 'Report 1',
                href: '/reports/report1',
                icon: ScrollText,
            },
            {
                title: 'Report 2',
                href: '/reports/report2',
                icon: ScrollText,
            },
            {
                title: 'Report 3',
                href: '/reports/report3',
                icon: ScrollText,
            },
            {
                title: 'Report 4',
                href: '/reports/report4',
                icon: ScrollText,
            },
            {
                title: 'Report 5',
                href: '/reports/report5',
                icon: ScrollText,
            },
            {
                title: 'Report 7',
                href: '/reports/report7',
                icon: ScrollText,
            },
            {
                title: 'Report 9',
                href: '/reports/report9',
                icon: ScrollText,
            },
        ]
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMainCollapsible items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
