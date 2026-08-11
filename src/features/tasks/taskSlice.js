import { createSlice } from "@reduxjs/toolkit";

const initialTasks = [
    {
        id: "task-1",
        title: "Finish landing page",
        description: "Complete the responsive landing page design.",
        priority: "High",
        status: "Completed",
        dueDate: "2026-08-12",
    },
    {
        id: "task-2",
        title: "Build authentication flow",
        description: "Create login and registration screens.",
        priority: "High",
        status: "In Progress",
        dueDate: "2026-08-15",
    },
    {
        id: "task-3",
        title: "Create project API",
        description: "Plan the API structure for projects.",
        priority: "Medium",
        status: "Pending",
        dueDate: "2026-08-18",
    },
    {
        id: "task-4",
        title: "Review mobile layout",
        description: "Check TaskFlow responsive behavior.",
        priority: "Low",
        status: "Pending",
        dueDate: "2026-08-20",
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

        toggleTask: (state, action) => {
            const task = state.tasks.find(
                (task) => task.id === action.payload
            );

            if (!task) return;

            task.status =
                task.status === "Completed"
                    ? "Pending"
                    : "Completed";
        },

        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(
                (task) => task.id !== action.payload
            );
        },
    },
});

export const { addTask, toggleTask, deleteTask, } = taskSlice.actions;
export default taskSlice.reducer;