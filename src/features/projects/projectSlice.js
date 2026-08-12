import { createSlice } from "@reduxjs/toolkit";

const initialProjects = [
    {
        id: "project-1",
        name: "TaskFlow",
        description:
            "Build a modern productivity application for managing tasks and projects.",
        status: "Active",
        priority: "High",
        dueDate: "2026-09-01",
    },
    {
        id: "project-2",
        name: "Portfolio Website",
        description:
            "Create a professional developer portfolio showcasing projects and skills.",
        status: "Active",
        priority: "Medium",
        dueDate: "2026-08-25",
    },
    {
        id: "project-3",
        name: "Weather Dashboard",
        description:
            "Build a responsive weather dashboard using a public API.",
        status: "Completed",
        priority: "Low",
        dueDate: "2026-08-05",
    },
];

const initialState = {
    projects: initialProjects,
};

const projectSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        addProject: (state, action) => {
            state.projects.unshift(action.payload);
        },

        updateProjectStatus: (state, action) => {
            const { id, status } = action.payload;
            const project = state.projects.find((project) => project.id === id);
            if (!project) return;
            project.status = status;
        },

        deleteProject: (state, action) => {
            state.projects = state.projects.filter((project) => project.id !== action.payload);
        },
    },
});

export const { addProject, updateProjectStatus, deleteProject } = projectSlice.actions;
export default projectSlice.reducer;