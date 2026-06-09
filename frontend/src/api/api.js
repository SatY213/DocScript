import axios from "axios";
import { jwtDecode } from "jwt-decode";

axios.defaults.withCredentials = true;
export const api = axios.create({
  // baseURL: "https://doc-script-roan.vercel.app/api",
  baseURL: "http://localhost:3000/api",

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
  },
  withCredentials: true,
});
// export const apiLink = "https://doc-script-roan.vercel.app";
export const apiLink = "http://localhost:3000";

export const createEntity = async (endpoint, data) => {
  try {
    const response = await api.post(`/${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || `Failed to create ${endpoint}.`,
    );
  }
};

export async function setAuthHeaders(linkToken) {
  const token = localStorage.getItem("connexion_detail");
  api.defaults.headers.common["x-auth-token"] = linkToken ? linkToken : token;
  if (linkToken) {
    const decodedToken = jwtDecode(linkToken);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("connexion_detail");
      delete api.defaults.headers.common["x-auth-token"];
      return false;
    }
    console.log(decodedToken);

    return decodedToken;
  }
  const response = await api.get("auth/check", {});

  if (token && response.data.isAuthenticated) {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("connexion_detail");

      delete api.defaults.headers.common["x-auth-token"];
      return false;
    } else {
      api.defaults.headers.common["x-auth-token"] = token;
      return response.data;
    }
  } else {
    delete api.defaults.headers.common["x-auth-token"];
    return { isAuthenticated: false };
  }
}
export const deleteEntity = async (endpoint, id) => {
  try {
    const response = await api.delete(`/${endpoint}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || `Failed to delete ${endpoint}.`,
    );
  }
};

export const updateEntity = async (endpoint, id, data) => {
  try {
    const response = await api.patch(`/${endpoint}/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || `Failed to update ${endpoint}.`,
    );
  }
};

export const findOneEntity = async (endpoint, id) => {
  try {
    const response = await api.get(`/${endpoint}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || `Failed to fetch ${endpoint}.`,
    );
  }
};
export async function logout() {
  try {
    localStorage.removeItem("connexion_detail");
    window.location.href = "/";
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || `Failed to logout ${endpoint}.`,
    );
  }
}
