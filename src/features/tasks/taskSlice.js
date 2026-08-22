import { createSlice } from "@reduxjs/toolkit";

const initialTasks = [
    {
        id: "task-1",
        title: "Finish landing page",
        description: "Complete the responsive landing page design.",
        priority: "High",
        status: "Completed",
        dueDate: "2026-08-23",
        projectId: "project-1",
    },
    {
        id: "task-2",
        title: "Build authentication flow",
        description: "Create login and registration screens.",
        priority: "High",
        status: "In Progress",
        dueDate: "2026-08-21",
        projectId: "project-1",
    },
    {
        id: "task-3",
        title: "Create project API",
        description: "Plan the API structure for projects.",
        priority: "Medium",
        status: "Pending",
        dueDate: "2026-08-24",
        projectId: "project-1",
    },
    {
        id: "task-4",
        title: "Review mobile layout",
        description: "Check TaskFlow responsive behavior.",
        priority: "Low",
        status: "Pending",
        dueDate: "2026-08-27",
        projectId: "project-1",
    },
];

const initialState = {
    tasks: initialTasks,
};

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        addTask: (state, action) => {
            state.tasks.unshift(action.payload);
        },

        updateTaskStatus: (state, action) => {
            const { id, status } = action.payload;
            const task = state.tasks.find((task) => task.id === id);
            if (!task) return;
            task.status = status;
        },

        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(
                (task) => task.id !== action.payload
            );
        },
        updateTask: (state, action) => {
            const { id, updates } = action.payload;
            const task = state.tasks.find((task) => task.id === id);
            if (!task) return;
            Object.assign(task, updates);
        },
    },
});

export const { addTask, updateTaskStatus, deleteTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;