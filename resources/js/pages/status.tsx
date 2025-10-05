import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Clock} from 'lucide-react';



interface Incident {
    id: number;
    title: string;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    description: string;
    timestamp: string;
    updates: Array<{
        message: string;
        timestamp: string;
        status: string;
    }>;
}

export default function StatusPage() {
    const { auth } = usePage<SharedData>().props;
    const recentIncidents: Incident[] = [
        {
            id: 1,
            title: 'Database Performance Optimization',
            status: 'resolved',
            description: 'Scheduled maintenance to optimize database queries',
            timestamp: 'Oct 1, 2025 - 14:30 PST',
            updates: [
                {
                    message: 'Maintenance completed successfully. All systems operating normally.',
                    timestamp: 'Oct 1, 2025 - 15:45 PST',
                    status: 'resolved'
                },
                {
                    message: 'Database optimization in progress. No service interruption expected.',
                    timestamp: 'Oct 1, 2025 - 14:30 PST',
                    status: 'monitoring'
                },
                {
                    message: 'Initiated scheduled maintenance for database optimization.',
                    timestamp: 'Oct 1, 2025 - 14:00 PST',
                    status: 'investigating'
                },

            ]
        }
    ];


    const getIncidentStatusColor = (status: Incident['status']) => {
        switch (status) {
            case 'resolved':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'monitoring':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'identified':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'investigating':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        }
    };

    return (
        <>
            <Head title="System Status">
                <meta name="description" content="Real-time operational status of CropTAP services" />
            </Head>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src="/cropTAPLogoSVG.svg" alt="CropTAP" className="h-8 w-8 sm:h-10 sm:w-10" />
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900 sm:text-xl dark:text-white">CropTAP Status</h1>
                                    <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">System Operational Status</p>
                                </div>
                            </div>
                            <nav className="flex items-center gap-2 sm:gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                                        >
                                            Log in
                                        </Link>

                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">


                    {/* Recent Incidents */}
                    <div className="mb-8">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">Recent Incidents</h3>
                        {recentIncidents.length === 0 ? (
                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <CheckCircle className="mx-auto h-12 w-12 text-green-500 dark:text-green-400" />
                                <p className="mt-4 text-gray-600 dark:text-gray-400">No incidents reported in the last 30 days</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentIncidents.map((incident) => (
                                    <div
                                        key={incident.id}
                                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                                    >
                                        <div className="p-4 sm:p-6">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">{incident.title}</h4>
                                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getIncidentStatusColor(incident.status)}`}>
                                                            {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{incident.description}</p>
                                                    <p className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                                                        <Clock className="h-3 w-3" />
                                                        {incident.timestamp}
                                                    </p>
                                                </div>
                                            </div>
                                            {incident.updates.length > 0 && (
                                                <div className="mt-4 space-y-3 border-t border-gray-200 pt-4 dark:border-gray-800">
                                                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">Updates</h5>
                                                    {incident.updates.map((update, idx) => (
                                                        <div key={idx} className="flex gap-3">
                                                            <div className="flex-shrink-0">
                                                                <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm text-gray-700 dark:text-gray-300">{update.message}</p>
                                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{update.timestamp}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-12 border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
                    <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-600 sm:px-6 lg:px-8 dark:text-gray-400">
                        <p>&copy; {new Date().getFullYear()} CropTAP. All rights reserved.</p>
                        <p className="mt-2">Committed to transparency and reliable service.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
