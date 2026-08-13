import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import ChangePassword from "./pages/auth/ChangePassword";

import Dashboard from "./pages/dashboard/Dashboard";

import Employees from "./pages/employees/Employees";
import AddEmployee from "./pages/employees/AddEmployee";
import EditEmployee from "./pages/employees/EditEmployee";
import EmployeeDetails from "./pages/employees/EmployeeDetails";

import Clients from "./pages/clients/Clients";
import AddClient from "./pages/clients/AddClient";
import EditClient from "./pages/clients/EditClient";
import ClientDetails from "./pages/clients/ClientDetails";

import Projects from "./pages/projects/Projects";
import AddProject from "./pages/projects/AddProject";
import EditProject from "./pages/projects/EditProject";

import Settings from "./pages/settings/Settings";
import NotFound from "./pages/NotFound";

import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import SkillSets from "./pages/skills/SkillSets";
import AddSkill from "./pages/skills/AddSkill";
import EditSkill from "./pages/skills/EditSkill";
import SkillMatrix from "./pages/skills/SkillMatrix";
import ProjectDetails from "./pages/projects/ProjectDetails";
import EmployeePortal from "./pages/employee/EmployeePortal";
import EmployeeEdit from "./pages/employee/EmployeeEdit";
import SkillRequests from "./pages/skillRequests/SkillRequests";

function App() {
    return (
        <Routes>

            <Route path="/" element={<Login />} />

            <Route
                path="/change-password"
                element={
                    <ProtectedRoute>
                        <ChangePassword />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute  allowedRoles={["Administrator"]}>
                        <DashboardLayout>
                            <Dashboard />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            {/* Employees */}
<Route
    path="/employee"
    element={

        <ProtectedRoute
            allowedRoles={["Employee"]}
        >

            <DashboardLayout>

                <EmployeePortal />

            </DashboardLayout>

        </ProtectedRoute>

    }
/>
<Route
    path="/employee/:id"
    element={
        <ProtectedRoute
            allowedRoles={["Employee"]}
        >
            <DashboardLayout>
                <EmployeeDetails />
            </DashboardLayout>
        </ProtectedRoute>
    }
/>
<Route
    path="/employee/edit/:id"
    element={
        <ProtectedRoute
            allowedRoles={["Employee"]}
        >
            <DashboardLayout>
                <EmployeeEdit />
            </DashboardLayout>
        </ProtectedRoute>
    }
/>
            <Route
                path="/employees"
                element={
                    <ProtectedRoute allowedRoles={["Administrator"]}>
                        <DashboardLayout>
                            <Employees />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employees/add"
                element={
                    <ProtectedRoute  allowedRoles={["Administrator"]}>
                        <DashboardLayout>
                            <AddEmployee />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employees/edit/:id"
                element={
                    <ProtectedRoute allowedRoles={["Administrator"]}>
                        <DashboardLayout>
                            <EditEmployee />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employees/:id"
                element={
                    <ProtectedRoute allowedRoles={["Administrator"]}>
                        <DashboardLayout>
                            <EmployeeDetails />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
<Route
    path="/skills"
    element={
        <ProtectedRoute  allowedRoles={["Administrator"]}>
            <DashboardLayout>
                <SkillSets />
            </DashboardLayout>
        </ProtectedRoute>
    }
/>

<Route
    path="/skills/add"
    element={
        <ProtectedRoute  allowedRoles={["Administrator"]}>
            <DashboardLayout>
                <AddSkill />
            </DashboardLayout>
        </ProtectedRoute>
    }
/>

<Route
    path="/skills/edit/:id"
    element={
        <ProtectedRoute  allowedRoles={["Administrator"]}>
            <DashboardLayout>
                <EditSkill />
            </DashboardLayout>
        </ProtectedRoute>
    }
/>
<Route
    path="/skill-matrix"
    element={
        <ProtectedRoute  allowedRoles={["Administrator"]}>
            <DashboardLayout>
                <SkillMatrix />
            </DashboardLayout>
        </ProtectedRoute>
    }
/>
            {/* Clients */}

            <Route
                path="/clients"
                element={
                    <ProtectedRoute  allowedRoles={["Administrator"]}>
                        <DashboardLayout>
                            <Clients />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/clients/add"
                element={
                    <ProtectedRoute  allowedRoles={["Administrator"]}>
                        <DashboardLayout>
                            <AddClient />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/clients/edit/:id"
                element={
                    <ProtectedRoute  allowedRoles={["Administrator"]}>
                        <DashboardLayout>
                            <EditClient />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/clients/:id"
                element={
                    <ProtectedRoute  allowedRoles={["Administrator"]}>
                        <DashboardLayout>
                            <ClientDetails />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            {/* Projects */}

            <Route
                path="/projects"
                element={
                    <ProtectedRoute  allowedRoles={["Administrator"]}>
                        <DashboardLayout>
                            <Projects />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/projects/add"
                element={
                    <ProtectedRoute  allowedRoles={["Administrator"]}>
                        <DashboardLayout>
                            <AddProject />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
    path="/projects/:id"
    element={
        <ProtectedRoute  allowedRoles={["Administrator"]}>
            <DashboardLayout>
                <ProjectDetails />
            </DashboardLayout>
        </ProtectedRoute>
    }
/>

            <Route
                path="/projects/edit/:id"
                element={
                    <ProtectedRoute  allowedRoles={["Administrator"]}>
                        <DashboardLayout>
                            <EditProject />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
<Route
    path="/skill-requests"
    element={
        <ProtectedRoute allowedRoles={["Administrator"]}>
            <DashboardLayout>
                <SkillRequests />
            </DashboardLayout>
        </ProtectedRoute>
    }
/>
            {/* Settings */}
<Route
    path="/settings"
    element={
        <ProtectedRoute>
            <DashboardLayout>
                <Settings />
            </DashboardLayout>
        </ProtectedRoute>
    }
/>

            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}

export default App;