import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/common/Button";
import { useNotifications } from "../../contexts/NotificationContext";
// import { useAuth } from "../../contexts/AuthContext";
import { useLoginMutation } from "../../service";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [login] = useLoginMutation();
  // const navigate = useNavigate();
  // const { refreshAuth } = useAuth();

  // const { login, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();

  // if (isAuthenticated) {
  //   return <Navigate to="/dashboard" replace />;
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Starting login attempt with:", { email, password: "***" });

    try {
      const res = await login({ email, password }).unwrap();
      console.log("Login response:", res.data);

      if (res.data && res.token) {
        console.log("Login successful, processing response...");
        console.log("User verification status:", res.data.isVerified);

        // The authSlice will automatically handle storing the tokens and user data
        // We just need to ensure AuthContext is updated to check the right keys

        // Store user data in format expected by AuthContext (using the keys authSlice uses)
        // const userData = {
        //   _id: res.data._id,
        //   email: res.data.email,
        //   firstName: res.data.firstName,
        //   lastName: res.data.lastName,
        //   role: res.data.role,
        //   isVerified: res.data.isVerified,
        //   permissions: res.data.permissions,
        // };

        // // The authSlice stores in 'bricksure-admin', but AuthContext looks for 'bricksure_admin_user'
        // // Let's store in both for compatibility
        // localStorage.setItem("bricksure_admin_user", JSON.stringify(userData));
        // localStorage.setItem("bricksure-token", JSON.stringify(res.token));

        addNotification({
          type: "success",
          title: "Welcome back!",
          message:
            "You have successfully signed in to BrickSure Admin Console.",
        });

        console.log("About to navigate to dashboard...");
        // Use a longer delay to ensure all state updates are processed
        // setTimeout(() => {
        //   console.log("Navigating to dashboard now...");
        //   console.log("Final localStorage check before navigation:", {
        //     bricksureToken:
        //       localStorage.getItem("bricksure-token")?.substring(0, 10) + "...",
        //     bricksureAdmin: localStorage.getItem("bricksure-admin"),
        //     authToken:
        //       localStorage.getItem("authToken")?.substring(0, 10) + "...",
        //     savedUser: localStorage.getItem("bricksure_admin_user"),
        //   });

        //   // Try to force a page reload instead of navigation to see if that works
        //   window.location.href = "/dashboard";
        // }, 200);
        window.location.href = "/dashboard";
      } else {
        console.log("Login failed - missing data or token:", {
          hasData: !!res.data,
          hasToken: !!res.token,
          response: res,
        });
        addNotification({
          type: "error",
          title: "Login failed",
          message: "Invalid email or password. Please try again.",
        });
      }
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        status?: number;
        data?: { message?: string };
        originalStatus?: number;
      };
      console.error("Login error:", error);
      console.error("Error details:", {
        message: errorObj.message,
        status: errorObj.status,
        data: errorObj.data,
        originalStatus: errorObj.originalStatus,
      });

      let errorMessage =
        "An error occurred while signing in. Please try again.";

      if (errorObj.status === 401) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (errorObj.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (errorObj.data?.message) {
        errorMessage = errorObj.data.message;
      }

      addNotification({
        type: "error",
        title: "Login error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              BrickSure Admin
            </h1>
            <p className="text-gray-600">Sign in to your admin console</p>
          </div>

          {/* Demo Credentials */}
          {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-700">Email: admin@bricksure.com</p>
            <p className="text-xs text-blue-700">Password: admin123</p>
          </div> */}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              BrickSure Admin Console v1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
