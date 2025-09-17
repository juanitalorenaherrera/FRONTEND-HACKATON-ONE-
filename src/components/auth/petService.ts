import axios from '../../services/auth';

const API_URL = '/api/pets';

interface PetData {
	name: string;
	type: string;
}

export const addPet = async (name: string, type: string) => {
	const res = await axios.post<PetData>(API_URL, 
		{
			name,
			type
		}
	);
	return res.data;
};

export const getPets = async () => {
	const res = await axios.get(API_URL);
	return res.data;
};
