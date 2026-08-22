import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../features/tasks/taskSlice";
import projectReducer from "../features/projects/projectSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import settingsReducer from "../features/settings/settingsSlice"

export const store = configureStore({
    reducer: {
        tasks: taskReducer,
        projects: projectReducer,
        notifications: notificationReducer,
        settings: settingsReducer,
    },
});

store.subscribe(() => {
    const settings = store.getState().settings;
    localStorage.setItem("taskflow-settings", JSON.stringify(settings));
});