import { createSlice } from "@reduxjs/toolkit";

const savedSettings = JSON.parse(localStorage.getItem("taskflow-settings") || "null");

const initialState = savedSettings || {
    theme: "light",
    notifications: {
        taskUpdates: true,
        deadlineReminders: true,
        projectUpdates: true,
    },
    taskPreferences: {
        defaultPriority: "Medium",
        defaultStatus: "Pending",
    },
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        toggleNotification: (state, action) => {
            const setting = action.payload;
            state.notifications[setting] = !state.notifications[setting];
        },
        setDefaultPriority: (state, action) => {
            state.taskPreferences.defaultPriority = action.payload;
        },
        setDefaultStatus: (state, action) => {
            state.taskPreferences.defaultStatus = action.payload;
        },
        resetSettings: () => ({
            theme: "light",
            notifications: {
                taskUpdates: true,
                deadlineReminders: true,
                projectUpdates: true,
            },
            taskPreferences: {
                defaultPriority: "Medium",
                defaultStatus: "Pending",
            },
        }),
    },
});

export const { setTheme, toggleNotification, setDefaultPriority, setDefaultStatus, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;