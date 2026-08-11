export const selectAllTasks = (state) =>
    state.tasks.tasks;

export const selectTaskCount = (state) =>
    state.tasks.tasks.length;

export const selectCompletedTasks = (state) =>
    state.tasks.tasks.filter(
        (task) => task.status === "Completed"
    );

export const selectPendingTasks = (state) =>
    state.tasks.tasks.filter(
        (task) => task.status === "Pending"
    );

export const selectInProgressTasks = (state) =>
    state.tasks.tasks.filter(
        (task) => task.status === "In Progress"
    );