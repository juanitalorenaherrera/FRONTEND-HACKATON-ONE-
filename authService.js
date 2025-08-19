import axios from "axios";

const API_URL = "http://localhost:8080/auth"; // Ajustar si cambias backend

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const register = async (name, email, password, role) => {
  const res = await axios.post(`${API_URL}/register`, { name, email, password, role });
  return res.data;
};
