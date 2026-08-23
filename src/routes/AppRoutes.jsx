import { Routes, Route } from "react-router";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import Tasks from "../pages/Tasks";
import Calendar from "../pages/Calendar";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import MainLayout from "../layouts/MainLayout";
import ProjectDetails from "../pages/ProjectDetails";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />

                    <Route path="/projects" element={<Projects />} />

                    <Route
                        path="/projects/:projectId"
                        element={<ProjectDetails />}
                    />

                    <Route path="/tasks" element={<Tasks />} />

                    <Route path="/calendar" element={<Calendar />} />

                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;