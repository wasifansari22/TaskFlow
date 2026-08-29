import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProjects, createProject, updateProject, deleteProject, } from "../../api/projectApi";

// const initialProjects = [
//     {
//         id: "project-1",
//         name: "TaskFlow",
//         description:
//             "Build a modern productivity application for managing tasks and projects.",
//         status: "Active",
//         priority: "High",
//         dueDate: "2026-09-01",
//     },
//     {
//         id: "project-2",
//         name: "Portfolio Website",
//         description:
//             "Create a professional developer portfolio showcasing projects and skills.",
//         status: "Active",
//         priority: "Medium",
//         dueDate: "2026-08-25",
//     },
//     {
//         id: "project-3",
//         name: "Weather Dashboard",
//         description:
//             "Build a responsive weather dashboard using a public API.",
//         status: "Completed",
//         priority: "Low",
//         dueDate: "2026-08-05",
//     },
// ];

const initialState = {
    projects: [],
    status: "idle",
    error: null,
};

export const fetchProjects = createAsyncThunk(
    "projects/fetchProjects",
    async (_, thunkAPI) => {
        try {
            return await getProjects();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const createProjectAsync = createAsyncThunk(
    "projects/createProject",
    async (projectData, thunkAPI) => {
        try {
            const backendProject = {
                name: projectData.name,
                description: projectData.description,
                priority: projectData.priority,
                status: projectData.status,
                due_date:
                    projectData.dueDate === "No due date"
                        ? null
                        : projectData.dueDate,
            };

            return await createProject(backendProject);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateProjectAsync = createAsyncThunk(
    "projects/updateProject",
    async ({ id, updates }, thunkAPI) => {
        try {
            const backendUpdates = {
                name: updates.name,
                description: updates.description,
                priority: updates.priority,
                status: updates.status,
                due_date:
                    updates.dueDate === "No due date"
                        ? null
                        : updates.dueDate,
            };

            return await updateProject(id, backendUpdates);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deleteProjectAsync = createAsyncThunk(
    "projects/deleteProject",
    async (id, thunkAPI) => {
        try {
            await deleteProject(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const projectSlice = createSlice({
    name: "projects",
    initialState,
    // reducers: {
    //     addProject: (state, action) => {
    //         state.projects.unshift(action.payload);
    //     },

    //     updateProjectStatus: (state, action) => {
    //         const { id, status } = action.payload;
    //         const project = state.projects.find((project) => project.id === id);
    //         if (!project) return;
    //         project.status = status;
    //     },

    //     deleteProject: (state, action) => {
    //         state.projects = state.projects.filter((project) => project.id !== action.payload);
    //     },

    //     updateProject: (state, action) => {
    //         const { id, updates } = action.payload;
    //         const project = state.projects.find((project) => project.id === id);
    //         if (!project) return;
    //         Object.assign(project, updates);
    //     },
    // },
    extraReducers: (builder) => {
        builder

            // Get
            .addCase(fetchProjects.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.projects = action.payload;
            })

            .addCase(fetchProjects.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Create
            .addCase(createProjectAsync.fulfilled, (state, action) => {
                state.projects.unshift(action.payload);
            })

            // Update
            .addCase(updateProjectAsync.fulfilled, (state, action) => {
                const updatedProject = action.payload;

                const index = state.projects.findIndex(
                    (project) => project.id === updatedProject.id
                );

                if (index !== -1) {
                    state.projects[index] = updatedProject;
                }
            })

            // Delete
            .addCase(deleteProjectAsync.fulfilled, (state, action) => {
                state.projects = state.projects.filter(
                    (project) => project.id !== action.payload
                );
            });
    },
});

// export const { addProject, updateProjectStatus, deleteProject, updateProject } = projectSlice.actions;
export default projectSlice.reducer;