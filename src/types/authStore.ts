export interface State {
	token: string;
	profile: Profile | null;
	isAuth: boolean;
}

export interface Actions {
	setToken: (token: string) => void;
	setProfile: (profile: Profile) => void;
	logout: () => void;
}

export enum Role {
	CLIENT = 'CLIENT',
	SITTER = 'SITTER',
	ADMIN = 'ADMIN',
}

export interface Profile {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	role: Role;
	initials: string;
	accountId: number;
}

export interface LoginResponse {
	token: string;
	userProfile: Profile;
};

export interface RegisterResponse {
	token: string;
	role: Role;
	userProfile: Profile;
}
