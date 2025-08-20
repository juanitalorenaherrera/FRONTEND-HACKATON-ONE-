import axios from 'axios';
const API_URL = 'http://localhost:8080/sitters';

interface ServiceData {
	type: string;
	price: string;
}

export const addService = async (token: string, service: ServiceData) => {
	const res = await axios.post(API_URL, service, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

export const getServices = async (token: string) => {
	const res = await axios.get(API_URL, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};
