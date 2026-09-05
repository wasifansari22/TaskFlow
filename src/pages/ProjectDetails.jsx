import { Link, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { CalendarDays, CheckCircle2, Circle, Clock3 } from "lucide-react";
import { selectAllProjects, selectProjectProgress, } from "../features/projects/projectSelectors";
import { selectTasksByProject } from "../features/tasks/taskSelectors";
import { fetchProjects } from "../features/projects/projectSlice";
import { fetchTasks } from "../features/tasks/taskSlice";
import { useEffect } from "react";

const ProjectDetails = () => {
    const { projectId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProjects());
        dispatch(fetchTasks());
    }, [dispatch]);

    const project = useSelector((state) =>
        selectAllProjects(state).find(
            (item) => Number(item.id) === Number(projectId)
        )
    );

    const projectStatus = useSelector(
        (state) => state.projects.status
    );

    const projectError = useSelector(
        (state) => state.projects.error
    )

    const projectTasks = useSelector((state) =>
        selectTasksByProject(state, projectId)
    );

    const progress = useSelector((state) =>
        selectProjectProgress(state, projectId)
    );

    if (projectStatus === "loading" || projectStatus === "idle") {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <p className="text-sm text-slate-500">
                    Loading project...
                </p>
            </div>
        );
    }

    if (projectStatus === "failed") {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <h1 className="text-2xl font-bold text-slate-900">
                    Unable to load project
                </h1>

                <p className="mt-2 max-w-md text-sm text-slate-500">
                    {projectError ||
                        "Something went wrong while loading this project."}
                </p>

                <button
                    type="button"
                    onClick={() => {
                        dispatch(fetchProjects());
                        dispatch(fetchTasks());
                    }}
                    className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    Try Again
                </button>

                <Link
                    to="/projects"
                    className="mt-3 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                    Back to Projects
                </Link>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <h1 className="text-2xl font-bold text-slate-900">
                    Project not found
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    The project you're looking for doesn't exist.
                </p>

                <Link
                    to="/projects"
                    className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    Back to Projects
                </Link>
            </div>
        );
    }

    const completedTasks = projectTasks.filter(
        (task) => task.status === "Completed"
    ).length;

    const inProgressTasks = projectTasks.filter(
        (task) => task.status === "In Progress"
    ).length;

    const pendingTasks = projectTasks.filter(
        (task) => task.status === "Pending"
    ).length;

    const priorityStyle =
        project.priority === "High"
            ? "bg-rose-50 text-rose-700"
            : project.priority === "Medium"
                ? "bg-amber-50 text-amber-700"
                : "bg-slate-100 text-slate-600";

    const statusStyle =
        project.status === "Completed"
            ? "bg-emerald-50 text-emerald-700"
            : project.status === "On Hold"
                ? "bg-slate-100 text-slate-600"
                : "bg-blue-50 text-blue-700";

    return (
        <div className="space-y-6 p-4 sm:p-6">

            {/* Back navigation */}
            <Link
                to="/projects"
                className="inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
                ← Back to Projects
            </Link>

            {/* Project Header */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                {project.name}
                            </h1>

                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyle}`}
                            >
                                {project.priority}
                            </span>

                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle}`}
                            >
                                {project.status}
                            </span>
                        </div>

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                            {project.description}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays size={16} />

                            <span>
                                Due {project.dueDate}
                            </span>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="w-full shrink-0 lg:w-56">
                        <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-600">
                                Progress
                            </span>

                            <span className="font-semibold text-slate-900">
                                {progress}%
                            </span>
                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                style={{
                                    width: `${progress}%`,
                                }}
                            />
                        </div>

                        <p className="mt-2 text-xs text-slate-400">
                            {completedTasks} of{" "}
                            {projectTasks.length} tasks completed
                        </p>
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">
                        Total Tasks
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                        {projectTasks.length}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">
                        Completed
                    </p>

                    <p className="mt-2 text-2xl font-bold text-emerald-600">
                        {completedTasks}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">
                        In Progress
                    </p>

                    <p className="mt-2 text-2xl font-bold text-blue-600">
                        {inProgressTasks}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">
                        Pending
                    </p>

                    <p className="mt-2 text-2xl font-bold text-amber-600">
                        {pendingTasks}
                    </p>
                </div>
            </div>

            {/* Project Tasks */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 p-5 sm:p-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Project Tasks
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Tasks assigned to this project.
                    </p>
                </div>

                {projectTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <Circle size={22} />
                        </div>

                        <h3 className="mt-4 font-medium text-slate-900">
                            No tasks yet
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                            There are no tasks assigned to this project yet.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">

                        {projectTasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                            >
                                <div className="flex min-w-0 items-start gap-3">

                                    <div className="mt-0.5 shrink-0">
                                        {task.status === "Completed" ? (
                                            <CheckCircle2
                                                size={20}
                                                className="text-emerald-500"
                                            />
                                        ) : task.status === "In Progress" ? (
                                            <Clock3
                                                size={20}
                                                className="text-blue-500"
                                            />
                                        ) : (
                                            <Circle
                                                size={20}
                                                className="text-slate-300"
                                            />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <h3
                                            className={`font-medium ${task.status === "Completed"
                                                ? "text-slate-400 line-through"
                                                : "text-slate-900"
                                                }`}
                                        >
                                            {task.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {task.description}
                                        </p>

                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                            <span>
                                                Due {task.dueDate}
                                            </span>

                                            <span>•</span>

                                            <span>
                                                {task.priority} Priority
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <span
                                    className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${task.status === "Completed"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : task.status === "In Progress"
                                            ? "bg-blue-50 text-blue-700"
                                            : "bg-amber-50 text-amber-700"
                                        }`}
                                >
                                    {task.status}
                                </span>
                            </div>
                        ))}

                    </div>
                )}
            </section>
        </div>
    );
};

export default ProjectDetails;