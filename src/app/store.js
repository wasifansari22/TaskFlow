import { configureStore, createListenerMiddleware, } from "@reduxjs/toolkit";
import taskReducer from "../features/tasks/taskSlice";
import projectReducer, { resetProjects } from "../features/projects/projectSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import settingsReducer, { defaultSettings, getSettingsKey, PUBLIC_THEME_KEY, loadUserSettings, } from "../features/settings/settingsSlice";
import authReducer, { login, register, logout, } from "../features/auth/authSlice";
import { resetTasks } from "../features/tasks/taskSlice";

const settingsListener = createListenerMiddleware();

const readUserSettings = (userId) => {
    try {
        const saved = localStorage.getItem(getSettingsKey(userId));
        return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
        return defaultSettings;
    }
};

const loadSettingsForAccount = (userId) => ({
    userId,
    settings: readUserSettings(userId),
});

settingsListener.startListening({
    matcher: (action) =>
        login.fulfilled.match(action) ||
        register.fulfilled.match(action),

    effect: async (action, listenerApi) => {
        const userId = action.payload?.user?.id;

        if (userId == null) {
            return;
        }

        listenerApi.dispatch(
            loadUserSettings(loadSettingsForAccount(userId))
        );
    },
});

settingsListener.startListening({
    actionCreator: logout,

    effect: async (_, listenerApi) => {
        // Capture the previous account's theme before resetting settings.
        const currentTheme = listenerApi.getState().settings.theme;

        try {
            localStorage.setItem(PUBLIC_THEME_KEY, currentTheme);
        } catch (error) {
            console.error("Unable to save public theme:", error);
        }

        // Keep the last theme on public pages, but clear account ownership.
        listenerApi.dispatch(
            loadUserSettings({
                userId: null,
                settings: {
                    ...defaultSettings,
                    theme: currentTheme,
                },
            })
        );
    },
});

settingsListener.startListening({
    actionCreator: logout,

    effect: async (_, listenerApi) => {
        listenerApi.dispatch(resetTasks());
        listenerApi.dispatch(resetProjects());
    },
});

export const store = configureStore({
    reducer: {
        tasks: taskReducer,
        projects: projectReducer,
        notifications: notificationReducer,
        settings: settingsReducer,
        auth: authReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(settingsListener.middleware),
});

store.subscribe(() => {
    const state = store.getState();
    const userId = state.auth.user?.id;

    if (
        !state.auth.isAuthenticated ||
        userId == null ||
        String(state.settings.ownerId) !== String(userId)
    ) {
        return;
    }

    try {
        const { ownerId, ...settingsToSave } = state.settings;

        localStorage.setItem(
            getSettingsKey(userId),
            JSON.stringify(settingsToSave)
        );
    } catch (error) {
        console.error("Unable to save TaskFlow settings:", error);
    }
});
