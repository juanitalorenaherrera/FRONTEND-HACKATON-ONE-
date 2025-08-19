import axios from "axios";
const API_URL = "http://localhost:8080/sitters";

export const addService = async (token, service) => {
  const res = await axios.post(API_URL, service, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getServices = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
