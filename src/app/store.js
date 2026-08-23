import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../features/tasks/taskSlice";
import projectReducer from "../features/projects/projectSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import settingsReducer from "../features/settings/settingsSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
    reducer: {
        tasks: taskReducer,
        projects: projectReducer,
        notifications: notificationReducer,
        settings: settingsReducer,
        auth: authReducer,
    },
});

store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem("taskflow-settings", JSON.stringify(state.settings));
    localStorage.setItem("taskflow-auth", JSON.stringify(state.auth));
});