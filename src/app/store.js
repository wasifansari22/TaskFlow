import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../features/tasks/taskSlice";
import projectReducer from "../features/projects/projectSlice";

export const store = configureStore({
    reducer: {
        tasks: taskReducer,
        projects: projectReducer,
    },
});