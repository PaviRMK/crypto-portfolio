import API from "../api";

/* LOGIN USER */

export const loginUser = async (data) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

/* REGISTER USER */

export const registerUser = async (data) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};