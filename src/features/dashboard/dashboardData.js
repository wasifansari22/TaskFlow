import { CheckCircle2, Clock3, ListTodo, CalendarDays, } from "lucide-react";

export const dashboardStats = [
    {
        title: "Total Tasks",
        value: "24",
        description: "12 completed this month",
        icon: ListTodo,
        iconStyle: "bg-blue-50 text-blue-600",
    },
    {
        title: "In Progress",
        value: "8",
        description: "3 updated today",
        icon: Clock3,
        iconStyle: "bg-amber-50 text-amber-600",
    },
    {
        title: "Completed",
        value: "12",
        description: "50% of all tasks",
        icon: CheckCircle2,
        iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
        title: "Due Today",
        value: "4",
        description: "2 high priority",
        icon: CalendarDays,
        iconStyle: "bg-rose-50 text-rose-600",
    },
];