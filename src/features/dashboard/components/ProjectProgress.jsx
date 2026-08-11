import { ArrowRight } from "lucide-react";

const projects = [
    {
        name: "Website Redesign",
        progress: 75,
        tasks: "12 / 16 tasks",
    },
    {
        name: "Mobile Application",
        progress: 60,
        tasks: "9 / 15 tasks",
    },
    {
        name: "Portfolio Website",
        progress: 40,
        tasks: "4 / 10 tasks",
    },
];

const ProjectProgress = () => {
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

                <button
                    type="button"
                    className="hidden items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700 sm:flex"
                >
                    View all
                    <ArrowRight size={16} />
                </button>
            </div>

            <div className="mt-6 space-y-6">
                {projects.map((project) => (
                    <div key={project.name}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-900">
                                    {project.name}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {project.tasks}
                                </p>
                            </div>

                            <span className="text-sm font-semibold text-slate-700">
                                {project.progress}%
                            </span>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-blue-600 transition-all"
                                style={{ width: `${project.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectProgress;