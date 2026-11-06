import { configureStore, createListenerMiddleware, } from "@reduxjs/toolkit";
import notificationReducer from "../features/notifications/notificationSlice";
import settingsReducer, { defaultSettings, getSettingsKey, PUBLIC_THEME_KEY, loadUserSettings, } from "../features/settings/settingsSlice";
import authReducer, { login, register, logout, } from "../features/auth/authSlice";
import { readUserDataCache, saveUserDataCache, } from "../utils/userDataCache";
import taskReducer, { fetchTasks, createTask, updateTaskAsync, updateTaskStatusAsync, deleteTaskAsync, hydrateTasks, resetTasks, } from "../features/tasks/taskSlice";
import projectReducer, { fetchProjects, createProjectAsync, updateProjectAsync, deleteProjectAsync, hydrateProjects, resetProjects, } from "../features/projects/projectSlice";

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

// Restore the newly authenticated user's cached workspace data.
settingsListener.startListening({
    matcher: (action) =>
        login.fulfilled.match(action) ||
        register.fulfilled.match(action),

    effect: async (action, listenerApi) => {
        const userId = action.payload?.user?.id;

        if (userId == null) return;

        const cachedData = readUserDataCache(userId);

        listenerApi.dispatch(
            hydrateTasks(cachedData?.tasks || [])
        );

        listenerApi.dispatch(
            hydrateProjects(cachedData?.projects || [])
        );
    },
});

// Persist workspace data after successful API operations.
settingsListener.startListening({
    matcher: (action) =>
        fetchTasks.fulfilled.match(action) ||
        createTask.fulfilled.match(action) ||
        updateTaskAsync.fulfilled.match(action) ||
        updateTaskStatusAsync.fulfilled.match(action) ||
        deleteTaskAsync.fulfilled.match(action) ||
        fetchProjects.fulfilled.match(action) ||
        createProjectAsync.fulfilled.match(action) ||
        updateProjectAsync.fulfilled.match(action) ||
        deleteProjectAsync.fulfilled.match(action),

    effect: async (_, listenerApi) => {
        const state = listenerApi.getState();
        const userId = state.auth.user?.id;

        if (
            !state.auth.isAuthenticated ||
            userId == null ||
            String(state.settings.ownerId) !== String(userId)
        ) {
            return;
        }

        saveUserDataCache(userId, {
            tasks: state.tasks.tasks,
            projects: state.projects.projects,
        });
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

    // Save settings.
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
