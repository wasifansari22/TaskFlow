import StatCard from "../features/dashboard/components/StatCard";
import ProjectProgress from "../features/dashboard/components/ProjectProgress";
import QuickActions from "../features/dashboard/components/QuickActions";
import RecentTasks from "../features/dashboard/components/RecentTasks";
import { dashboardStats } from "../features/dashboard/dashboardData";

const Dashboard = () => {
    return (
        <div className="mx-auto w-full max-w-7xl space-y-8">
            {/* Page Header */}
            <section>
                <p className="text-sm font-medium text-blue-600">
                    Overview
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    Dashboard
                </h1>

                <p className="mt-2 max-w-2xl text-slate-600">
                    Welcome back. Here's what's happening with your work.
                </p>
            </section>

            {/* Statistics */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardStats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        description={stat.description}
                        icon={stat.icon}
                        iconStyle={stat.iconStyle}
                    />
                ))}
            </section>

            {/* Projects + Quick Actions */}
            <section className="grid gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <ProjectProgress />
                </div>

                <QuickActions />
            </section>

            {/* Recent Tasks */}
            <section>
                <RecentTasks />
            </section>
        </div>
    );
}

export default Dashboard;