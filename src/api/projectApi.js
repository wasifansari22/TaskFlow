import apiRequest from "./apiClient";

export const getProjects = async () => {
    return await apiRequest("/projects/");
};

export const createProjectRequest = async (projectData) => {
    return await apiRequest("/projects/", {
        method: "POST",
        body: JSON.stringify(projectData),
    });
};

export const updateProjectRequest = async (id, projectData) => {
    return await apiRequest(`/projects/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(projectData),
    });
};

export const deleteProjectRequest = async (id) => {
    await apiRequest(`/projects/${id}/`, {
        method: "DELETE",
    });

    return id;
};