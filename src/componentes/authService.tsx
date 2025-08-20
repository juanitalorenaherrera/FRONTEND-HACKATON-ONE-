import axios from 'axios';
const API_URL = 'http://localhost:8080/auth';

export const login = async (email: string, password: string) => {
	const res = await axios.post(`${API_URL}/login`, { email, password });
	return res.data;
};

export const register = async (email: string, password: string, role: string) => {
	const res = await axios.post(`${API_URL}/register`, { email, password, role });
	return res.data;
};