const API_BASE_URL = "http://127.0.0.1:8000/api";

const mapTaskFromBackend = (task) => ({
    ...task,
    dueDate: task.due_date || "No due date",
    projectId: task.project ? String(task.project) : null,
});

export const getTasks = async () => {
    const token = localStorage.getItem("taskflow-token");

    const response = await fetch(`${API_BASE_URL}/tasks/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Failed to fetch tasks."
        );
    }

    return data.map(mapTaskFromBackend);
};

export const createTaskRequest = async (taskData) => {
    const token = localStorage.getItem("taskflow-token");

    const response = await fetch(`${API_BASE_URL}/tasks/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Failed to create task."
        );
    }

    return mapTaskFromBackend(data);
};

export const updateTaskRequest = async (id, taskData) => {
    const token = localStorage.getItem("taskflow-token");

    const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Failed to update task."
        );
    }

    return mapTaskFromBackend(data);
};

export const deleteTaskRequest = async (id) => {
    const token = localStorage.getItem("taskflow-token");

    const response = await fetch(
        `${API_BASE_URL}/tasks/${id}/`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    );

    if (!response.ok) {
        let data = {};

        try {
            data = await response.json();
        } catch {
            // DELETE may return an empty response.
        }

        throw new Error(
            data.detail || "Failed to delete task."
        );
    }

    return id;
};