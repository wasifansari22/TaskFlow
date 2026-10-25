import { createSlice } from "@reduxjs/toolkit";

export const defaultSettings = {
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

export const getSettingsKey = (userId) =>
    `taskflow-settings-${userId}`;

export const PUBLIC_THEME_KEY = "taskflow-public-theme";

const getSavedUserId = () => {
    try {
        const auth = JSON.parse(
            localStorage.getItem("taskflow-auth") || "null"
        );

        return auth?.isAuthenticated && auth?.user?.id != null
            ? auth.user.id
            : null;
    } catch {
        return null;
    }
};

const getPublicTheme = () => {
    try {
        const theme = localStorage.getItem(PUBLIC_THEME_KEY);

        return ["light", "dark", "system"].includes(theme)
            ? theme
            : "light";
    } catch {
        return "light";
    }
};

const normalizeSettings = (savedSettings, ownerId = null) => ({
    ...defaultSettings,
    ...(savedSettings || {}),
    ownerId,
    notifications: {
        ...defaultSettings.notifications,
        ...(savedSettings?.notifications || {}),
    },
    taskPreferences: {
        ...defaultSettings.taskPreferences,
        ...(savedSettings?.taskPreferences || {}),
    },
});

const loadInitialSettings = () => {
    const userId = getSavedUserId();

    if (userId == null) {
        return normalizeSettings({
            ...defaultSettings,
            theme: getPublicTheme(),
        });
    }

    try {
        const saved = localStorage.getItem(getSettingsKey(userId));

        return normalizeSettings(
            saved ? JSON.parse(saved) : null,
            userId
        );
    } catch {
        return normalizeSettings(null, userId);
    }
};

const settingsSlice = createSlice({
    name: "settings",
    initialState: loadInitialSettings(),

    reducers: {
        loadUserSettings: (state, action) => {
            return normalizeSettings(
                action.payload.settings,
                action.payload.userId
            );
        },

        setTheme: (state, action) => {
            if (["light", "dark", "system"].includes(action.payload)) {
                state.theme = action.payload;
            }
        },

        toggleNotification: (state, action) => {
            const setting = action.payload;

            if (
                Object.prototype.hasOwnProperty.call(
                    state.notifications,
                    setting
                )
            ) {
                state.notifications[setting] =
                    !state.notifications[setting];
            }
        },

        setDefaultPriority: (state, action) => {
            state.taskPreferences.defaultPriority = action.payload;
        },

        setDefaultStatus: (state, action) => {
            state.taskPreferences.defaultStatus = action.payload;
        },

        resetSettings: (state) => {
            return normalizeSettings(null, state.ownerId);
        },
    },
});

export const { loadUserSettings, setTheme, toggleNotification, setDefaultPriority, setDefaultStatus, resetSettings, } = settingsSlice.actions;
export default settingsSlice.reducer;