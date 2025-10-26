import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  Users,
  Building,
  FileText,
  Wallet,
  Scale,
  Shield,
  MessageSquare,
  Award,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { RootState } from "../../store/store";
import { checkUserPermission } from "../../service/authSlice";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: "*",
  },
  {
    name: "Application Review",
    href: "/applications",
    icon: FileText,
    permission: "policies.read",
  },
  {
    name: "User Management",
    href: "/users",
    icon: Users,
    permission: "users.read",
  },
  {
    name: "Property Management",
    href: "/properties",
    icon: Building,
    permission: "policies.read",
  },
  {
    name: "Policy Management",
    href: "/policies",
    icon: FileText,
    permission: "policies.read",
  },
  {
    name: "Wallet & Finance",
    href: "/finance",
    icon: Wallet,
    permission: "wallet.read",
  },
  {
    name: "Claims Management",
    href: "/claims",
    icon: Scale,
    permission: "claims.read",
  },
  {
    name: "Charges",
    href: "/charges",
    icon: Award,
    permission: "charges.read",
  },
  // {
  //   name: "Compliance & Audit",
  //   href: "/compliance",
  //   icon: Shield,
  //   permission: "audit.read",
  // },
  // {
  //   name: "Content Management",
  //   href: "/content",
  //   icon: MessageSquare,
  //   permission: "content.read",
  // },
  // {
  //   name: "Certificate Factory",
  //   href: "/certificates",
  //   icon: Award,
  //   permission: "certificates.issue",
  // },
  // {
  //   name: "Analytics Platform",
  //   href: "/analytics",
  //   icon: BarChart3,
  //   permission: "analytics.read",
  // },
  {
    name: "Super Admin",
    href: "/super-admin",
    icon: Shield,
    permission: "roles.read",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    permission: "system.read",
  },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { authData: userPermissions } = useSelector(
    (state: RootState) => state.auth
  );
  const user = useSelector((state: RootState) => state.auth);

  console.log("Sidebar userPermissions:", userPermissions);
  console.log("Sidebar user details:", user);
  const visibleItems = navigationItems.filter(
    (item) =>
      item.permission === "*" ||
      checkUserPermission(userPermissions.permissions, item.permission)
  );

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">BS</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                BrickSure
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Admin Console
              </p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {visibleItems.map((item) => {
          const isActive =
            location.pathname.startsWith(item.href) ||
            (location.pathname === "/" && item.href === "/dashboard");

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative ${
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="ml-3 truncate">{item.name}</span>}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
