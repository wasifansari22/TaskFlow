const API_BASE_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("taskflow-token");

    return {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
    };
};

export const getProjects = async () => {
    const response = await fetch(
        `${API_BASE_URL}/projects/`,
        {
            method: "GET",
            headers: getAuthHeaders(),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Failed to fetch projects."
        );
    }

    return data;
};

export const createProjectRequest = async (projectData) => {
    const response = await fetch(
        `${API_BASE_URL}/projects/`,
        {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(projectData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Failed to create project."
        );
    }

    return data;
};

export const updateProjectRequest = async (
    id,
    projectData
) => {
    const response = await fetch(
        `${API_BASE_URL}/projects/${id}/`,
        {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(projectData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Failed to update project."
        );
    }

    return data;
};

export const deleteProjectRequest = async (id) => {
    const response = await fetch(
        `${API_BASE_URL}/projects/${id}/`,
        {
            method: "DELETE",
            headers: getAuthHeaders(),
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
            data.detail || "Failed to delete project."
        );
    }

    return id;
};