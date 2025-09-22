import axios from '@/services/auth';

interface PetData {
	name: string;
	type: string;
}

export const addPet = async (pet: PetData) => {
	const res = await axios.post('/api/pets', pet);
	return res.data;
};

export const getPets = async () => {
	const res = await axios.get('/api/pets');
	return res.data;
};
