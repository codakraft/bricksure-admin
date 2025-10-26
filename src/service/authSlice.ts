import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./authService";
import { RootState } from "../store/store";
import { stat } from "fs";
// import { AuthUserData } from "../types";

// Types for the auth state
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  role: string;
  permissions: string[];
}

export interface IMyBankInitialState {
  status:
    | "signup"
    | "signup-success"
    | "signup-error"
    | "idle"
    | "loading"
    | "login-success"
    | "login-error"
    | "login";
  authData: User;
  token?: string | null;
  isAuthenticated: boolean;
  //   authUser: AuthUserData | null;
}

const initState: IMyBankInitialState = {
  status: "idle",
  authData: {
    _id: "",
    email: "",
    firstName: "",
    lastName: "",
    isVerified: false,
    role: "",
    permissions: [],
  },
  token: "",
  isAuthenticated: false,
};

// Check localStorage for existing authentication on app initialization
const token = localStorage.getItem("bricksure-token");
const storedAdmin = localStorage.getItem("bricksure-admin");

if (token && storedAdmin) {
  try {
    const adminData = JSON.parse(storedAdmin);
    initState.token = token;
    initState.authData = adminData;
    initState.isAuthenticated = true;
    initState.status = "login-success";
  } catch {
    // If parsing fails, clear the stored data
    localStorage.removeItem("bricksure-token");
    localStorage.removeItem("bricksure_admin_user");
  }
}

export const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    logout: (state) => {
      state.status = "idle";
      state.authData = {
        _id: "",
        email: "",
        firstName: "",
        lastName: "",
        isVerified: false,
        role: "",
        permissions: [],
      };
      state.token = "";
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem("bricksure-token");
      localStorage.removeItem("bricksure-admin");
    },
    login: (state) => {
      state.status = "login";
    },
    loginSuccess: (state) => {
      state.status = "login-success";
      state.isAuthenticated = true;
    },
    loginError: (state) => {
      state.status = "login-error";
      state.isAuthenticated = false;
    },
    signupSuccess: (state) => {
      state.status = "signup-success";
    },
    signupError: (state) => {
      state.status = "signup-error";
      state.isAuthenticated = false;
    },
    authenticate: (state) => {
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.register.matchPending, (state) => {
      state.status = "signup";
    });
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, { payload }) => {
        const { data, token } = payload;
        console.log("Accessout", payload);
        if (data && token) {
          console.log("Data", data);
          
          // If user is Super Admin, give them all permissions
          let userPermissions = data.permissions ?? [];
          if (data.role === "Super Admin" || data.role === "super-admin") {
            userPermissions = [
              "*", // All permissions
              "policies.read",
              "users.read", 
              "wallet.read",
              "claims.read",
              "audit.read",
              "content.read",
              "certificates.issue",
              "analytics.read",
              "roles.read",
              "system.read"
            ];
          }
          
          state.authData = {
            _id: data._id,
            email: data.email ?? "",
            firstName: data.firstName ?? "",
            lastName: data.lastName ?? "",
            isVerified: data.isVerified ?? false,
            role: data.role ?? "",
            permissions: userPermissions,
          };
          localStorage.setItem("bricksure-token", token);
          localStorage.setItem("bricksure-admin", JSON.stringify(data));
          state.token = token;

          state.status = "signup-success";
          state.isAuthenticated = true;

          return;
        }
        state.status = "signup-error";
        state.isAuthenticated = false;

        return;
      }
    );
    builder.addMatcher(authApi.endpoints.login.matchRejected, (state) => {
      state.status = "signup-error";
      state.isAuthenticated = false;

      return;
    });
    builder.addMatcher(authApi.endpoints.login.matchPending, (state) => {
      state.status = "login";
    });
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        const { data: user, token } = payload;
        console.log("LoginSlice", token);
        if (!token) {
          console.log("User not verified");
          state.isAuthenticated = false;
          localStorage.setItem("bricksure-token", token);
          state.token = token;
          //   state.status = "login-success";
          return;
        }
        if (user && token) {
          console.log("Data Login", user);
          
          // If user is Super Admin, give them all permissions
          let userPermissions = user.permissions ?? [];
          if (user.role === "Super Admin" || user.role === "super-admin") {
            userPermissions = [
              "*", // All permissions
              "policies.read",
              "users.read", 
              "wallet.read",
              "claims.read",
              "audit.read",
              "content.read",
              "certificates.issue",
              "analytics.read",
              "roles.read",
              "system.read"
            ];
          }
          
          state.authData = {
            _id: user._id,
            email: user.email ?? "",
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            isVerified: user.isVerified ?? false,
            role: user.role ?? "",
            permissions: userPermissions,
          };
          localStorage.setItem("bricksure-token", token);
          localStorage.setItem("bricksure-admin", JSON.stringify(state.authData));
          state.token = token;
          state.isAuthenticated = true;

          state.status = "login-success";

          return;
        }
        state.status = "login-error";
        state.isAuthenticated = false;

        return;
      }
    );
    // builder.addMatcher(
    //   authApi.endpoints.verifyEmail.matchFulfilled,
    //   (state) => {
    //     state.isAuthenticated = true;
    //     state.status = "login-success";

    //     return;
    //   }
    // );
    // builder.addMatcher(
    //   authApi.endpoints.getUser.matchFulfilled,
    //   (state, { payload }) => {
    //     const { data } = payload;
    //     console.log("UserSlice", payload);
    //     if (data) {
    //       console.log("Data", data);
    //       state.authUser = {
    //         ...data,
    //       };

    //       state.status = "login-success";

    //       return;
    //     }
    //     state.status = "login-error";
    //     state.isAuthenticated = false;

    //     return;
    //   }
    // );
  },
});

export const {
  logout,
  login,
  signupSuccess,
  authenticate,
  loginError,
  loginSuccess,
} = authSlice.actions;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectCustomerInfo = (state: RootState) => state.auth.authData;
export const selectUserPermissions = (state: RootState) => state.auth.authData.permissions;

// Helper function to check if user has a specific permission
export const checkUserPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  if (!userPermissions || userPermissions.length === 0) return false;
  
  // If user has "*" permission, they have access to everything
  if (userPermissions.includes("*")) return true;
  
  // Check if user has the specific permission
  return userPermissions.includes(requiredPermission);
};

export default authSlice.reducer;
