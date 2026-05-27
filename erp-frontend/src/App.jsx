import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import HR from "./pages/HR";
import Inventory from "./pages/Inventory";
import Finance from "./pages/Finance";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import SupplyChain from "./pages/SupplyChain";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import Leaves from "./pages/Leaves";
import Departments from "./pages/Departments";
import Designations from "./pages/Designations";
import Transactions from "./pages/Transactions";
import Accounts from "./pages/Accounts";
import Expenses from "./pages/Expenses";
import Payments from "./pages/Payments";
import Vendors from "./pages/Vendors";
import Assets from "./pages/Assets";
import Budgets from "./pages/Budgets";
import Income from "./pages/Income";
import TaxManagement from "./pages/TaxManagement";
import Invoices from "./pages/Invoices";
import Approvals from "./pages/Approvals";
import AuditLogs from "./pages/AuditLogs";
import HelpSupport from "./pages/HelpSupport";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import Backup from "./pages/Backup";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen">
      {!isLoginPage && sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      {!isLoginPage && (
        <Sidebar isOpen={sidebarOpen} onNavigate={closeSidebar} />
      )}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-[margin] duration-300 ${
          isLoginPage ? "" : "bg-gray-100 min-h-screen"
        } ${!isLoginPage && sidebarOpen ? "lg:ml-[260px]" : ""}`}
      >
        {!isLoginPage && <Navbar onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />}
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hr"
            element={
              <ProtectedRoute allowedRoles={["admin", "hr"]}>
                <HR />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Inventory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/finance"
            element={
              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                <Finance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/supply-chain"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <SupplyChain />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["admin", "hr", "finance"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute allowedRoles={["admin", "hr"]}>
                <Attendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payroll"
            element={
              <ProtectedRoute allowedRoles={["admin", "hr"]}>
                <Payroll />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leaves"
            element={
              <ProtectedRoute allowedRoles={["admin", "hr"]}>
                <Leaves />
              </ProtectedRoute>
            }
          />

          <Route
            path="/departments"
            element={
              <ProtectedRoute allowedRoles={["admin", "hr"]}>
                <Departments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/designations"
            element={
              <ProtectedRoute allowedRoles={["admin", "hr"]}>
                <Designations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                <Transactions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/accounts"
            element={
              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                <Accounts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoices"
            element={
              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                <Invoices />
              </ProtectedRoute>
            }
          />

          {/* Placeholder routes for remaining Finance links */}
          <Route
            path="/income"
            element={
              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                <Income />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budgets"
            element={
              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                <Budgets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tax-management"
            element={
              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                <TaxManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets"
            element={
              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                <Assets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                <Vendors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approvals"
            element={
              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                <Approvals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute allowedRoles={["admin", "hr", "finance"]}>
                <HelpSupport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Roles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/backup"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Backup />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
