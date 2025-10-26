import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { AdminShell } from "./components/layout/AdminShell";
import { LoginPage } from "./pages/auth/LoginPage";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { UserManagement } from "./pages/users/UserManagement";
import { PropertyManagement } from "./pages/properties/PropertyManagement";
import { PolicyManagement } from "./pages/policies/PolicyManagement";
import { WalletFinance } from "./pages/finance/WalletFinance";
import { ClaimsManagement } from "./pages/claims/ClaimsManagement";
import { ChargesManagement } from "./pages/charges/ChargesManagement";
import { ComplianceAudit } from "./pages/compliance/ComplianceAudit";
import { ContentManagement } from "./pages/content/ContentManagement";
import { CertificateFactory } from "./pages/certificates/CertificateFactory";
import { AnalyticsPlatform } from "./pages/analytics/AnalyticsPlatform";
import { Settings } from "./pages/settings/Settings";
import { ApplicationReview } from "./pages/applications/ApplicationReview";
import { SuperAdminDashboard } from "./pages/super-admin/SuperAdminDashboard";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AdminShell>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route
                          path="applications/*"
                          element={<ApplicationReview />}
                        />
                        <Route path="users/*" element={<UserManagement />} />
                        <Route
                          path="properties/*"
                          element={<PropertyManagement />}
                        />
                        <Route
                          path="policies/*"
                          element={<PolicyManagement />}
                        />
                        <Route path="finance/*" element={<WalletFinance />} />
                        <Route path="claims/*" element={<ClaimsManagement />} />
                        <Route
                          path="charges/*"
                          element={<ChargesManagement />}
                        />
                        <Route
                          path="compliance/*"
                          element={<ComplianceAudit />}
                        />
                        <Route
                          path="content/*"
                          element={<ContentManagement />}
                        />
                        <Route
                          path="certificates/*"
                          element={<CertificateFactory />}
                        />
                        <Route
                          path="analytics/*"
                          element={<AnalyticsPlatform />}
                        />
                        <Route
                          path="super-admin/*"
                          element={<SuperAdminDashboard />}
                        />
                        <Route path="settings/*" element={<Settings />} />
                      </Routes>
                    </AdminShell>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
