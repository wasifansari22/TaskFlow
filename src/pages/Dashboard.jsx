import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux";
import { selectDashboardStats } from "../features/dashboard/dashboardSelectors";
import StatCard from "../features/dashboard/components/StatCard";
import ProjectProgress from "../features/dashboard/components/ProjectProgress";
import QuickActions from "../features/dashboard/components/QuickActions";
import RecentTasks from "../features/dashboard/components/RecentTasks";
import UpcomingDeadlines from "../features/dashboard/components/UpcomingDeadlines";
import TaskAnalytics from "../features/dashboard/components/TaskAnalytics";
import ProjectAnalytics from "../features/dashboard/components/ProjectAnalytics";
import { fetchTasks } from "../features/tasks/taskSlice";
import { fetchProjects } from "../features/projects/projectSlice";

const Dashboard = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchTasks());
        dispatch(fetchProjects());
    }, [dispatch]);

    const dashboardStats = useSelector(selectDashboardStats);
    const taskStatus = useSelector((state) => state.tasks.status);
    const projectStatus = useSelector((state) => state.projects.status);

    const taskError = useSelector((state) => state.tasks.error)
    const projectError = useSelector((state) => state.projects.error)

    // Combined Loading Condition
    const isLoading = taskStatus === "loading" || projectStatus === "loading";
    const hasError = taskStatus === "failed" || projectStatus === "failed";

    return (
        <div className="mx-auto w-full max-w-7xl space-y-8">
            {isLoading ? (
                <div className="flex min-h-100 items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                        <p className="mt-4 text-sm font-medium text-slate-600">
                            Loading dashboard...
                        </p>
                    </div>
                </div>
            ) : hasError ? (
                <div className="flex min-h-100 items-center justify-center">
                    <div className="max-w-md text-center">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Unable to load dashboard
                        </h2>

                        <p className="mt-2 text-sm text-slate-900">
                            {taskError || projectError || "Something went wrong while loading your dashboard."}
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                dispatch(fetchTasks());
                                dispatch(fetchProjects());
                            }}
                            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            ) : (
                <>
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
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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

                    {/* Projects and Quick Actions */}
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

                    {/* Analytics */}
                    <section className="grid gap-6 xl:grid-cols-2">
                        <TaskAnalytics />
                        <ProjectAnalytics />
                    </section>

                    {/* Upcoming Deadlines */}
                    <section>
                        <UpcomingDeadlines />
                    </section>
                </>
            )}

        </div>
    );
}

export default Dashboard;