import { useEffect } from "react";
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

    // Dashboard data
    const dashboardStats = useSelector(selectDashboardStats);

    const tasks = useSelector((state) => state.tasks.tasks);
    const projects = useSelector((state) => state.projects.projects);

    // Loading and error states
    const taskStatus = useSelector((state) => state.tasks.status);
    const projectStatus = useSelector((state) => state.projects.status);

    const taskError = useSelector((state) => state.tasks.error);
    const projectError = useSelector((state) => state.projects.error);

    const hasTaskData = taskStatus === "succeeded" || tasks.length > 0;
    const hasProjectData = projectStatus === "succeeded" || projects.length > 0;

    const isInitialLoading =
        !hasTaskData &&
        !hasProjectData &&
        (
            taskStatus === "idle" ||
            taskStatus === "loading" ||
            projectStatus === "idle" ||
            projectStatus === "loading"
        );

    const hasNoDataAfterFailure =
        taskStatus === "failed" &&
        projectStatus === "failed" &&
        tasks.length === 0 &&
        projects.length === 0;

    const isRefreshing =
        taskStatus === "loading" || projectStatus === "loading";

    const handleRetryTasks = () => {
        dispatch(fetchTasks());
    };

    const handleRetryProjects = () => {
        dispatch(fetchProjects());
    };

    const handleRetryAll = () => {
        dispatch(fetchTasks());
        dispatch(fetchProjects());
    };

    const destinationMap = {
        "Total Tasks": "/tasks?status=All",
        "Pending": "/tasks?status=Pending",
        "In Progress": "/tasks?status=In%20Progress",
        "Completed": "/tasks?status=Completed",
        "Active Projects": "/projects",
    };

    return (
        <div className="mx-auto w-full max-w-340 space-y-6">

            {/* Initial Loading */}
            {isInitialLoading ? (
                <div className="flex min-h-[60vh] flex-col items-center justify-center">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />

                    <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                        Preparing your dashboard...
                    </p>
                </div>
            ) : hasNoDataAfterFailure ? (

                /* Dashboard Unavailable */
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Dashboard data unavailable
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            We couldn't retrieve your tasks or projects.
                            Check your connection and try again.
                        </p>

                        <button
                            type="button"
                            onClick={handleRetryAll}
                            className="mt-5 cursor-pointer rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Dashboard Header */}
                    <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                                Dashboard
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Here's an overview of your projects and tasks.
                            </p>
                        </div>

                        {isRefreshing && (
                            <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
                                Refreshing dashboard data...
                            </div>
                        )}
                    </section>

                    {/* Task API Error */}
                    {taskStatus === "failed" && (
                        <div
                            role="alert"
                            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-950/30 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <h2 className="font-semibold text-red-800 dark:text-red-300">
                                    Unable to load tasks
                                </h2>
                                <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                                    {taskError || "Something went wrong while loading tasks."}
                                </p>
                                {tasks.length > 0 && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                        Previously loaded tasks are still displayed.
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleRetryTasks}
                                disabled={taskStatus === "loading"}
                                className="w-fit shrink-0 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Project API Error */}
                    {projectStatus === "failed" && (
                        <div
                            role="alert"
                            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-950/30 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <h2 className="font-semibold text-red-800 dark:text-red-300">
                                    Unable to load projects
                                </h2>
                                <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                                    {projectError || "Something went wrong while loading projects."}
                                </p>
                                {projects.length > 0 && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                        Previously loaded projects are still displayed.
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleRetryProjects}
                                disabled={projectStatus === "loading"}
                                className="w-fit shrink-0 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Statistics */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                        {dashboardStats.map((stat) => (
                            <StatCard
                                key={stat.title}
                                title={stat.title}
                                value={stat.value}
                                description={stat.description}
                                icon={stat.icon}
                                iconStyle={stat.iconStyle}
                                to={destinationMap[stat.title] || "/tasks"}
                            />
                        ))}
                    </section>

                    {/* Analytics */}
                    <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-5">
                        <div className="min-w-0 xl:col-span-3">
                            <ProjectAnalytics />
                        </div>

                        <div className="min-w-0 xl:col-span-2">
                            <TaskAnalytics />
                        </div>
                    </section>

                    {/* Project Progress and Upcoming Deadlines */}
                    <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-5">
                        <div className="min-w-0 xl:col-span-2">
                            <ProjectProgress />
                        </div>

                        <div className="min-w-0 xl:col-span-3">
                            <UpcomingDeadlines />
                        </div>
                    </section>

                    {/* Recent Tasks and Quick Actions */}
                    <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-5">
                        <div className="min-w-0 xl:col-span-3">
                            <RecentTasks />
                        </div>

                        <div className="min-w-0 xl:col-span-2">
                            <QuickActions />
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default Dashboard;