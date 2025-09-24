import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export const userApi = () => {
  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
  };
  const jsontype = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  return {
    login: async (payload) => {
      return axios.post(`${api}/login`, payload);
    },
    signUp: async (payload) => {
      return axios.post(`${api}/sign-up`, payload);
    },
    updateUser: async (id, payload) => {
      return axios.put(`${api}/users/${id}`, payload, authHeaders());
    },
    deleteUser: async (id) => {
      return axios.delete(`${api}/users/${id}`, authHeaders());
    },
    userById: async (id) => {
      return axios.get(`${api}/users/${id}`, authHeaders());
    },
    allUser: async () => {
      return axios.get(`${api}/users`, authHeaders());
    },
    me: async () => {
      return axios.get(`${api}/users/me`, authHeaders());
    },
    logout: async () => {
      return axios.post(`${api}/users/logout`, {}, authHeaders());
    },
    findUser: async (payload) => {
      return axios.post(`${api}/users/find`, payload, jsontype());
    },
  };
};
