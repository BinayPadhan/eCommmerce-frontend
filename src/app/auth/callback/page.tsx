"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/utils/authCookies";
import { useAuth } from "@/context/AuthContext";

const CallbackPage = () => {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const fetchUserFromCallback = async () => {
      // const hash = window.location.hash; // Strapi returns access_token in URL hash
      // const hashParams = new URLSearchParams(
      //   window.location.hash.replace("#", "")
      // );
      const searchParams = new URLSearchParams(window.location.search);
      console.log("searchParams",Object.fromEntries(searchParams.entries()));
      const token = searchParams.get("jwt");
      console.log("Token:", token);
      console.log("Looks like JWT:", token?.split(".").length === 3);
      if (token) {
        setToken(token); // Store token in cookie
        // Optionally: fetch user data
        const res = await fetch("http://localhost:1337/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = await res.json();
        console.log("User:", user);
        
        login(user); // Update AuthContext with user data

        // Redirect to home or dashboard
        router.push("/");
      } else {
        console.error("Access token not found in URL");
        router.push("/login");
      }
    };

    fetchUserFromCallback();
  }, [router, login]);

  return <div className="text-center mt-10">Logging you in...</div>;
};

export default CallbackPage;
