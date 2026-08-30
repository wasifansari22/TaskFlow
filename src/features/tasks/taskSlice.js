import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTasks, createTaskRequest, updateTaskRequest, deleteTaskRequest } from "../../api/taskApi";

const initialState = {
    tasks: [],
    status: "idle",
    error: null,
};

export const fetchTasks = createAsyncThunk(
    "tasks/fetchTasks",
    async (_, thunkAPI) => {
        try {
            const tasks = await getTasks();

            return tasks.map((task) => ({
                ...task,
                dueDate: task.due_date
                    ? task.due_date
                    : "No due date",
                projectId: task.project,
            }));
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const createTask = createAsyncThunk(
    "tasks/createTask",
    async (taskData, thunkAPI) => {
        try {
            const backendTask = {
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority,
                status: taskData.status,
                due_date: taskData.dueDate === "No due date" ? null : taskData.dueDate,
                project: taskData.projectId ? Number(taskData.projectId) : null,
            };

            return await createTaskRequest(backendTask);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateTaskAsync = createAsyncThunk(
    "tasks/updateTask",
    async ({ id, updates }, thunkAPI) => {
        try {
            const backendUpdates = {
                title: updates.title,
                description: updates.description,
                priority: updates.priority,
                status: updates.status,
                due_date: updates.dueDate === "No due date" ? null : updates.dueDate,
                project: updates.projectId ? Number(updates.projectId) : null,
            };

            return await updateTaskRequest(
                id,
                backendUpdates
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateTaskStatusAsync = createAsyncThunk(
    "tasks/updateTaskStatus",
    async ({ id, status }, thunkAPI) => {
        try {
            return await updateTaskRequest(id, {
                status,
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deleteTaskAsync = createAsyncThunk(
    "tasks/deleteTask",
    async (id, thunkAPI) => {
        try {
            return await deleteTaskRequest(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.tasks = action.payload;
            })

            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            .addCase(createTask.fulfilled, (state, action) => {
                const task = action.payload;

                state.tasks.unshift({
                    ...task,
                    dueDate: task.due_date
                        ? task.due_date
                        : "No due date",
                    projectId: task.project,
                });
            })

            .addCase(updateTaskAsync.fulfilled, (state, action) => {
                const task = action.payload;

                const updatedTask = {
                    ...task,
                    dueDate: task.due_date
                        ? task.due_date
                        : "No due date",
                    projectId: task.project,
                };

                const index = state.tasks.findIndex(
                    (existingTask) => existingTask.id === updatedTask.id
                );

                if (index !== -1) {
                    state.tasks[index] = updatedTask;
                }
            })

            .addCase(updateTaskStatusAsync.fulfilled, (state, action) => {
                const task = action.payload;

                const updatedTask = {
                    ...task,
                    dueDate: task.due_date
                        ? task.due_date
                        : "No due date",
                    projectId: task.project,
                };

                const index = state.tasks.findIndex(
                    (existingTask) => existingTask.id === updatedTask.id
                );

                if (index !== -1) {
                    state.tasks[index] = updatedTask;
                }
            })

            .addCase(deleteTaskAsync.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(
                    (task) => task.id !== action.payload
                );
            })
    },
});

export default taskSlice.reducer;