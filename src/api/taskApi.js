import apiRequest from "./apiClient";

const mapTaskFromBackend = (task) => ({
    ...task,
    dueDate: task.due_date || "No due date",
    projectId: task.project ? String(task.project) : null,
});

export const getTasks = async () => {
    const data = await apiRequest("/tasks/");

    return data.map(mapTaskFromBackend);
};

export const createTaskRequest = async (taskData) => {
    const data = await apiRequest("/tasks/", {
        method: "POST",
        body: JSON.stringify(taskData),
    });

    return mapTaskFromBackend(data);
};

export const updateTaskRequest = async (id, taskData) => {
    const data = await apiRequest(`/tasks/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(taskData),
    });

    return mapTaskFromBackend(data);
};

export const deleteTaskRequest = async (id) => {
    await apiRequest(`/tasks/${id}/`, {
        method: "DELETE",
    });

    return id;
};