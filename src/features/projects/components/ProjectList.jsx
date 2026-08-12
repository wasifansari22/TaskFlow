import { useSelector } from "react-redux";
import ProjectCard from "./ProjectCard";
import { selectAllProjects } from "../projectSelectors";

function ProjectList({ filter, search }) {
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
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="font-medium text-slate-900">
                    No projects found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or filter.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 xl:grid-cols-2">
            {filteredProjects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                />
            ))}
        </div>
    );
}

export default ProjectList;