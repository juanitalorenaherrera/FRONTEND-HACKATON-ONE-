import axios from 'axios';
import { useAuthStore } from '../store/AuthStore';

const baseURL = "http://44.207.65.254:8088";

const authApi = axios.create({
	baseURL: baseURL,
	withCredentials: true,
});

authApi.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token;
	if (token) {
		config.headers['Authorization'] = `Bearer ${token}`;
	}
	return config;
});

export default authApi;