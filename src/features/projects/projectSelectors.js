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

export const selectProjectProgress = (state, projectId) => {
    const tasks = state.tasks.tasks.filter(
        (task) => Number(task.project) === Number(projectId)
    );

    if (tasks.length === 0) {
        return 0;
    }

    const completedTasks = tasks.filter(
        (task) => task.status === "Completed"
    ).length;

    return Math.round(
        (completedTasks / tasks.length) * 100
    );
};