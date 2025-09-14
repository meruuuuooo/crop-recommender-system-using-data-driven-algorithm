import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Recommendation, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function showCropRecommendation({ recommendation }: { recommendation: Recommendation }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Recommendation',
            href: '/recommendation/crop',
        },
        {
            title: `${recommendation.crop?.name}`,
            href: '/recommendation/crop/show',
        },
    ];

    console.log(recommendation);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crop Recommendation" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-8">
                <Card className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">

                    

                </Card>
            </div>
        </AppLayout>
    );
}
