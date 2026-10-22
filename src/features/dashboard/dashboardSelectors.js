import { createSelector } from "@reduxjs/toolkit";
import { selectAllTasks, selectCompletedTasks, selectInProgressTasks, selectPendingTasks, } from "../tasks/taskSelectors";
import { selectAllProjects, selectActiveProjects, } from "../projects/projectSelectors";
import { CheckCircle2, Clock3, FolderKanban, ListTodo, } from "lucide-react";

export const selectDashboardStats = createSelector(
    [
        selectAllTasks,
        selectCompletedTasks,
        selectInProgressTasks,
        selectPendingTasks,
        selectAllProjects,
        selectActiveProjects,
    ],
    (
        tasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        projects,
        activeProjects
    ) => [
            {
                title: "Total Tasks",
                value: tasks.length,
                description: "All tasks in your workspace",
                icon: ListTodo,
                iconStyle: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
            },
            {
                title: "In Progress",
                value: inProgressTasks.length,
                description: "Tasks currently being worked on",
                icon: Clock3,
                iconStyle: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
            },
            {
                title: "Completed",
                value: completedTasks.length,
                description: "Tasks completed",
                icon: CheckCircle2,
                iconStyle: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
            },
            {
                title: "Pending",
                value: pendingTasks.length,
                description: "Tasks waiting to start",
                icon: ListTodo,
                iconStyle: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
            },
            {
                title: "Active Projects",
                value: activeProjects.length,
                description: `${projects.length} total projects`,
                icon: FolderKanban,
                iconStyle: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300",
            },
        ]
);

export const selectDashboardProjects = createSelector(
    [selectAllProjects, selectAllTasks],
    (projects, tasks) => {
        return projects
            .filter((project) => project.status === "Active")
            .map((project) => {
                const projectTasks = tasks.filter(
                    (task) => task.projectId === project.id
                );

                const completedTasks = projectTasks.filter(
                    (task) => task.status === "Completed"
                );

                const progress =
                    projectTasks.length === 0
                        ? 0
                        : Math.round(
                            (completedTasks.length /
                                projectTasks.length) *
                            100
                        );

                return {
                    ...project,
                    progress,
                    completedTasks: completedTasks.length,
                    totalTasks: projectTasks.length,
                };
            });
    }
);