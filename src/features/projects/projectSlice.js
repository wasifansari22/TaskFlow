import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProjects, createProjectRequest, updateProjectRequest, deleteProjectRequest, } from "../../api/projectApi";
import { readUserDataCache } from "../../utils/userDataCache";

// Transition Layer
const normalizeProject = (project) => ({
    ...project,
    dueDate: project.due_date || "No due date",
});

const getInitialProjectsState = () => {
    let userId = null;

    try {
        const auth = JSON.parse(
            localStorage.getItem("taskflow-auth") || "null"
        );

        if (auth?.isAuthenticated) {
            userId = auth.user?.id;
        }
    } catch {
        userId = null;
    }

    const cachedData = readUserDataCache(userId);

    return {
        projects: Array.isArray(cachedData?.projects)
            ? cachedData.projects
            : [],
        status: Array.isArray(cachedData?.projects)
            ? "succeeded"
            : "idle",
        error: null,
    };
};

const initialState = getInitialProjectsState();

export const fetchProjects = createAsyncThunk(
    "projects/fetchProjects",
    async (_, thunkAPI) => {
        try {
            const projects = await getProjects();
            return projects.map(normalizeProject);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message === "Failed to fetch"
                    ? "Unable to load projects. Please make sure the server is running and try again."
                    : error.message
            );
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

            const createdProject = await createProjectRequest(backendProject);
            return normalizeProject(createdProject);
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

            const updatedProject = await updateProjectRequest(id, backendUpdates);
            return normalizeProject(updatedProject);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deleteProjectAsync = createAsyncThunk(
    "projects/deleteProject",
    async (id, thunkAPI) => {
        try {
            await deleteProjectRequest(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


const projectSlice = createSlice({
    name: "projects",
    initialState,

    reducers: {
        resetProjects: () => initialState,

        hydrateProjects: (state, action) => {
            state.projects = Array.isArray(action.payload)
                ? action.payload
                : [];
            state.status = "succeeded";
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // Get
            .addCase(fetchProjects.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.error = null;
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

export const { resetProjects, hydrateProjects } = projectSlice.actions;
export default projectSlice.reducer;