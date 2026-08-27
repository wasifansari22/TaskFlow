import apiRequest from "./apiClient";

export const getProjects = () => {
    return apiRequest("/projects/");
};

export const createProject = (project) => {
    return apiRequest("/projects/", {
        method: "POST",
        body: JSON.stringify(project),
    });
};

export const updateProject = (id, updates) => {
    return apiRequest(`/projects/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(updates),
    });
};

export const deleteProject = (id) => {
    return apiRequest(`/projects/${id}/`, {
        method: "DELETE",
    });
};