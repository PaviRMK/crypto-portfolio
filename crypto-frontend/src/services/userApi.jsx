import API from "../api";

/**
 * Fetch current user profile from backend
 * GET /api/user/profile
 * Requires Authorization header with Bearer token
 */
export const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");

  console.log("[fetchUserProfile] Starting fetch...");
  console.log("[fetchUserProfile] Token exists:", !!token);

  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  try {
    console.log("[fetchUserProfile] Making request to GET /user/profile");
    const response = await API.get("/user/profile");
    console.log("[fetchUserProfile] Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("[fetchUserProfile] API error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data
    });
    throw error;
  }
};

/**
 * Update user profile
 * PUT /api/user/profile
 * Requires Authorization header with Bearer token
 */
export const updateUserProfile = async (profileData) => {
  console.log("[updateUserProfile] Sending profile update:", profileData);

  try {
    const response = await API.put("/user/profile", profileData);
    console.log("[updateUserProfile] Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("[updateUserProfile] API error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data
    });
    throw error;
  }
};

/**
 * Change user password
 * POST /api/user/change-password
 * Requires Authorization header with Bearer token
 */
export const changeUserPassword = async (passwordData) => {
  console.log("[changeUserPassword] Sending password change request");

  try {
    const response = await API.post("/user/change-password", passwordData);
    console.log("[changeUserPassword] Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("[changeUserPassword] API error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data
    });
    throw error;
  }
};
