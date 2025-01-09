import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import PatientDetails from "./pages/PatientDetails";
import Medicine from "./pages/Medicine";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <main className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/patients" element={<Patients />} />
                    <Route path="/patient-details" element={<PatientDetails />} />
                    <Route path="/medicine" element={<Medicine />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </div>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;