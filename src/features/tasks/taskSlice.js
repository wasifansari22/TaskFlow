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
            return await getTasks();
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
    reducers: {
        // addTask: (state, action) => {
        //     state.tasks.unshift(action.payload);
        // },

        // updateTaskStatus: (state, action) => {
        //     const { id, status } = action.payload;
        //     const task = state.tasks.find((task) => task.id === id);
        //     if (!task) return;
        //     task.status = status;
        // },

        // deleteTask: (state, action) => {
        //     state.tasks = state.tasks.filter(
        //         (task) => task.id !== action.payload
        //     );
        // },
        // updateTask: (state, action) => {
        //     const { id, updates } = action.payload;
        //     const task = state.tasks.find((task) => task.id === id);
        //     if (!task) return;
        //     Object.assign(task, updates);
        // },
    },
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
                state.tasks.unshift(action.payload);
            })
            .addCase(updateTaskAsync.fulfilled, (state, action) => {
                const updatedTask = action.payload;

                const index = state.tasks.findIndex(
                    (task) => task.id === updatedTask.id
                );

                if (index !== -1) {
                    state.tasks[index] = updatedTask;
                }
            })
            .addCase(updateTaskStatusAsync.fulfilled, (state, action) => {
                const updatedTask = action.payload;

                const index = state.tasks.findIndex(
                    (task) => task.id === updatedTask.id
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

// export const { addTask, updateTaskStatus, deleteTask, updateTask } = taskSlice.actions;
export const { updateTaskStatus } = taskSlice.actions;
export default taskSlice.reducer;