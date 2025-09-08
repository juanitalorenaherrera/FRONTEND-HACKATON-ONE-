import axios from 'axios';

const API_URL = 'http://localhost:8088/api/pets';

interface PetData {
	name: string;
	type: string;
}

export const addPet = async (token: string, pet: PetData) => {
	const res = await axios.post(API_URL, pet, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

export const getPets = async (token: string) => {
	const res = await axios.get(API_URL, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};
