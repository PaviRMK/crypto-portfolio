import API from "../api";

/* LOGIN USER */

export const loginUser = async (data) => {
  const response = await API.post("/auth/login", data);
  return response;
};

/* REGISTER USER */

export const registerUser = async (data) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

/* LOGOUT USER */

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  // Remove any auth-like keys without touching unrelated app preferences.
  Object.keys(localStorage).forEach((key) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes("auth") || lowerKey.includes("token") || lowerKey.includes("session")) {
      localStorage.removeItem(key);
    }
  });

  sessionStorage.clear();
};