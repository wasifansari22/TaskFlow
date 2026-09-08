import { ArrowRight, FolderKanban } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { selectDashboardProjects } from "../dashboardSelectors";

const ProjectProgress = () => {
    const projects = useSelector(selectDashboardProjects);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-slate-900">
                        Project Progress
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Track the progress of your active projects.
                    </p>
                </div>

                <Link
                    to="/projects"
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                >
                    View all
                    <ArrowRight size={16} />
                </Link>
            </div>

            <div className="mt-6">
                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <FolderKanban
                                size={24}
                                className="text-slate-400"
                            />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-slate-900">
                            No active projects
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                            Create a project to start tracking your progress.
                        </p>

                        <Link
                            to="/projects"
                            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Create Project
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {projects.slice(0, 4).map((project) => (
                            <div key={project.id}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            {project.name}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {project.completedTasks} / {project.totalTasks} tasks
                                        </p>
                                    </div>

                                    <span className="text-sm font-semibold text-slate-700">
                                        {project.progress}%
                                    </span>
                                </div>

                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-blue-600 transition-all"
                                        style={{
                                            width: `${project.progress}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectProgress;