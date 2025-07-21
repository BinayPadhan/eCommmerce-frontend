"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import { setToken } from "@/utils/authCookies";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirectPath = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(identifier, password);
      setToken(res.jwt); // Save JWT in cookies
      login(res.user); // Update AuthContext with user data
      router.push(redirectPath); // ✅ Redirect to original destination
      toast.success("User Logged in successfull!!");
    } catch (err) {
      console.error("Invalid credentials", err);
      toast.error("Invalid credentials");
    } finally{
      setLoading(false);
    }
  };

  // const handleGoogleLogin = () => {
  //   window.location.href = "http://localhost:1337/api/connect/google";
  // };

  return (
    <div className="min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 min-w-[350px] bg-white p-8 rounded shadow-md"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Login Account</h2>
          <input
            type="text"
            placeholder="Email or username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading? "Logging to account" : "Login" }
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Login Button */}
          {/* <button
          type="button"
          onClick={handleGoogleLogin}
          className="bg-white border border-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button> */}

          <p className="text-center text-gray-600 mt-4">
            Do not have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-800"
            >
              Register here
            </Link>
          </p>
        </form>
    </div>
  );
};

export default function LoginPageWithSuspense() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
