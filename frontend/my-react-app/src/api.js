import axios from "axios";

const api = axios.create({
  baseURL: "https://talconnect.onrender.com",
  withCredentials: true,
});

export default api;