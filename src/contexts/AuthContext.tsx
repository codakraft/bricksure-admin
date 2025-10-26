import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  UserRole,
  Right,
  Role,
  MakerCheckerRequest,
} from "../types/auth";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  isAuthenticated: boolean;
  loading: boolean;
  submitMakerCheckerRequest: (
    request: Omit<MakerCheckerRequest, "id" | "requestedAt" | "status">
  ) => Promise<string>;
  approveMakerCheckerRequest: (
    requestId: string,
    reason?: string
  ) => Promise<boolean>;
  rejectMakerCheckerRequest: (
    requestId: string,
    reason: string
  ) => Promise<boolean>;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SYSTEM_RIGHTS: Right[] = [
  // User Management
  {
    id: "users.read",
    name: "View Users",
    description: "View user profiles and information",
    category: "User Management",
    riskLevel: "low",
  },
  {
    id: "users.create",
    name: "Create Users",
    description: "Create new user accounts",
    category: "User Management",
    riskLevel: "medium",
  },
  {
    id: "users.update",
    name: "Update Users",
    description: "Modify user information",
    category: "User Management",
    riskLevel: "medium",
  },
  {
    id: "users.delete",
    name: "Delete Users",
    description: "Delete user accounts",
    category: "User Management",
    riskLevel: "critical",
  },
  {
    id: "users.suspend",
    name: "Suspend Users",
    description: "Suspend user accounts",
    category: "User Management",
    riskLevel: "high",
  },
  {
    id: "users.reset_password",
    name: "Reset Passwords",
    description: "Reset user passwords",
    category: "User Management",
    riskLevel: "medium",
  },

  // Policy Management
  {
    id: "policies.read",
    name: "View Policies",
    description: "View policy information",
    category: "Policy Management",
    riskLevel: "low",
  },
  {
    id: "policies.create",
    name: "Create Policies",
    description: "Create new policies",
    category: "Policy Management",
    riskLevel: "medium",
  },
  {
    id: "policies.update",
    name: "Update Policies",
    description: "Modify policy details",
    category: "Policy Management",
    riskLevel: "medium",
  },
  {
    id: "policies.approve",
    name: "Approve Policies",
    description: "Approve policy applications",
    category: "Policy Management",
    riskLevel: "high",
  },
  {
    id: "policies.reject",
    name: "Reject Policies",
    description: "Reject policy applications",
    category: "Policy Management",
    riskLevel: "high",
  },
  {
    id: "policies.cancel",
    name: "Cancel Policies",
    description: "Cancel active policies",
    category: "Policy Management",
    riskLevel: "critical",
  },

  // Financial Management
  {
    id: "wallet.read",
    name: "View Wallets",
    description: "View wallet information",
    category: "Financial Management",
    riskLevel: "low",
  },
  {
    id: "wallet.transactions",
    name: "View Transactions",
    description: "View transaction history",
    category: "Financial Management",
    riskLevel: "medium",
  },
  {
    id: "wallet.refund",
    name: "Process Refunds",
    description: "Process customer refunds",
    category: "Financial Management",
    riskLevel: "critical",
  },
  {
    id: "reports.financial",
    name: "Financial Reports",
    description: "Generate financial reports",
    category: "Financial Management",
    riskLevel: "medium",
  },

  // Claims Management
  {
    id: "claims.read",
    name: "View Claims",
    description: "View claims information",
    category: "Claims Management",
    riskLevel: "low",
  },
  {
    id: "claims.create",
    name: "Create Claims",
    description: "Create new claims",
    category: "Claims Management",
    riskLevel: "medium",
  },
  {
    id: "claims.approve",
    name: "Approve Claims",
    description: "Approve claim payouts",
    category: "Claims Management",
    riskLevel: "critical",
  },
  {
    id: "claims.reject",
    name: "Reject Claims",
    description: "Reject claim applications",
    category: "Claims Management",
    riskLevel: "high",
  },

  // Certificate Management
  {
    id: "certificates.read",
    name: "View Certificates",
    description: "View certificate information",
    category: "Certificate Management",
    riskLevel: "low",
  },
  {
    id: "certificates.issue",
    name: "Issue Certificates",
    description: "Issue new certificates",
    category: "Certificate Management",
    riskLevel: "high",
  },
  {
    id: "certificates.revoke",
    name: "Revoke Certificates",
    description: "Revoke existing certificates",
    category: "Certificate Management",
    riskLevel: "critical",
  },

  // System Administration
  {
    id: "system.read",
    name: "View System Settings",
    description: "View system configuration",
    category: "System Administration",
    riskLevel: "low",
  },
  {
    id: "system.write",
    name: "Modify System Settings",
    description: "Modify system configuration",
    category: "System Administration",
    riskLevel: "critical",
  },
  {
    id: "roles.read",
    name: "View Roles",
    description: "View role definitions",
    category: "System Administration",
    riskLevel: "low",
  },
  {
    id: "roles.create",
    name: "Create Roles",
    description: "Create new roles",
    category: "System Administration",
    riskLevel: "critical",
  },
  {
    id: "roles.update",
    name: "Update Roles",
    description: "Modify role permissions",
    category: "System Administration",
    riskLevel: "critical",
  },
  {
    id: "roles.delete",
    name: "Delete Roles",
    description: "Delete roles",
    category: "System Administration",
    riskLevel: "critical",
  },

  // Audit & Compliance
  {
    id: "audit.read",
    name: "View Audit Logs",
    description: "View system audit logs",
    category: "Audit & Compliance",
    riskLevel: "medium",
  },
  {
    id: "compliance.read",
    name: "View Compliance Data",
    description: "View compliance information",
    category: "Audit & Compliance",
    riskLevel: "medium",
  },
  {
    id: "compliance.approve",
    name: "Approve Compliance",
    description: "Approve compliance overrides",
    category: "Audit & Compliance",
    riskLevel: "high",
  },

  // Analytics
  {
    id: "analytics.read",
    name: "View Analytics",
    description: "View analytics dashboards",
    category: "Analytics",
    riskLevel: "low",
  },
  {
    id: "analytics.export",
    name: "Export Analytics",
    description: "Export analytics data",
    category: "Analytics",
    riskLevel: "medium",
  },

  // Content Management
  {
    id: "content.read",
    name: "View Content",
    description: "View content management",
    category: "Content Management",
    riskLevel: "low",
  },
  {
    id: "content.write",
    name: "Manage Content",
    description: "Create and edit content",
    category: "Content Management",
    riskLevel: "medium",
  },

  // Maker-Checker
  {
    id: "maker_checker.approve",
    name: "Approve Requests",
    description: "Approve maker-checker requests",
    category: "Maker-Checker",
    riskLevel: "high",
  },
  {
    id: "maker_checker.view",
    name: "View Requests",
    description: "View pending maker-checker requests",
    category: "Maker-Checker",
    riskLevel: "low",
  },
];

export const SYSTEM_ROLES: Role[] = [
  {
    id: "super-admin",
    name: "Super Administrator",
    description: "Full system access with all permissions",
    rights: ["*"],
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    isSystem: true,
  },
  {
    id: "underwriter",
    name: "Underwriter",
    description: "Policy review and approval specialist",
    rights: [
      "policies.read",
      "policies.approve",
      "policies.reject",
      "policies.update",
      "certificates.issue",
      "maker_checker.view",
    ],
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    isSystem: true,
  },
  {
    id: "finance-admin",
    name: "Finance Administrator",
    description: "Financial operations and wallet management",
    rights: [
      "wallet.read",
      "wallet.transactions",
      "wallet.refund",
      "reports.financial",
      "maker_checker.view",
    ],
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    isSystem: true,
  },
  {
    id: "compliance-officer",
    name: "Compliance Officer",
    description: "Regulatory compliance and audit oversight",
    rights: [
      "audit.read",
      "compliance.read",
      "compliance.approve",
      "users.read",
      "maker_checker.approve",
    ],
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    isSystem: true,
  },
  {
    id: "support-agent",
    name: "Support Agent",
    description: "Customer support and basic user management",
    rights: [
      "users.read",
      "users.reset_password",
      "policies.read",
      "maker_checker.view",
    ],
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    isSystem: true,
  },
];

// Mock user data
const mockUsers = {
  "admin@bricksure.com": {
    id: "1",
    email: "admin@bricksure.com",
    name: "System Administrator",
    role: "super-admin" as UserRole,
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
    department: "IT",
    lastLogin: "2025-01-27T10:30:00Z",
    mfaEnabled: true,
  },
};

// Mock maker-checker requests storage
let makerCheckerRequests: MakerCheckerRequest[] = [];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Debug effect to track user state changes
  useEffect(() => {
    console.log("User state changed:", {
      user: !!user,
      isAuthenticated: !!user,
      userData: user,
    });
  }, [user]);

  useEffect(() => {
    console.log("AuthProvider initializing...");
    // Check for existing session from Redux auth tokens
    // const authToken = localStorage.getItem("authToken");
    // const bricksureToken = localStorage.getItem("bricksure-token");
    // const savedUser = localStorage.getItem("bricksure_admin_user");
    // const bricksureAdmin = localStorage.getItem("bricksure-admin");

    // console.log("Initial auth check:", {
    //   authToken: !!authToken,
    //   bricksureToken: !!bricksureToken,
    //   savedUser: !!savedUser,
    //   bricksureAdmin: !!bricksureAdmin,
    // });

    // Priority: use authSlice data first, then fallback to our custom data
    // if (bricksureToken && bricksureAdmin) {
    //   try {
    //     const userData = JSON.parse(bricksureAdmin);
    //     console.log("Setting user from authSlice data during init:", userData);
    //     // Convert authSlice format to AuthContext format
    //     const authContextUser = {
    //       id: userData._id,
    //       email: userData.email,
    //       name: `${userData.firstName} ${userData.lastName}`,
    //       role: userData.role,
    //       avatar: undefined,
    //       department: undefined,
    //       lastLogin: new Date().toISOString(),
    //       mfaEnabled: false,
    //     };
    //     setUser(authContextUser);
    //   } catch (error) {
    //     console.error("Error parsing bricksure-admin data:", error);
    //   }
    // } else if (authToken && savedUser) {
    //   try {
    //     const userData = JSON.parse(savedUser);
    //     console.log(
    //       "Setting user from custom auth data during init:",
    //       userData
    //     );
    //     setUser(userData);
    //   } catch (error) {
    //     console.error("Error parsing custom auth data:", error);
    //   }
    // } else {
    //   console.log("No auth data found during init");
    // }
    // setLoading(false);
    // console.log("AuthProvider initialization complete");
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    if (email in mockUsers && password === "admin123") {
      const userData = mockUsers[email as keyof typeof mockUsers];
      setUser(userData);
      localStorage.setItem("bricksure_admin_user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    // Clear all auth systems
    localStorage.removeItem("bricksure_admin_user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("bricksure-token");
    localStorage.removeItem("bricksure-admin");
    console.log("All auth data cleared from localStorage");
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Super admin has all permissions (handle both variations)
    if (user.role === "super-admin" || user.role === "Super Admin") return true;

    // Find user's role and check permissions
    const userRole = SYSTEM_ROLES.find((role) => role.id === user.role);
    if (!userRole) return false;

    return (
      userRole.rights.includes("*") || userRole.rights.includes(permission)
    );
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const submitMakerCheckerRequest = async (
    request: Omit<MakerCheckerRequest, "id" | "requestedAt" | "status">
  ): Promise<string> => {
    const newRequest: MakerCheckerRequest = {
      ...request,
      id: `MC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      requestedAt: new Date().toISOString(),
      status: "pending",
      requestedBy: user?.id || "unknown",
    };

    makerCheckerRequests.push(newRequest);
    return newRequest.id;
  };

  const approveMakerCheckerRequest = async (
    requestId: string,
    reason?: string
  ): Promise<boolean> => {
    const requestIndex = makerCheckerRequests.findIndex(
      (req) => req.id === requestId
    );
    if (requestIndex === -1) return false;

    makerCheckerRequests[requestIndex] = {
      ...makerCheckerRequests[requestIndex],
      status: "approved",
      checkedBy: user?.id || "unknown",
      checkedAt: new Date().toISOString(),
      reason,
    };

    return true;
  };

  const rejectMakerCheckerRequest = async (
    requestId: string,
    reason: string
  ): Promise<boolean> => {
    const requestIndex = makerCheckerRequests.findIndex(
      (req) => req.id === requestId
    );
    if (requestIndex === -1) return false;

    makerCheckerRequests[requestIndex] = {
      ...makerCheckerRequests[requestIndex],
      status: "rejected",
      checkedBy: user?.id || "unknown",
      checkedAt: new Date().toISOString(),
      reason,
    };

    return true;
  };

  const refreshAuth = () => {
    console.log("=== refreshAuth called ===");
    // Re-check authentication state
    const authToken = localStorage.getItem("authToken");
    const bricksureToken = localStorage.getItem("bricksure-token");
    const savedUser = localStorage.getItem("bricksure_admin_user");
    const bricksureAdmin = localStorage.getItem("bricksure-admin");

    console.log("refreshAuth - current state:", {
      authToken: !!authToken,
      bricksureToken: !!bricksureToken,
      savedUser: !!savedUser,
      bricksureAdmin: !!bricksureAdmin,
      currentUser: !!user,
    });

    // Priority: use authSlice data first, then fallback to our custom data
    if (bricksureToken && bricksureAdmin) {
      try {
        const userData = JSON.parse(bricksureAdmin);
        console.log(
          "refreshAuth - Setting user from authSlice data:",
          userData
        );
        // Convert authSlice format to AuthContext format
        const authContextUser = {
          id: userData._id,
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`,
          role: userData.role,
          avatar: undefined,
          department: undefined,
          lastLogin: new Date().toISOString(),
          mfaEnabled: false,
        };
        setUser(authContextUser);
        console.log(
          "refreshAuth - User set from authSlice, new isAuthenticated should be:",
          !!authContextUser
        );
      } catch (error) {
        console.error(
          "Error parsing bricksure-admin data in refreshAuth:",
          error
        );
        setUser(null);
      }
    } else if (authToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log(
          "refreshAuth - Setting user from custom auth data:",
          userData
        );
        setUser(userData);
        console.log(
          "refreshAuth - User set from custom auth, new isAuthenticated should be:",
          !!userData
        );
      } catch (error) {
        console.error("Error parsing custom auth data in refreshAuth:", error);
        setUser(null);
      }
    } else {
      console.log("refreshAuth - No auth data found, setting user to null");
      setUser(null);
    }
    console.log("=== refreshAuth complete ===");
  };

  const value = {
    user,
    login,
    logout,
    hasPermission,
    hasRole,
    isAuthenticated: !!user,
    loading,
    submitMakerCheckerRequest,
    approveMakerCheckerRequest,
    rejectMakerCheckerRequest,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
