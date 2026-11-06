
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

    // Check whether any previously loaded data is available
    const hasAnyData = tasks.length > 0 || projects.length > 0;

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

    return (
        <div className="mx-auto w-full max-w-7xl space-y-8">

            {/* Initial Loading */}
            {hasNoDataAfterFailure ? (
                <div className="flex min-h-100 items-center justify-center">
                    <div className="max-w-md text-center">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-200">
                            Dashboard data unavailable
                        </h2>

                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            We couldn't retrieve your tasks or projects. Check your
                            connection and try again.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                dispatch(fetchTasks());
                                dispatch(fetchProjects());
                            }}
                            className="mt-5 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Page Header */}
                    <section>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            Overview
                        </p>

                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-300">
                            Dashboard
                        </h1>

                        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
                            Welcome back. Here's what's happening with your work.
                        </p>
                    </section>

                    {/* Refreshing Indicator */}
                    {isRefreshing && (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Refreshing dashboard data...
                        </p>
                    )}

                    {/* Task API Error */}
                    {taskStatus === "failed" && (
                        <div
                            role="alert"
                            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30 sm:flex-row sm:items-center sm:justify-between"
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
                            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30 sm:flex-row sm:items-center sm:justify-between"
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
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        {dashboardStats.map((stat) => {
                            const destinationMap = {
                                "Total Tasks": "/tasks?status=All",
                                "Pending": "/tasks?status=Pending",
                                "In Progress": "/tasks?status=In%20Progress",
                                "Completed": "/tasks?status=Completed",
                                "Active Projects": "/projects",
                            };

                            const destination =
                                destinationMap[stat.title] || "/tasks";

                            return (
                                <StatCard
                                    key={stat.title}
                                    title={stat.title}
                                    value={stat.value}
                                    description={stat.description}
                                    icon={stat.icon}
                                    iconStyle={stat.iconStyle}
                                    to={destination}
                                />
                            );
                        })}
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
};

export default Dashboard;