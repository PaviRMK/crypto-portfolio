import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchUserProfile } from "../services/userApi";

const UserContext = createContext();

/**
 * Fallback user data when API fails or token is missing
 */
const FALLBACK_USER = {
  id: null,
  name: "Guest User",
  email: "Not available"
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    const path = window.location.pathname;
    const isAuthPage = path === "/login" || path === "/register";

    console.log("[UserContext] loadUserProfile called");
    console.log("[UserContext] Token exists:", !!token);

    if (!token) {
      console.log("[UserContext] No token found in localStorage");
      setUser(FALLBACK_USER);
      setLoading(false);
      setError(null);

      if (!isAuthPage) {
        window.location.href = "/login";
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("[UserContext] Fetching user profile from API...");
      const userData = await fetchUserProfile();
      console.log("[UserContext] Profile fetched successfully:", userData);
      setUser(userData);
      setError(null);

      localStorage.setItem("userProfileCache", JSON.stringify(userData));
    } catch (err) {
      console.error("[UserContext] Failed to fetch user profile:", err);

      // Try to use cached data
      const cached = localStorage.getItem("userProfileCache");
      if (cached) {
        try {
          const cachedUser = JSON.parse(cached);
          console.log("[UserContext] Using cached user data:", cachedUser);
          setUser(cachedUser);
          setError("Using cached data - some information may be outdated");
        } catch (parseErr) {
          console.error("[UserContext] Failed to parse cached data", parseErr);
          setUser(FALLBACK_USER);
          setError(err.message || "Failed to load user profile");
        }
      } else {
        console.log("[UserContext] No cache available - using fallback");
        setUser(FALLBACK_USER);
        setError(err.message || "Failed to load user profile");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const updateUserProfile = useCallback((updatedUser) => {
    console.log("[UserContext] Updating user profile:", updatedUser);
    setUser(updatedUser);
    setError(null);
    localStorage.setItem("userProfileCache", JSON.stringify(updatedUser));
  }, []);

  const clearUser = useCallback(() => {
    console.log("[UserContext] Clearing user data");
    setUser(null);
    setError(null);
    localStorage.removeItem("userProfileCache");
  }, []);

  const value = {
    user,
    loading,
    error,
    loadUserProfile,
    updateUserProfile,
    clearUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
