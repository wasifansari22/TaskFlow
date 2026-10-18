import { createSlice } from "@reduxjs/toolkit";

const defaultSettings = {
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

const savedSettings = (() => {
    try {
        return JSON.parse(localStorage.getItem("taskflow-settings") || "null");
    } catch {
        return null;
    }
})();

const initialState = {
    ...defaultSettings,
    ...(savedSettings || {}),
    notifications: {
        ...defaultSettings.notifications,
        ...(savedSettings?.notifications || {}),
    },
    taskPreferences: {
        ...defaultSettings.taskPreferences,
        ...(savedSettings?.taskPreferences || {}),
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