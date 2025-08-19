import axios from "axios";
const API_URL = "http://localhost:8080/pets";

export const addPet = async (token, pet) => {
  const res = await axios.post(API_URL, pet, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getPets = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
