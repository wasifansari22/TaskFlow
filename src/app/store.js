import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../features/tasks/taskSlice";
import projectReducer from "../features/projects/projectSlice";
import notificationReducer from "../features/notifications/notificationSlice"

export const store = configureStore({
    reducer: {
        tasks: taskReducer,
        projects: projectReducer,
        notifications: notificationReducer,
    },
});