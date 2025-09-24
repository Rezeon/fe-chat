import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export const followApi = () => {
  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  return {
    create: async (followed_id) => {
      return axios.post(`${api}/follow`, { followed_id }, authHeaders());
    },
    update: async (id, payload) => {
      return axios.put(`${api}/follow/${id}`, payload, authHeaders());
    },
    deleteF: async (followed_id) => {
      return axios.delete(
        `${api}/follow/unfollow?followed_id=${followed_id}`,
        authHeaders()
      );
    },

    followers: async () => {
      return axios.get(`${api}/follow/followers`, authHeaders());
    },
    followed: async () => {
      return axios.get(`${api}/follow/following`, authHeaders());
    },
  };
};
