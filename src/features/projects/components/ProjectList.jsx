import { useSelector } from "react-redux";
import ProjectCard from "./ProjectCard";
import { selectAllProjects } from "../projectSelectors";

function ProjectList({ filter, search, onEdit, onClearFilters }) {
    const projects = useSelector(selectAllProjects);

    const filteredProjects = projects.filter((project) => {
        const matchesFilter =
            filter === "All" || project.status === filter;

        const searchTerm = search.toLowerCase();

        const matchesSearch =
            project.name.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm);

        return matchesFilter && matchesSearch;
    });

    if (filteredProjects.length === 0) {
        const hasProjects = projects.length > 0;

        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="font-medium text-slate-900">
                    {hasProjects ? "No projects found" : "No projects yet"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    {hasProjects
                        ? "Try changing your search or filter."
                        : "Create your first project to start organizing your work."
                    }
                </p>

                {hasProjects && (
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
                    >
                        Clear search & filters
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="grid gap-4 xl:grid-cols-2">
            {filteredProjects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}

export default ProjectList;