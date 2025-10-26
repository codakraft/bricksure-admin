import React from "react";
import { useSelector } from "react-redux";
import {
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  AlertTriangle,
  Award,
} from "lucide-react";
import { RootState } from "../../../store/store";
import { checkUserPermission } from "../../../service/authSlice";

export function RoleBasedWidgets() {
  const userPermissions = useSelector(
    (state: RootState) => state.auth.authData.permissions
  );

  const renderUnderwriterWidget = () => (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Underwriting Queue</h3>
        <FileText className="w-6 h-6" />
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">23</p>
          <p className="text-sm opacity-90">Pending Review</p>
        </div>
        <div>
          <p className="text-2xl font-bold">8</p>
          <p className="text-sm opacity-90">High Risk</p>
        </div>
        <div>
          <p className="text-2xl font-bold">2.3h</p>
          <p className="text-sm opacity-90">Avg. Processing</p>
        </div>
      </div>
    </div>
  );

  const renderFinanceWidget = () => (
    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Financial Overview</h3>
        <DollarSign className="w-6 h-6" />
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">₦2.4M</p>
          <p className="text-sm opacity-90">Today's Premium</p>
        </div>
        <div>
          <p className="text-2xl font-bold">₦150K</p>
          <p className="text-sm opacity-90">Pending Refunds</p>
        </div>
        <div>
          <p className="text-2xl font-bold">98.5%</p>
          <p className="text-sm opacity-90">Reconciliation</p>
        </div>
      </div>
    </div>
  );

  const renderComplianceWidget = () => (
    <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Compliance Alerts</h3>
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm opacity-90">KYC Pending</p>
        </div>
        <div>
          <p className="text-2xl font-bold">3</p>
          <p className="text-sm opacity-90">AML Flags</p>
        </div>
        <div>
          <p className="text-2xl font-bold">1</p>
          <p className="text-sm opacity-90">PEP Matches</p>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsWidget = () => (
    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Key Metrics</h3>
        <TrendingUp className="w-6 h-6" />
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">68.5%</p>
          <p className="text-sm opacity-90">Conversion Rate</p>
        </div>
        <div>
          <p className="text-2xl font-bold">12.3%</p>
          <p className="text-sm opacity-90">Claims Ratio</p>
        </div>
        <div>
          <p className="text-2xl font-bold">4.2</p>
          <p className="text-sm opacity-90">NPS Score</p>
        </div>
      </div>
    </div>
  );

  const widgets = [];

  // Super Admins with "*" permission will see all widgets
  if (checkUserPermission(userPermissions, "policies.approve")) {
    widgets.push(renderUnderwriterWidget());
  }

  if (checkUserPermission(userPermissions, "wallet.read")) {
    widgets.push(renderFinanceWidget());
  }

  if (checkUserPermission(userPermissions, "compliance.read")) {
    widgets.push(renderComplianceWidget());
  }

  if (checkUserPermission(userPermissions, "analytics.read")) {
    widgets.push(renderAnalyticsWidget());
  }

  if (widgets.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {widgets}
    </div>
  );
}
