export const selectAllProjects = (state) =>
    state.projects.projects;

export const selectProjectCount = (state) =>
    state.projects.projects.length;

export const selectActiveProjects = (state) =>
    state.projects.projects.filter(
        (project) => project.status === "Active"
    );

export const selectCompletedProjects = (state) =>
    state.projects.projects.filter(
        (project) => project.status === "Completed"
    );

export const selectOnHoldProjects = (state) =>
    state.projects.projects.filter(
        (project) => project.status === "On Hold"
    );